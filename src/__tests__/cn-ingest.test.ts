import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createDatabaseMock } from './helpers/cms-db';
const { dbMock } = vi.hoisted(() => ({ dbMock: vi.fn() }));
vi.mock('@/src/cms/client', () => ({ database: () => dbMock() }));
vi.mock('@/src/auth', () => ({ auth: vi.fn() }));
vi.mock('next/cache', () => ({ revalidatePath: vi.fn() }));
import { POST } from '@/app/api/ingest/cn-update/route';
const token = 'x'.repeat(40);
const payload = {
  sourceUrl: 'https://example.com/news/1',
  sourceName: '공식 공지',
  publishedAt: '2026-11-13',
  title: 'S48 시즌 예고',
  summary: '새 시즌과 카트 2종 공개',
};
// 수신 요청 생성
const send = (body: unknown, auth = 'Bearer ' + token) =>
  POST(
    new Request('http://localhost/api/ingest/cn-update', {
      method: 'POST',
      headers: { authorization: auth, 'content-type': 'application/json' },
      body: JSON.stringify(body),
    }),
  );
let db: ReturnType<typeof createDatabaseMock>;
beforeEach(() => {
  process.env.CN_INGEST_TOKEN = token;
  db = createDatabaseMock({ cms_entries: [] });
  dbMock.mockReturnValue(db);
});
describe('중국 서버 소식 수신', () => {
  it('잘못된 token 거부', async () => {
    expect((await send(payload, 'Bearer wrong')).status).toBe(401);
    expect(db.tables.cms_entries).toHaveLength(0);
  });
  it('token 미설정 시 모든 요청 거부', async () => {
    delete process.env.CN_INGEST_TOKEN;
    expect((await send(payload)).status).toBe(401);
  });
  it('형식 오류 거부', async () => {
    expect((await send({ ...payload, sourceUrl: 'http://x' })).status).toBe(400);
  });
  it('항상 Draft로 저장하고 같은 출처는 중복 저장 안 함', async () => {
    expect((await send({ ...payload, published: true })).status).toBe(201);
    expect(db.tables.cms_entries[0]).toMatchObject({
      kind: 'cn_update',
      published: false,
      title: 'S48 시즌 예고',
    });
    const again = await send(payload);
    expect(again.status).toBe(200);
    expect(await again.json()).toEqual({ duplicate: true });
    expect(db.tables.cms_entries).toHaveLength(1);
  });
});
