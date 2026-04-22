import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { startMongo, stopMongo, type MongoTestContext } from '@/src/__tests__/helpers/mongo-memory';
import { toArray, toDoc, restorePosts } from '@/scripts/restore-posts';

const sampleRow = {
  id: '01946218-44e1-42c7-9ead-1a5f056c678e',
  slug: 'redeem-how-to',
  title: '회원 번호 알아내기',
  description: 'desc',
  pub_date: '2024-04-29T00:00:00+00:00',
  thumbnail: '/p.webp',
  tags: '팁',
  keywords: ['k1', 'k2'],
  content: 'body',
  published: true,
  created_at: '2026-04-13T19:51:00.714245+00:00',
  updated_at: '2026-04-13T19:51:00.714245+00:00',
};

describe('toArray', () => {
  it('문자열 단일값을 배열로 변환', () => {
    expect(toArray('팁')).toEqual(['팁']);
  });

  it('배열 입력은 그대로 반환', () => {
    expect(toArray(['a', 'b'])).toEqual(['a', 'b']);
  });

  it('falsy/비문자열 입력은 빈 배열 반환', () => {
    expect(toArray(null)).toEqual([]);
    expect(toArray('')).toEqual([]);
    expect(toArray(undefined)).toEqual([]);
    expect(toArray(123)).toEqual([]);
  });

  it('반환 원소는 string 타입', () => {
    const result = toArray('foo');
    expect(typeof result[0]).toBe('string');
  });
});

describe('toDoc', () => {
  it('Supabase row를 올바른 형태로 변환', () => {
    const doc = toDoc(sampleRow);

    expect(doc.pub_date).toBeInstanceOf(Date);
    expect(doc.pub_date.getTime()).toBe(new Date('2024-04-29T00:00:00+00:00').getTime());

    expect(doc.tags).toEqual(['팁']);

    expect(doc.keywords).toEqual(['k1', 'k2']);

    const docNull = toDoc({ ...sampleRow, keywords: null });
    expect(docNull.keywords).toBeNull();
  });
});

describe('restorePosts (integration)', () => {
  let ctx: MongoTestContext;

  beforeAll(async () => {
    ctx = await startMongo('krrpinfo');
  });

  afterAll(async () => {
    await stopMongo(ctx);
  });

  beforeEach(async () => {
    await ctx.db
      .collection('posts')
      .drop()
      .catch(() => {});
  });

  const doc1 = toDoc({ ...sampleRow, slug: 'post-1', title: '첫 번째' });
  const doc2 = toDoc({ ...sampleRow, slug: 'post-2', title: '두 번째' });

  it('docs를 upsert하고 void 반환, 2개 문서 삽입, slug unique index 생성', async () => {
    const result = await restorePosts(ctx.uri, 'krrpinfo', [doc1, doc2]);

    expect(result).toBeUndefined();

    const count = await ctx.db.collection('posts').countDocuments();
    expect(count).toBe(2);

    const indexes = await ctx.db.collection('posts').indexes();
    const slugIndex = indexes.find((idx) => idx.key && idx.key.slug === 1 && idx.unique === true);
    expect(slugIndex).toBeDefined();
  });

  it('같은 docs로 두 번 호출해도 중복 없음, 업데이트 반영', async () => {
    // 1차 호출
    await restorePosts(ctx.uri, 'krrpinfo', [doc1, doc2]);
    expect(await ctx.db.collection('posts').countDocuments()).toBe(2);

    // 2차 호출: 중복 없음
    await restorePosts(ctx.uri, 'krrpinfo', [doc1, doc2]);
    expect(await ctx.db.collection('posts').countDocuments()).toBe(2);

    // title 변경 후 재호출: 값 반영
    const updatedDoc1 = { ...doc1, title: '수정된 제목' };
    await restorePosts(ctx.uri, 'krrpinfo', [updatedDoc1]);
    const found = await ctx.db.collection('posts').findOne({ slug: 'post-1' });
    expect(found?.title).toBe('수정된 제목');
  });
});
