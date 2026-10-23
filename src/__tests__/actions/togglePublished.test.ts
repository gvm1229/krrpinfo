import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createDatabaseMock } from '../helpers/cms-db';
const { authMock, dbMock } = vi.hoisted(() => ({ authMock: vi.fn(), dbMock: vi.fn() }));
vi.mock('@/src/auth', () => ({ auth: authMock }));
vi.mock('@/src/cms/client', () => ({ database: () => dbMock() }));
vi.mock('next/cache', () => ({ revalidatePath: vi.fn() }));
import { setEntryPublished, prepareUpload, completeUpload, deleteMedia } from '@/app/admin/actions';
const id = '11111111-1111-4111-a111-111111111111';
beforeEach(() => {
  process.env.AUTH_OWNER_ID = 'owner';
  authMock.mockResolvedValue({ user: { id: 'owner' }, expires: '2099-01-01T00:00:00Z' });
  dbMock.mockReturnValue(
    createDatabaseMock({
      cms_entries: [
        {
          id,
          kind: 'copy',
          slug: 'title',
          title: '문구',
          published: false,
          position: 0,
          data: { value: '내용' },
        },
      ],
    }),
  );
});
describe('공개 전환과 업로드 권한', () => {
  it('운영자 공개 전환 저장', async () => {
    const db = dbMock();
    await setEntryPublished(id, true);
    expect(db.tables.cms_entries[0].published).toBe(true);
  });
  it('미로그인과 만료 세션으로 공개 전환·업로드·삭제 차단', async () => {
    for (const session of [
      null,
      { user: { id: 'other' }, expires: '2099-01-01T00:00:00Z' },
      { user: { id: 'owner' }, expires: '2000-01-01T00:00:00Z' },
    ]) {
      authMock.mockResolvedValue(session);
      await expect(setEntryPublished(id, true)).rejects.toThrow('Unauthorized');
      await expect(prepareUpload({ name: 'x', contentType: 'image/png', size: 4 })).rejects.toThrow(
        'Unauthorized',
      );
      await expect(completeUpload('bad')).rejects.toThrow('Unauthorized');
      await expect(deleteMedia(id)).rejects.toThrow('Unauthorized');
    }
  });
  it('업로드 형식과 크기 제한', async () => {
    await expect(prepareUpload({ name: 'x', contentType: 'text/html', size: 4 })).rejects.toThrow();
    await expect(
      prepareUpload({ name: 'x', contentType: 'image/png', size: 21000000 }),
    ).rejects.toThrow();
  });
  it('사용 중인 미디어 삭제 거부', async () => {
    dbMock.mockReturnValue(
      createDatabaseMock({
        cms_media: [{ id, url: 'https://media.example.com/in-use', object_key: 'media/key' }],
        cms_entries: [{ data: { image: 'https://media.example.com/in-use' } }],
        cms_settings: [],
      }),
    );
    await expect(deleteMedia(id)).rejects.toThrow('사용 중인');
  });
});
