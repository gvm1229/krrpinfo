import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createDatabaseMock } from '../helpers/cms-db';
const { authMock, dbMock } = vi.hoisted(() => ({ authMock: vi.fn(), dbMock: vi.fn() }));
vi.mock('@/src/auth', () => ({ auth: authMock }));
vi.mock('@/src/cms/client', () => ({ database: () => dbMock() }));
import {
  getPost,
  getPostMeta,
  getAllPostSlugs,
  getPostsForSearch,
  getAllPostsForAdmin,
} from '@/src/lib/queries';
beforeEach(() => {
  process.env.AUTH_OWNER_ID = 'owner';
  authMock.mockResolvedValue(null);
  dbMock.mockReturnValue(
    createDatabaseMock({
      cms_entries: [
        {
          id: 'public',
          kind: 'post',
          slug: 'public-post',
          title: 'Public',
          published: true,
          position: 0,
          created_at: '2026-01-01',
          updated_at: '2026-01-01',
          data: { pubDate: '2026-01-01', body: 'hello', contentFormat: 'markdown', tags: '팁' },
        },
        {
          id: 'draft',
          kind: 'post',
          slug: 'draft-post',
          title: 'Secret Draft',
          published: false,
          position: 0,
          created_at: '2026-01-01',
          updated_at: '2026-01-01',
          data: { body: 'secret draft' },
        },
      ],
    }),
  );
});
describe('실제 공개 조회 함수', () => {
  it('Draft를 본문·메타데이터·검색·사이트맵 주소에서 제외', async () => {
    expect(await getPost('draft-post')).toBeNull();
    expect(await getPostMeta('draft-post')).toBeNull();
    expect((await getPostsForSearch()).map((post) => post.slug)).toEqual(['public-post']);
    expect(await getAllPostSlugs()).toEqual([{ slug: 'public-post' }]);
    expect((await getPost('public-post'))?.content).toBe('hello');
  });
  it('관리자 조회에 실제 운영자 검사 적용', async () => {
    await expect(getAllPostsForAdmin()).rejects.toThrow('Unauthorized');
    authMock.mockResolvedValue({ user: { id: 'owner' }, expires: '2099-01-01T00:00:00Z' });
    expect((await getAllPostsForAdmin()).length).toBe(2);
  });
});
