import 'server-only';
import { cache } from 'react';
import { database } from './client';
import { auth } from '@/src/auth';
import { isOwner } from './owner';
import type { Entry, Kind, SiteSettings, Media } from './schema';

// 변경 작업의 운영자 권한 확인
export const requireOwner = async () => {
  const session = await auth();
  if (!isOwner(session)) throw new Error('Unauthorized');
  return session;
};
// 공개 콘텐츠만 조회
export const publishedEntries = cache(async (kind: Kind): Promise<Entry[]> => {
  const { data, error } = await database()
    .from('cms_entries')
    .select('*')
    .eq('kind', kind)
    .eq('published', true)
    .order('position')
    .order('created_at', { ascending: false });
  if (error) throw new Error('[repository::publishedEntries] ' + error.code);
  return (data ?? []) as Entry[];
});
// 관리자 콘텐츠 목록 조회
export const adminEntries = async (kind?: Kind): Promise<Entry[]> => {
  await requireOwner();
  let query = database()
    .from('cms_entries')
    .select('*')
    .order('position')
    .order('updated_at', { ascending: false });
  if (kind) query = query.eq('kind', kind);
  const { data, error } = await query;
  if (error) throw new Error('[repository::adminEntries] ' + error.code);
  return (data ?? []) as Entry[];
};
// 관리자 단일 콘텐츠 조회
export const adminEntry = async (id: string): Promise<Entry | null> => {
  await requireOwner();
  const { data, error } = await database()
    .from('cms_entries')
    .select('*')
    .eq('id', id)
    .maybeSingle();
  if (error) throw new Error('[repository::adminEntry] ' + error.code);
  return data as Entry | null;
};
// 요청 내 사이트 설정 공유
export const siteSettings = cache(async (): Promise<SiteSettings> => {
  const { data, error } = await database()
    .from('cms_settings')
    .select('data')
    .eq('id', 'site')
    .single();
  if (error || !data) throw new Error('[repository::siteSettings] CMS 초기 데이터 적용 필요');
  return data.data as SiteSettings;
});
// 공개 화면 문구 조회
export const publicCopy = cache(async (): Promise<Record<string, string>> => {
  const entries = await publishedEntries('copy');
  return Object.fromEntries(
    entries.map((entry) => [
      entry.slug,
      typeof entry.data.value === 'string' ? entry.data.value : '',
    ]),
  );
});
// 미디어 목록 조회
export const adminMedia = async (): Promise<Media[]> => {
  await requireOwner();
  const { data, error } = await database()
    .from('cms_media')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw new Error('[repository::adminMedia] ' + error.code);
  return (data ?? []) as Media[];
};
