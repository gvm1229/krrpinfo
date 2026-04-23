// MongoDB 포스트 쿼리
import { cache } from 'react';
import { clientPromise } from '@/src/util/db';
import type { Post } from '@/src/types/post';

const DB_NAME = 'krrpinfo';

type PostDoc = Omit<Post, 'pub_date' | 'created_at' | 'updated_at'> & {
  pub_date: Date;
  created_at: Date;
  updated_at: Date;
};

type PostMeta = Pick<Post, 'title' | 'description' | 'thumbnail' | 'slug' | 'keywords'>;
type PostSearch = Pick<Post, 'title' | 'slug' | 'description' | 'tags'>;

const collection = async () => {
  const client = await clientPromise;
  return client.db(DB_NAME).collection<PostDoc>('posts');
};

const toPost = (doc: PostDoc): Post => ({
  ...doc,
  pub_date: doc.pub_date.toISOString(),
  created_at: doc.created_at.toISOString(),
  updated_at: doc.updated_at.toISOString(),
});

// request 단위 캐싱 (generateMetadata + page 중복 호출 제거)
export const getPost = cache(async (slug: string): Promise<Post | null> => {
  const posts = await collection();
  // String() 강제 변환으로 NoSQL injection 방지
  const doc = await posts.findOne({ slug: String(slug), published: true });
  return doc ? toPost(doc) : null;
});

// generateMetadata 전용 경량 쿼리
export const getPostMeta = cache(async (slug: string): Promise<PostMeta | null> => {
  const posts = await collection();
  const doc = await posts.findOne(
    { slug: String(slug), published: true },
    { projection: { title: 1, description: 1, thumbnail: 1, slug: 1, keywords: 1, _id: 0 } },
  );
  return doc as PostMeta | null;
});

// published 포스트 전체 조회 (날짜 내림차순)
export async function getAllPosts(): Promise<Post[]> {
  const posts = await collection();
  const docs = await posts.find({ published: true }).sort({ pub_date: -1 }).toArray();
  return docs.map(toPost);
}

// generateStaticParams 전용
export async function getAllPostSlugs(): Promise<Array<{ slug: string }>> {
  const posts = await collection();
  const docs = await posts.find({ published: true }, { projection: { slug: 1, _id: 0 } }).toArray();
  return docs.map((p) => ({ slug: p.slug }));
}

// admin 전용 — published/draft 구분 없이 전체 조회 (updated_at 내림차순)
export async function getAllPostsForAdmin(): Promise<Post[]> {
  const posts = await collection();
  const docs = await posts.find({}).sort({ updated_at: -1 }).toArray();
  return docs.map(toPost);
}

// admin 편집용 — published 필터 없이 slug 단건 조회
export const getPostByAnySlug = cache(async (slug: string): Promise<Post | null> => {
  const posts = await collection();
  const doc = await posts.findOne({ slug: String(slug) });
  return doc ? toPost(doc) : null;
});

// CommandMenu 전용 경량 쿼리 (서버 정렬)
export async function getPostsForSearch(): Promise<PostSearch[]> {
  const posts = await collection();
  const docs = await posts
    .find(
      { published: true },
      { projection: { title: 1, slug: 1, description: 1, tags: 1, _id: 0 } },
    )
    .sort({ pub_date: -1 })
    .toArray();
  return docs as unknown as PostSearch[];
}
