// Supabase 포스트 쿼리
import { cache } from 'react';
import { serverClient } from '@/src/lib/supabase';
import type { Post } from '@/src/types/post';

// request 단위 캐싱 (generateMetadata + page 중복 호출 제거)
export const getPost = cache(async (slug: string): Promise<Post | null> => {
  if (!serverClient) return null;
  const { data } = await serverClient.from('posts').select('*').eq('slug', slug).single();
  return data;
});

// generateMetadata 전용 경량 쿼리
export const getPostMeta = cache(async (slug: string) => {
  if (!serverClient) return null;
  const { data } = await serverClient
    .from('posts')
    .select('title, description, thumbnail, slug, keywords')
    .eq('slug', slug)
    .single();
  return data;
});

// published 포스트 전체 조회 (날짜 내림차순)
export async function getAllPosts(): Promise<Post[]> {
  if (!serverClient) return [];
  const { data } = await serverClient
    .from('posts')
    .select('*')
    .eq('published', true)
    .order('pub_date', { ascending: false });
  return data ?? [];
}

// generateStaticParams 전용
export async function getAllPostSlugs() {
  if (!serverClient) return [];
  const { data } = await serverClient.from('posts').select('slug').eq('published', true);
  return (data ?? []).map((p) => ({ slug: p.slug }));
}

// CommandMenu 전용 경량 쿼리 (서버 정렬)
export async function getPostsForSearch() {
  if (!serverClient) return [];
  const { data } = await serverClient
    .from('posts')
    .select('title, slug, description, tags')
    .eq('published', true)
    .order('pub_date', { ascending: false });
  return data ?? [];
}
