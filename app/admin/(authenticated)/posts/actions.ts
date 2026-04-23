'use server';
import { auth, isOwner } from '@/src/auth';
import { clientPromise } from '@/src/util/db';
import { revalidatePath } from 'next/cache';

// 포스트 published 상태 토글 — owner 전용
export async function togglePublished(slug: string, next: boolean) {
  const session = await auth();
  if (!isOwner(session)) {
    console.error('[actions::togglePublished] Unauthorized — owner email mismatch');
    throw new Error('Unauthorized');
  }
  if (typeof slug !== 'string' || !/^[a-z0-9-]+$/i.test(slug)) {
    console.error(`[actions::togglePublished] Invalid slug: ${String(slug)}`);
    throw new Error('Invalid slug');
  }

  const client = await clientPromise;
  await client
    .db('krrpinfo')
    .collection('posts')
    .updateOne({ slug }, { $set: { published: next, updated_at: new Date() } });

  revalidatePath('/');
  revalidatePath('/admin/posts');
  revalidatePath('/posts');
  revalidatePath(`/posts/${slug}`);
}
