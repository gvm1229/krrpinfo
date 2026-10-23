import { readFile, writeFile, access } from 'node:fs/promises';
import { resolve, extname } from 'node:path';
import { pathToFileURL } from 'node:url';
import { createHash } from 'node:crypto';
import { createClient } from '@supabase/supabase-js';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { createMigration, remapReferences } from './migration';
// 텍스트에 포함된 직접 관리 이미지 주소 추출
export const localMediaReferences = (value: unknown): string[] => {
  const result = new Set<string>();
  const visit = (item: unknown) => {
    if (typeof item === 'string') {
      if (item.startsWith('/assets/') || /^\/(?:krrpLogo|opengraph|favicon|apple-touch)/.test(item))
        result.add(item);
      for (const match of item.matchAll(/(?:src=|\]\()\s*["']?(\/assets\/[^"'\s<>)]+)/g))
        result.add(match[1]);
    } else if (Array.isArray(item)) item.forEach(visit);
    else if (item && typeof item === 'object') Object.values(item).forEach(visit);
  };
  visit(value);
  return [...result];
};
// 안전한 소스 파일 경로 확인
const sourcePath = (reference: string) => {
  const root = resolve('public');
  const path = resolve(root, decodeURIComponent(reference).replace(/^\//, ''));
  if (!path.startsWith(root + '/') && !path.startsWith(root + '\\'))
    throw new Error('허용하지 않는 이미지 경로');
  return path;
};
// 이전 계획 점검과 명시적 적용
const main = async () => {
  const args = process.argv.slice(2).filter((value) => value !== '--');
  if (args.includes('--help')) {
    console.log(
      'cms:migrate --input backup/legacy-cms.json --dry-run | --apply [--report backup/cms-report.json]',
    );
    return;
  }
  const input = args[args.indexOf('--input') + 1];
  if (!args.includes('--input') || !input || input.startsWith('--'))
    throw new Error('--input으로 최신 백업 파일 지정 필요');
  if (!args.includes('--dry-run') && !args.includes('--apply'))
    throw new Error('--dry-run 또는 --apply 지정 필요');
  const seed = JSON.parse(await readFile(new URL('./seed.json', import.meta.url), 'utf8'));
  const snapshot = JSON.parse(await readFile(input, 'utf8'));
  const plan = createMigration(seed, snapshot);
  const references = localMediaReferences(plan);
  const missing: string[] = [];
  for (const reference of references) {
    try {
      await access(sourcePath(reference));
    } catch {
      missing.push(reference);
    }
  }
  const report = {
    ...plan.report,
    referencedMedia: references.length,
    missingAssets: missing,
    applied: false,
  };
  if (args.includes('--apply')) {
    const {
      SUPABASE_URL,
      SUPABASE_SECRET_KEY,
      R2_ACCOUNT_ID,
      R2_ACCESS_KEY_ID,
      R2_SECRET_ACCESS_KEY,
      R2_BUCKET,
      R2_PUBLIC_URL,
    } = process.env;
    if (!SUPABASE_URL || !SUPABASE_SECRET_KEY) throw new Error('Supabase 연결 설정 필요');
    if (
      !R2_ACCOUNT_ID ||
      !R2_ACCESS_KEY_ID ||
      !R2_SECRET_ACCESS_KEY ||
      !R2_BUCKET ||
      !R2_PUBLIC_URL
    )
      throw new Error('R2 연결 설정 필요');
    if (missing.length)
      throw new Error(
        '이전 원본 이미지 누락 ' + missing.length + '개 · 사전 점검 보고서 확인 필요',
      );
    const db = createClient(SUPABASE_URL, SUPABASE_SECRET_KEY, { auth: { persistSession: false } });
    const existing = await db.from('cms_entries').select('id,kind,slug');
    if (existing.error) throw new Error('초기 SQL 적용과 데이터 접근 권한 확인 필요');
    const storage = new S3Client({
      region: 'auto',
      endpoint: 'https://' + R2_ACCOUNT_ID + '.r2.cloudflarestorage.com',
      credentials: { accessKeyId: R2_ACCESS_KEY_ID, secretAccessKey: R2_SECRET_ACCESS_KEY },
    });
    const substitutions = new Map<string, string>();
    for (const reference of references) {
      const body = await readFile(sourcePath(reference));
      const key = 'media/' + createHash('sha256').update(body).digest('hex');
      const type: Record<string, string> = {
        '.png': 'image/png',
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.gif': 'image/gif',
        '.webp': 'image/webp',
        '.avif': 'image/avif',
        '.ico': 'image/x-icon',
      };
      const contentType = type[extname(reference).toLowerCase()];
      if (!contentType) throw new Error('지원하지 않는 이미지 형식: ' + reference);
      await storage.send(
        new PutObjectCommand({ Bucket: R2_BUCKET, Key: key, Body: body, ContentType: contentType }),
      );
      const url = R2_PUBLIC_URL.replace(/\/$/, '') + '/' + key;
      substitutions.set(reference, url);
      const media = await db.from('cms_media').upsert(
        {
          object_key: key,
          url,
          name: reference.split('/').pop(),
          alt: '',
          content_type: contentType,
          size: body.length,
        },
        { onConflict: 'object_key', ignoreDuplicates: true },
      );
      if (media.error) throw new Error('미디어 정보 저장 실패: ' + media.error.code);
    }
    const replace = (value: unknown): unknown => {
      if (typeof value === 'string') {
        let result = value;
        for (const [from, to] of substitutions) result = result.split(from).join(to);
        return result;
      }
      if (Array.isArray(value)) return value.map(replace);
      if (value && typeof value === 'object')
        return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, replace(item)]));
      return value;
    };
    const entries = remapReferences(
      replace(plan.entries) as typeof plan.entries,
      existing.data ?? [],
    );
    const settings = replace(plan.settings);
    const initial = await db
      .from('cms_settings')
      .upsert({ id: 'site', data: settings }, { onConflict: 'id', ignoreDuplicates: true });
    if (initial.error) throw new Error('사이트 설정 저장 실패: ' + initial.error.code);
    for (const entry of entries) {
      const result = await db
        .from('cms_entries')
        .upsert(entry, { onConflict: 'kind,slug', ignoreDuplicates: true });
      if (result.error) throw new Error('콘텐츠 저장 실패: ' + result.error.code);
    }
    const target = await db.from('cms_entries').select('kind,slug');
    if (target.error) throw new Error('이전 결과 조회 실패');
    const targetKeys = new Set((target.data ?? []).map((row) => row.kind + ':' + row.slug));
    if (entries.some((entry) => !targetKeys.has(entry.kind + ':' + entry.slug)))
      throw new Error('이전 결과에 누락된 콘텐츠');
    report.applied = true;
  }
  const reportIndex = args.indexOf('--report');
  if (reportIndex >= 0) {
    const path = args[reportIndex + 1];
    if (!path || path.startsWith('--')) throw new Error('보고서 경로 지정 필요');
    await writeFile(path, JSON.stringify(report, null, 2) + '\n');
  }
  console.log(JSON.stringify(report, null, 2));
};
if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href)
  void main().catch((error) => {
    console.error('[migrate::main] ' + (error instanceof Error ? error.message : '이전 실패'));
    process.exitCode = 1;
  });
