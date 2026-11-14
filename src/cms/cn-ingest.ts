import 'server-only';
import { createHash, randomUUID, timingSafeEqual } from 'node:crypto';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { z } from 'zod';
import { database } from './client';
import { storage } from './media';

const httpsUrl = z
  .string()
  .url()
  .max(2000)
  .refine((value) => value.startsWith('https://'), 'https 주소 필요');

// 수집기·cloud session이 보내는 중국 서버 소식 형식, summary가 비면 번역 대기
export const cnUpdateInput = z.object({
  sourceUrl: httpsUrl,
  sourceName: z.string().trim().min(1).max(100),
  publishedAt: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  title: z.string().trim().min(1).max(200),
  season: z.string().trim().max(100).default(''),
  summary: z.string().trim().max(2000).default(''),
  body: z.string().trim().max(20000).default(''),
  originalText: z.string().trim().max(20000).default(''),
  images: z.array(httpsUrl).max(20).default([]),
  krEta: z.string().trim().max(100).default(''),
});
export type CnUpdateInput = z.infer<typeof cnUpdateInput>;

// 수신 token 상수 시간 비교
export const validToken = (header: string | null) => {
  const expected = process.env.CN_INGEST_TOKEN;
  if (!expected || expected.length < 32 || !header?.startsWith('Bearer ')) return false;
  const digest = (value: string) => createHash('sha256').update(value).digest();
  return timingSafeEqual(digest(header.slice(7)), digest(expected));
};

const imageTypes: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/gif': 'gif',
};

const MAX_IMAGE_BYTES = 10 * 1024 * 1024;

// 내부망·loopback·link-local host 차단
export const publicImageHost = (url: string) => {
  const host = new URL(url).hostname.toLowerCase().replace(/^\[|\]$/g, '');
  if (host === 'localhost' || host.endsWith('.localhost') || host.endsWith('.internal'))
    return false;
  if (/^(0|10|127)\./.test(host) || /^169\.254\./.test(host) || /^192\.168\./.test(host))
    return false;
  if (
    /^172\.(1[6-9]|2\d|3[01])\./.test(host) ||
    /^100\.(6[4-9]|[7-9]\d|1[01]\d|12[0-7])\./.test(host)
  )
    return false;
  if (host.includes(':') && (host === '::1' || /^(fc|fd|fe80)/.test(host))) return false;
  return true;
};

// 상한까지만 응답 본문 읽기, 초과 시 null
const readLimited = async (response: Response) => {
  const declared = Number(response.headers.get('content-length') ?? 0);
  if (declared > MAX_IMAGE_BYTES || !response.body) return null;
  const reader = response.body.getReader();
  const chunks: Uint8Array[] = [];
  let total = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    total += value.byteLength;
    if (total > MAX_IMAGE_BYTES) {
      await reader.cancel();
      return null;
    }
    chunks.push(value);
  }
  return Buffer.concat(chunks);
};

// 원본 이미지를 R2로 복사, 실패 시 원본 주소 유지
const copyImage = async (url: string): Promise<string> => {
  try {
    if (!publicImageHost(url)) return url;
    const response = await fetch(url, { redirect: 'manual', signal: AbortSignal.timeout(10000) });
    const type = (response.headers.get('content-type') ?? '').split(';')[0].trim();
    if (response.status !== 200 || !imageTypes[type]) return url;
    const bytes = await readLimited(response);
    if (!bytes?.length) return url;
    const key = 'media/' + randomUUID();
    await storage().send(
      new PutObjectCommand({
        Bucket: process.env.R2_BUCKET,
        Key: key,
        Body: bytes,
        ContentType: type,
      }),
    );
    const publicUrl = process.env.R2_PUBLIC_URL!.replace(/\/$/, '') + '/' + key;
    await database()
      .from('cms_media')
      .insert({
        object_key: key,
        url: publicUrl,
        name: 'cn-' + key.slice(6) + '.' + imageTypes[type],
        alt: '',
        content_type: type,
        size: bytes.length,
      });
    return publicUrl;
  } catch (error) {
    console.error(`[cn-ingest::copyImage] ${error}`);
    return url;
  }
};

// 출처 주소 기준 중복을 막고 항상 Draft로 저장
export const ingestCnUpdate = async (input: CnUpdateInput) => {
  const db = database();
  const { data: existing, error } = await db
    .from('cms_entries')
    .select('data')
    .eq('kind', 'cn_update');
  if (error) throw new Error('[cn-ingest::ingestCnUpdate] ' + error.code);
  if (existing?.some((row) => row.data?.sourceUrl === input.sourceUrl))
    return { duplicate: true as const };
  const images = await Promise.all(input.images.map(copyImage));
  const result = await db
    .from('cms_entries')
    .insert({
      kind: 'cn_update',
      slug: 'cn-' + input.publishedAt + '-' + randomUUID().slice(0, 8),
      title: input.title,
      published: false,
      position: 0,
      data: { ...input, images: images.join('\n'), translated: input.summary !== '' },
    })
    .select('id')
    .single();
  if (result.error) throw new Error('[cn-ingest::ingestCnUpdate] ' + result.error.code);
  return { duplicate: false as const, id: result.data.id as string };
};

// 이미 저장된 출처 주소 목록
export const knownSourceUrls = async () => {
  const { data, error } = await database()
    .from('cms_entries')
    .select('data')
    .eq('kind', 'cn_update');
  if (error) throw new Error('[cn-ingest::knownSourceUrls] ' + error.code);
  return new Set((data ?? []).map((row) => String(row.data?.sourceUrl ?? '')));
};

// cloud session 번역 결과 형식
export const translationInput = z.object({
  id: z.string().uuid(),
  title: z.string().trim().min(1).max(200),
  summary: z.string().trim().min(1).max(2000),
  body: z.string().trim().max(20000).default(''),
  season: z.string().trim().max(100).default(''),
  krEta: z.string().trim().max(100).default(''),
});

// 번역 대기 Draft 목록, 오래된 순
export const pendingTranslations = async () => {
  const { data, error } = await database()
    .from('cms_entries')
    .select('id,title,data,created_at')
    .eq('kind', 'cn_update')
    .eq('published', false);
  if (error) throw new Error('[cn-ingest::pendingTranslations] ' + error.code);
  return (data ?? [])
    .filter((row) => row.data?.translated !== true)
    .sort((a, b) => String(a.created_at).localeCompare(String(b.created_at)))
    .map((row) => ({
      id: row.id as string,
      title: row.title as string,
      publishedAt: String(row.data?.publishedAt ?? ''),
      sourceUrl: String(row.data?.sourceUrl ?? ''),
      originalText: String(row.data?.originalText ?? ''),
      imageCount: String(row.data?.images ?? '')
        .split('\n')
        .filter(Boolean).length,
    }));
};

// 번역 결과 저장, 원문 제목 보존과 Draft 유지
export const saveTranslation = async (input: z.infer<typeof translationInput>) => {
  const db = database();
  const { data: row, error } = await db
    .from('cms_entries')
    .select('id,kind,title,published,data')
    .eq('id', input.id)
    .maybeSingle();
  if (error) throw new Error('[cn-ingest::saveTranslation] ' + error.code);
  if (!row || row.kind !== 'cn_update' || row.published) return false;
  const { id, title, ...fields } = input;
  const result = await db
    .from('cms_entries')
    .update({
      title,
      data: {
        ...row.data,
        ...fields,
        originalTitle: row.data?.originalTitle || row.title,
        translated: true,
      },
      updated_at: new Date().toISOString(),
    })
    .eq('id', id);
  if (result.error) throw new Error('[cn-ingest::saveTranslation] ' + result.error.code);
  return true;
};
