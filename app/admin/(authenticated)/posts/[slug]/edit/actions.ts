'use server';
import { auth, isOwner } from '@/src/auth';
import { clientPromise } from '@/src/util/db';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

// 소문자 + 숫자 + 하이픈 만 허용 — URL slug convention
const SLUG_RE = /^[a-z0-9-]+$/;
// 필드별 최대 길이 — 사고 paste / Mongo BSON 16MB 한계 방어
const MAX = {
  title: 300,
  description: 1000,
  thumbnail: 2048,
  content: 200_000,
  tagItems: 50,
  keywordItems: 50,
} as const;

type EditPostInput = {
  slug: string;
  title: string;
  description: string;
  tags: string; // 콤마 구분 문자열
  keywords: string; // 콤마 구분 문자열
  thumbnail: string;
  content: string;
  pubDate: string; // YYYY-MM-DD
};

// 포스트 필드 전체 수정 — owner 전용
export async function saveEdit(input: EditPostInput) {
  const session = await auth();
  if (!isOwner(session)) {
    console.error('[edit::saveEdit] Unauthorized — owner email mismatch');
    throw new Error('Unauthorized');
  }
  if (typeof input?.slug !== 'string' || !SLUG_RE.test(input.slug)) {
    console.error(`[edit::saveEdit] Invalid slug: ${String(input?.slug)}`);
    throw new Error('Invalid slug');
  }
  if (
    input.title.length > MAX.title ||
    input.description.length > MAX.description ||
    input.thumbnail.length > MAX.thumbnail ||
    input.content.length > MAX.content
  ) {
    console.error('[edit::saveEdit] Field too long');
    throw new Error('Field too long');
  }

  const tags = input.tags
    .split(',')
    .map((t) => t.trim())
    .filter(Boolean);
  const keywordsList = input.keywords
    .split(',')
    .map((k) => k.trim())
    .filter(Boolean);
  if (tags.length > MAX.tagItems || keywordsList.length > MAX.keywordItems) {
    console.error('[edit::saveEdit] Too many tags/keywords');
    throw new Error('Too many tags');
  }

  // KST 자정 기준 — input 이 'YYYY-MM-DD' 일 때 timezone drift 방지
  const pubDate = new Date(`${input.pubDate}T00:00:00+09:00`);
  if (Number.isNaN(pubDate.getTime())) {
    console.error(`[edit::saveEdit] Invalid pub_date: ${input.pubDate}`);
    throw new Error('Invalid pub_date');
  }

  const client = await clientPromise;
  const result = await client
    .db('krrpinfo')
    .collection('posts')
    .updateOne(
      { slug: input.slug },
      {
        $set: {
          title: input.title,
          description: input.description || null,
          tags,
          keywords: keywordsList.length ? keywordsList : null,
          thumbnail: input.thumbnail,
          content: input.content,
          pub_date: pubDate,
          updated_at: new Date(),
        },
      },
    );

  if (result.matchedCount === 0) {
    console.error(`[edit::saveEdit] Post not found: ${input.slug}`);
    throw new Error('Post not found');
  }

  revalidatePath('/');
  revalidatePath('/admin/posts');
  revalidatePath('/posts');
  revalidatePath(`/posts/${input.slug}`);
  redirect('/admin/posts');
}
