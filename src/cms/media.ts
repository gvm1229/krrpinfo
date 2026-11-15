import {
  S3Client,
  PutObjectCommand,
  HeadObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { createHmac, randomUUID, timingSafeEqual } from 'node:crypto';
import { z } from 'zod';
import { database } from './client';
import { requireOwner } from './repository';

const uploadSchema = z.object({
  name: z.string().min(1).max(255),
  contentType: z.enum(['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif']),
  size: z
    .number()
    .int()
    .positive()
    .max(20 * 1024 * 1024),
});
const ticketSchema = uploadSchema.extend({
  key: z.string().regex(/^media\/[a-f0-9-]+$/),
  expires: z.number(),
});
// R2 서버 연결
export const storage = () => {
  const { R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET, R2_PUBLIC_URL } =
    process.env;
  if (!R2_ACCOUNT_ID || !R2_ACCESS_KEY_ID || !R2_SECRET_ACCESS_KEY || !R2_BUCKET || !R2_PUBLIC_URL)
    throw new Error('R2 연결 설정 필요');
  return new S3Client({
    region: 'auto',
    endpoint: 'https://' + R2_ACCOUNT_ID + '.r2.cloudflarestorage.com',
    credentials: { accessKeyId: R2_ACCESS_KEY_ID, secretAccessKey: R2_SECRET_ACCESS_KEY },
  });
};
// 업로드 확인 표 서명
const signature = (payload: string) => {
  if (!process.env.AUTH_SECRET) throw new Error('AUTH_SECRET 설정 필요');
  return createHmac('sha256', process.env.AUTH_SECRET).update(payload).digest('hex');
};
// 운영자 업로드 주소와 확인 표 생성
export const prepareMediaUpload = async (input: unknown) => {
  await requireOwner();
  const parsed = uploadSchema.parse(input);
  const ticket = { ...parsed, key: 'media/' + randomUUID(), expires: Date.now() + 10 * 60 * 1000 };
  const payload = Buffer.from(JSON.stringify(ticket)).toString('base64url');
  const uploadUrl = await getSignedUrl(
    storage(),
    new PutObjectCommand({
      Bucket: process.env.R2_BUCKET,
      Key: ticket.key,
      ContentType: ticket.contentType,
    }),
    { expiresIn: 600 },
  );
  return { uploadUrl, ticket: payload + '.' + signature(payload) };
};
// 전송 파일과 서명 확인 후 미디어 등록
export const completeMediaUpload = async (signedTicket: string) => {
  await requireOwner();
  const [payload, encoded] = signedTicket.split('.');
  const expected = signature(payload ?? '');
  if (
    !encoded ||
    encoded.length !== expected.length ||
    !timingSafeEqual(Buffer.from(encoded), Buffer.from(expected))
  )
    throw new Error('업로드 확인 실패');
  const ticket = ticketSchema.parse(JSON.parse(Buffer.from(payload, 'base64url').toString()));
  if (ticket.expires < Date.now()) throw new Error('업로드 시간 만료');
  const head = await storage().send(
    new HeadObjectCommand({ Bucket: process.env.R2_BUCKET, Key: ticket.key }),
  );
  if (head.ContentLength !== ticket.size || head.ContentType !== ticket.contentType)
    throw new Error('전송 파일 정보 불일치');
  const media = {
    object_key: ticket.key,
    url: process.env.R2_PUBLIC_URL!.replace(/\/$/, '') + '/' + ticket.key,
    name: ticket.name,
    alt: '',
    content_type: ticket.contentType,
    size: ticket.size,
  };
  const { data, error } = await database()
    .from('cms_media')
    .upsert(media, { onConflict: 'object_key' })
    .select('*')
    .single();
  if (error) throw new Error('[media::completeMediaUpload] ' + error.code);
  return data as import('./schema').Media;
};
// 사용 중인 파일을 제외하고 삭제
export const removeMedia = async (id: string) => {
  await requireOwner();
  z.string().uuid().parse(id);
  const db = database();
  const { data: media, error } = await db.from('cms_media').select('*').eq('id', id).single();
  if (error || !media) throw new Error('미디어를 찾을 수 없음');
  const [entries, settings] = await Promise.all([
    db.from('cms_entries').select('data'),
    db.from('cms_settings').select('data'),
  ]);
  if (entries.error || settings.error) throw new Error('미디어 사용처 확인 실패');
  if (JSON.stringify([entries.data, settings.data]).includes(media.url))
    throw new Error('사용 중인 미디어는 먼저 콘텐츠에서 연결 해제 필요');
  await storage().send(
    new DeleteObjectCommand({ Bucket: process.env.R2_BUCKET, Key: media.object_key }),
  );
  const removed = await db.from('cms_media').delete().eq('id', id);
  if (removed.error) throw new Error('[media::removeMedia] ' + removed.error.code);
};
