import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createDatabaseMock } from '../helpers/cms-db';
import { stableId } from '../../../scripts/cms/migration';
const { authMock, dbMock } = vi.hoisted(() => ({ authMock: vi.fn(), dbMock: vi.fn() }));
vi.mock('@/src/auth', () => ({ auth: authMock }));
vi.mock('@/src/cms/client', () => ({ database: () => dbMock() }));
vi.mock('next/cache', () => ({ revalidatePath: vi.fn() }));
import { saveEntry, fetchVideoInfo } from '@/app/admin/actions';
const input = {
  kind: 'post',
  slug: 'new-post',
  title: '테스트',
  published: false,
  position: 0,
  data: {
    pubDate: '2026-10-21',
    contentFormat: 'blocks',
    body: [{ type: 'paragraph', children: [{ type: 'text', text: 'Hello' }] }],
  },
};
beforeEach(() => {
  process.env.AUTH_OWNER_ID = 'owner';
  authMock.mockResolvedValue({ user: { id: 'owner' }, expires: '2099-01-01T00:00:00Z' });
  dbMock.mockReturnValue(createDatabaseMock());
});
describe('실제 CMS 저장 경계', () => {
  for (const session of [
    null,
    { user: { id: 'other' }, expires: '2099-01-01T00:00:00Z' },
    { user: { id: 'owner' }, expires: '2000-01-01T00:00:00Z' },
  ])
    it('권한 없는 저장과 영상 조회 거부', async () => {
      authMock.mockResolvedValue(session);
      await expect(saveEntry(input)).rejects.toThrow('Unauthorized');
      await expect(fetchVideoInfo('https://www.youtube.com/watch?v=AbCdEf12345')).rejects.toThrow(
        'Unauthorized',
      );
      expect(dbMock).not.toHaveBeenCalled();
    });
  it('운영자의 새 글 저장', async () => {
    const db = createDatabaseMock();
    dbMock.mockReturnValue(db);
    await saveEntry(input);
    expect(db.tables.cms_entries[0].published).toBe(false);
    expect(db.tables.cms_entries[0].data).toEqual({
      ...input.data,
      pubTimestamp: '2026-10-20T15:00:00.000Z',
    });
  });
  it('실행 가능한 주소와 임의 블록 거부', async () => {
    await expect(
      saveEntry({
        ...input,
        data: {
          ...input.data,
          body: [
            { type: 'link', url: 'javascript:alert(1)', children: [{ type: 'text', text: 'bad' }] },
          ],
        },
      }),
    ).rejects.toThrow();
    await expect(
      saveEntry({
        ...input,
        data: {
          ...input.data,
          body: [{ type: 'script', children: [{ type: 'text', text: 'bad' }] }],
        },
      }),
    ).rejects.toThrow();
  });
  it('기존 글 주소와 기존 본문 변경 거부', async () => {
    const id = stableId('post:old');
    dbMock.mockReturnValue(
      createDatabaseMock({
        cms_entries: [
          {
            id,
            kind: 'post',
            slug: 'old',
            title: 'old',
            published: true,
            position: 0,
            data: {
              pubDate: '2026-10-21',
              contentFormat: 'legacy-mdx',
              body: '<Callout>보존</Callout>',
            },
          },
        ],
      }),
    );
    await expect(saveEntry({ ...input, id, slug: 'changed' })).rejects.toThrow('기존 글 주소');
    await expect(
      saveEntry({
        ...input,
        id,
        slug: 'old',
        data: { pubDate: '2026-10-21', contentFormat: 'legacy-mdx', body: 'changed' },
      }),
    ).rejects.toThrow('원문 보존');
  });
});
