'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { database } from '@/src/cms/client';
import { requireOwner, adminEntry } from '@/src/cms/repository';
import { entryInput, settingsInput } from '@/src/cms/schema';
import { validateDocument } from '@/src/cms/blocks';
import { prepareMediaUpload, completeMediaUpload, removeMedia } from '@/src/cms/media';

// 모든 공개 화면과 관리 화면 갱신
const refresh = () => {
  revalidatePath('/', 'layout');
  revalidatePath('/admin', 'layout');
};
// 콘텐츠 생성·수정
export const saveEntry = async (input: unknown) => {
  await requireOwner();
  const parsed = entryInput.parse(input);
  if (parsed.id && ['navigation', 'copy'].includes(parsed.kind)) {
    const previous = await adminEntry(parsed.id);
    if (previous && previous.slug !== parsed.slug)
      throw new Error('기존 메뉴·문구 식별자는 변경 불가');
  }
  if (JSON.stringify(parsed.data).length > 500000) throw new Error('콘텐츠 크기 초과');
  if (parsed.kind === 'post') {
    const previous = parsed.id ? await adminEntry(parsed.id) : null;
    if (previous && previous.slug !== parsed.slug) throw new Error('기존 글 주소 변경 불가');
    if (!previous || previous.data.pubDate !== parsed.data.pubDate)
      parsed.data.pubTimestamp = new Date(
        String(parsed.data.pubDate) + 'T00:00:00+09:00',
      ).toISOString();
    const format = parsed.data.contentFormat;
    if (!['blocks', 'markdown', 'legacy-mdx', 'legacy-html'].includes(String(format)))
      throw new Error('본문 형식 확인 필요');
    if (format === 'blocks') validateDocument(parsed.data.body);
    if (format === 'legacy-mdx' || format === 'legacy-html') {
      if (
        !previous ||
        previous.data.body !== parsed.data.body ||
        previous.data.contentFormat !== format
      )
        throw new Error('기존 본문은 원문 보존 필요');
    }
  }
  if (
    parsed.kind === 'coupon' &&
    /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(String(parsed.data.expiresAt))
  )
    parsed.data.expiresAt = new Date(String(parsed.data.expiresAt) + '+09:00').toISOString();
  if (parsed.kind === 'navigation' && parsed.data.parent) {
    const { data: parents, error } = await database()
      .from('cms_entries')
      .select('slug,data')
      .eq('kind', 'navigation');
    if (
      error ||
      !parents?.some((parent) => parent.slug === parsed.data.parent && !parent.data.parent) ||
      parsed.data.parent === parsed.slug
    )
      throw new Error('상위 메뉴는 기존의 최상위 메뉴만 선택 가능');
  }
  const { id, ...entry } = parsed;
  const db = database();
  const result = id
    ? await db
        .from('cms_entries')
        .update({ ...entry, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select('id')
        .single()
    : await db.from('cms_entries').insert(entry).select('id').single();
  if (result.error) {
    console.error('[actions::saveEntry] ' + result.error.code);
    throw new Error(result.error.code === '23505' ? '이미 등록된 주소 또는 영상' : '저장 실패');
  }
  refresh();
  return result.data.id as string;
};
// 콘텐츠 삭제
export const deleteEntry = async (id: string) => {
  await requireOwner();
  z.string().uuid().parse(id);
  const entry = await adminEntry(id);
  if (!entry) throw new Error('콘텐츠를 찾을 수 없음');
  if (entry.kind === 'season' || entry.kind === 'category') {
    const { data, error } = await database().from('cms_entries').select('data').neq('id', id);
    if (error) throw new Error('사용처 확인 실패');
    if (JSON.stringify(data).includes(id)) throw new Error('다른 콘텐츠에서 사용 중인 항목');
  }
  if (entry.kind === 'navigation') {
    const { data, error } = await database()
      .from('cms_entries')
      .select('data')
      .eq('kind', 'navigation');
    if (error) throw new Error('하위 메뉴 확인 실패');
    if (data?.some((row) => row.data?.parent === entry.slug))
      throw new Error('하위 메뉴를 먼저 이동하거나 삭제해야 함');
  }
  const result = await database().from('cms_entries').delete().eq('id', id);
  if (result.error) throw new Error('[actions::deleteEntry] ' + result.error.code);
  refresh();
};
// 공개 상태 변경
export const setEntryPublished = async (id: string, published: boolean) => {
  await requireOwner();
  const entry = await adminEntry(z.string().uuid().parse(id));
  if (!entry) throw new Error('콘텐츠를 찾을 수 없음');
  return saveEntry({ ...entry, published: z.boolean().parse(published) });
};
// 사이트 설정 저장
export const saveSettings = async (input: unknown) => {
  await requireOwner();
  const data = settingsInput.parse(input);
  const result = await database()
    .from('cms_settings')
    .upsert({ id: 'site', data, updated_at: new Date().toISOString() });
  if (result.error) throw new Error('[actions::saveSettings] ' + result.error.code);
  refresh();
};
// R2 업로드 준비
export const prepareUpload = async (input: unknown) => prepareMediaUpload(input);
// R2 업로드 완료
export const completeUpload = async (ticket: string) => {
  const result = await completeMediaUpload(ticket);
  refresh();
  return result;
};
// 미디어 삭제
export const deleteMedia = async (id: string) => {
  await removeMedia(id);
  refresh();
};
// 미디어 대체 설명 저장
export const saveMediaAlt = async (id: string, alt: string) => {
  await requireOwner();
  z.string().uuid().parse(id);
  const result = await database()
    .from('cms_media')
    .update({ alt: z.string().max(1000).parse(alt) })
    .eq('id', id);
  if (result.error) throw new Error('[actions::saveMediaAlt] ' + result.error.code);
  refresh();
};
// YouTube 공개 정보 불러오기
export const fetchVideoInfo = async (url: string) => {
  await requireOwner();
  const parsed = new URL(url);
  if (!['www.youtube.com', 'youtube.com', 'youtu.be', 'm.youtube.com'].includes(parsed.hostname))
    throw new Error('YouTube 주소만 사용 가능');
  const id =
    parsed.hostname === 'youtu.be'
      ? parsed.pathname.slice(1)
      : (parsed.searchParams.get('v') ?? parsed.pathname.split('/').pop());
  if (!id || !/^[a-zA-Z0-9_-]{11}$/.test(id)) throw new Error('영상 주소 확인 필요');
  const response = await fetch(
    'https://www.youtube.com/oembed?url=' +
      encodeURIComponent('https://www.youtube.com/watch?v=' + id) +
      '&format=json',
    { signal: AbortSignal.timeout(10000) },
  );
  if (!response.ok) throw new Error('공개 영상 정보를 불러올 수 없음');
  const data: unknown = await response.json();
  const video = z
    .object({ title: z.string(), author_name: z.string(), thumbnail_url: z.string().url() })
    .parse(data);
  return {
    videoId: id,
    title: video.title,
    channelTitle: video.author_name,
    thumbnail: video.thumbnail_url,
  };
};
