import { cache } from 'react';
import { publishedEntries, adminEntries } from '@/src/cms/repository';
import { text, list, type Entry } from '@/src/cms/schema';
import type { Post } from '@/src/types/post';
// CMS 글을 기존 공개 화면 형식으로 연결
export const toPost = (entry: Entry): Post => ({
  id: text(entry, 'legacyId') || entry.id,
  slug: entry.slug,
  title: entry.title,
  description: text(entry, 'description') || null,
  pub_date: text(entry, 'pubTimestamp') || text(entry, 'pubDate') || entry.created_at,
  thumbnail: text(entry, 'thumbnail'),
  tags: list(text(entry, 'tags')),
  keywords: list(text(entry, 'keywords')),
  content: typeof entry.data.body === 'string' ? entry.data.body : JSON.stringify(entry.data.body),
  content_format: text(entry, 'contentFormat') || 'legacy-mdx',
  published: entry.published,
  created_at: entry.created_at,
  updated_at: entry.updated_at,
});
// 공개 글 전체 조회
export const getAllPosts = cache(
  async (): Promise<Post[]> =>
    (await publishedEntries('post'))
      .map(toPost)
      .sort((a, b) => b.pub_date.localeCompare(a.pub_date)),
);
// 공개 글 단건 조회
export const getPost = cache(
  async (slug: string): Promise<Post | null> =>
    (await getAllPosts()).find((post) => post.slug === slug) ?? null,
);
// 공개 메타데이터 조회
export const getPostMeta = cache(async (slug: string) => {
  const post = await getPost(slug);
  if (!post) return null;
  return {
    title: post.title,
    description: post.description,
    thumbnail: post.thumbnail,
    slug: post.slug,
    keywords: post.keywords,
  };
});
// 공개 글 주소 조회
export const getAllPostSlugs = cache(async () =>
  (await getAllPosts()).map((post) => ({ slug: post.slug })),
);
// 공개 검색용 글 조회
export const getPostsForSearch = cache(async () =>
  (await getAllPosts()).map(({ title, slug, description, tags }) => ({
    title,
    slug,
    description,
    tags,
  })),
);
// 운영자 글 전체 조회
export const getAllPostsForAdmin = async () => (await adminEntries('post')).map(toPost);
// 운영자 글 단건 조회
export const getPostByAnySlug = async (slug: string) =>
  (await getAllPostsForAdmin()).find((post) => post.slug === slug) ?? null;
