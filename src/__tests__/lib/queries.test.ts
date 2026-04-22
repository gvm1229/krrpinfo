import { describe, it, expect, beforeAll, afterAll, vi } from 'vitest';
import type { MongoTestContext } from '../helpers/mongo-memory';
import { startMongo, stopMongo } from '../helpers/mongo-memory';

// Mock env.mjs early to satisfy any transitive imports
vi.mock('@/env.mjs', () => ({
  env: {
    MONGODB_URL: 'mongodb://localhost:27017/test',
    NEXT_PUBLIC_APP_URL: 'http://localhost:3000',
    YOUTUBE_API_KEY: 'test',
    NEXON_API_KEY: 'test',
    AUTH_SECRET: 'test',
    AUTH_GOOGLE_ID: 'test',
    AUTH_GOOGLE_SECRET: 'test',
  },
}));

let ctx: MongoTestContext;

// Lazy-imported module references (populated after doMock + dynamic import)
let getPost: (slug: string) => Promise<import('@/src/types/post').Post | null>;
let getPostMeta: (slug: string) => Promise<{
  title: string;
  description: string | null;
  thumbnail: string;
  slug: string;
  keywords: string[] | null;
} | null>;
let getAllPosts: () => Promise<import('@/src/types/post').Post[]>;
let getAllPostSlugs: () => Promise<Array<{ slug: string }>>;
let getPostsForSearch: () => Promise<
  Array<{ title: string; slug: string; description: string | null; tags: string[] }>
>;

beforeAll(async () => {
  // 1. Start in-memory MongoDB
  ctx = await startMongo('krrpinfo');

  // 2. Seed fixture data
  const now = new Date('2026-04-13T19:51:00Z');
  await ctx.db.collection('posts').insertMany([
    {
      id: 'p1',
      slug: 'published-post',
      title: 'Published',
      description: 'desc1',
      pub_date: new Date('2026-04-15T00:00:00Z'),
      thumbnail: '/p.webp',
      tags: ['팁'],
      keywords: ['k1'],
      content: 'body1',
      published: true,
      created_at: now,
      updated_at: now,
    },
    {
      id: 'p2',
      slug: 'draft-post',
      title: 'Draft',
      description: null,
      pub_date: new Date('2026-04-10T00:00:00Z'),
      thumbnail: '/d.webp',
      tags: ['팁'],
      keywords: null,
      content: 'body2',
      published: false,
      created_at: now,
      updated_at: now,
    },
    {
      id: 'p3',
      slug: 'older-published',
      title: 'Older',
      description: 'desc3',
      pub_date: new Date('2026-04-01T00:00:00Z'),
      thumbnail: '/o.webp',
      tags: ['튜토리얼'],
      keywords: null,
      content: 'body3',
      published: true,
      created_at: now,
      updated_at: now,
    },
  ]);

  // 3. Mock db module to use the in-memory client
  vi.doMock('@/src/util/db', () => ({
    clientPromise: Promise.resolve(ctx.client),
  }));

  // 4. Dynamically import queries AFTER the mock is set up
  const queries = await import('@/src/lib/queries');
  getPost = queries.getPost;
  getPostMeta = queries.getPostMeta;
  getAllPosts = queries.getAllPosts;
  getAllPostSlugs = queries.getAllPostSlugs;
  getPostsForSearch = queries.getPostsForSearch;
}, 90000);

afterAll(async () => {
  await stopMongo(ctx);
});

describe('getPost', () => {
  it('returns a Post with pub_date as ISO string for a published slug', async () => {
    const post = await getPost('published-post');
    expect(post).not.toBeNull();
    expect(post!.pub_date).toBe('2026-04-15T00:00:00.000Z');
    expect(post!.slug).toBe('published-post');
    expect(post!.title).toBe('Published');
    expect(post!.description).toBe('desc1');
    expect(post!.thumbnail).toBe('/p.webp');
    expect(post!.tags).toEqual(['팁']);
    expect(post!.keywords).toEqual(['k1']);
    expect(post!.content).toBe('body1');
    expect(post!.published).toBe(true);
    expect(typeof post!.created_at).toBe('string');
    expect(typeof post!.updated_at).toBe('string');
  });

  it('returns null for a nonexistent slug', async () => {
    const post = await getPost('nonexistent');
    expect(post).toBeNull();
  });

  it('returns null for a draft post (published filter)', async () => {
    const post = await getPost('draft-post');
    expect(post).toBeNull();
  });

  it('returns null for NoSQL injection attempt (Object coerced to string)', async () => {
    const post = await getPost({ $ne: null } as unknown as string);
    expect(post).toBeNull();
  });

  it('returns same result on repeated calls (cache value stability)', async () => {
    const post1 = await getPost('published-post');
    const post2 = await getPost('published-post');
    expect(post1).toEqual(post2);
    expect(post2!.pub_date).toBe('2026-04-15T00:00:00.000Z');
  });
});

describe('getPostMeta', () => {
  it('returns only projected fields (no _id, content, pub_date)', async () => {
    const meta = await getPostMeta('published-post');
    expect(meta).not.toBeNull();
    const keys = Object.keys(meta!);
    expect(keys).toContain('title');
    expect(keys).toContain('description');
    expect(keys).toContain('thumbnail');
    expect(keys).toContain('slug');
    expect(keys).toContain('keywords');
    expect(keys).not.toContain('_id');
    expect(keys).not.toContain('content');
    expect(keys).not.toContain('pub_date');
  });
});

describe('getAllPosts', () => {
  it('returns only published posts sorted by pub_date descending', async () => {
    const posts = await getAllPosts();
    expect(posts).toHaveLength(2);
    expect(posts[0]!.slug).toBe('published-post');
    expect(posts[1]!.slug).toBe('older-published');
  });
});

describe('getAllPostSlugs', () => {
  it('returns slug-only objects for all published posts', async () => {
    const slugs = await getAllPostSlugs();
    expect(slugs).toHaveLength(2);
    const slugValues = slugs.map((s) => s.slug);
    expect(slugValues).toContain('published-post');
    expect(slugValues).toContain('older-published');
    // Each item must only have the slug key
    for (const item of slugs) {
      expect(Object.keys(item)).toEqual(['slug']);
    }
  });
});

describe('getPostsForSearch', () => {
  it('returns search projection for published posts sorted by pub_date descending', async () => {
    const results = await getPostsForSearch();
    expect(results).toHaveLength(2);
    expect(results[0]!.slug).toBe('published-post');
    expect(results[1]!.slug).toBe('older-published');
    // Each item must have exactly the projected fields
    for (const item of results) {
      const keys = Object.keys(item);
      expect(keys).toContain('title');
      expect(keys).toContain('slug');
      expect(keys).toContain('description');
      expect(keys).toContain('tags');
      expect(keys).not.toContain('_id');
      expect(keys).not.toContain('content');
      expect(keys).not.toContain('pub_date');
    }
  });

  it('tags is an array in returned search data (schema integrity regression)', async () => {
    const results = await getPostsForSearch();
    for (const item of results) {
      expect(Array.isArray(item.tags)).toBe(true);
    }
  });
});
