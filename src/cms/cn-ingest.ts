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

// cloud session이 보내는 중국 서버 업데이트 형식
export const cnUpdateInput = z.object({
  sourceUrl: httpsUrl,
  sourceName: z.string().trim().min(1).max(100),
  publishedAt: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  title: z.string().trim().min(1).max(200),
  season: z.string().trim().max(100).default(''),
  summary: z.string().trim().min(1).max(2000),
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

// 원본 이미지를 R2로 복사, 실패 시 원본 주소 유지
const copyImage = async (url: string): Promise<string> => {
  try {
    const response = await fetch(url, { signal: AbortSignal.timeout(15000) });
    const type = (response.headers.get('content-type') ?? '').split(';')[0].trim();
    if (!response.ok || !imageTypes[type]) return url;
    const bytes = Buffer.from(await response.arrayBuffer());
    if (!bytes.length || bytes.length > 10 * 1024 * 1024) return url;
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
  const images: string[] = [];
  for (const url of input.images) images.push(await copyImage(url));
  const result = await db
    .from('cms_entries')
    .insert({
      kind: 'cn_update',
      slug: 'cn-' + input.publishedAt + '-' + randomUUID().slice(0, 8),
      title: input.title,
      published: false,
      position: 0,
      data: { ...input, images: images.join('\n') },
    })
    .select('id')
    .single();
  if (result.error) throw new Error('[cn-ingest::ingestCnUpdate] ' + result.error.code);
  return { duplicate: false as const, id: result.data.id as string };
};
