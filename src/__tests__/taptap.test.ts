import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { createDatabaseMock } from './helpers/cms-db';
const { dbMock } = vi.hoisted(() => ({ dbMock: vi.fn() }));
vi.mock('@/src/cms/client', () => ({ database: () => dbMock() }));
vi.mock('@/src/auth', () => ({ auth: vi.fn() }));
vi.mock('next/cache', () => ({ revalidatePath: vi.fn() }));
import { parseMoment, parseOfficialList, momentUrl } from '@/src/cms/taptap';
import { GET as cron } from '@/app/api/cron/taptap/route';
import { GET as pending, PATCH as translate } from '@/app/api/ingest/cn-update/route';

// 실제 TapTap 구조를 줄인 상세 HTML
const detailHtml = (
  author = 'https://www.taptap.cn/user/27073530',
  date = new Date().toISOString(),
) =>
  `<html><head><script type="application/ld+json">${JSON.stringify({
    '@type': 'NewsArticle',
    headline: '雪精灵宝宝 &amp; 新赛季 - 跑跑卡丁车官方竞速版综合讨论 - TapTap 论坛',
    datePublished: date,
    author: { '@type': 'Person', url: author },
  })}</script></head><body>
  <div class="tap-rich-content__wrapper" itemprop="text">
  <div class="tap-rich-content__row" data-rich-content-index="0">都市霓虹点亮街头</div>
  <div class="tap-rich-content__row" data-rich-content-index="1"><span>冰雪精灵</span>跃入赛场 &lt;S47&gt;</div>
  <div class="tap-rich-content__row" data-rich-content-index="2"><img src="data:image/png;base64,AA" data-src="https://img2-tc.tapimg.com/moment/etag/Fpte46_20261111.png/_tap_ugc.jpg"></div>
  <div class="tap-rich-content__row" data-rich-content-index="3"><img data-src="https://img2-tc.tapimg.com/moment/etag/Fv31J6_20261111.jpeg/_tap_ugc.jpg"></div>
  </div><span class="reactions__tracker"></span>
  <img data-src="https://img2-tc.tapimg.com/moment/etag/Other_20250101.png/_tap_ugc.jpg">
  </body></html>`;
const listHtml =
  '<a href="/moment/869720983089447556?group_id=65192">a</a><a href="/moment/869720983089447556?group_id=65192">b</a><a href="/moment/866835834756665333?group_id=65192">c</a>';
const token = 't'.repeat(40);
let db: ReturnType<typeof createDatabaseMock>;
const fetchMock = vi.fn();
beforeEach(() => {
  process.env.CRON_SECRET = 'c'.repeat(32);
  process.env.CN_INGEST_TOKEN = token;
  db = createDatabaseMock({ cms_entries: [] });
  dbMock.mockReturnValue(db);
  fetchMock.mockReset();
  vi.stubGlobal('fetch', fetchMock);
  vi.useFakeTimers({ toFake: ['setTimeout'] });
});
afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
});
describe('TapTap parser', () => {
  it('목록의 글 ID를 순서대로 중복 없이 추출', () => {
    expect(parseOfficialList(listHtml)).toEqual(['869720983089447556', '866835834756665333']);
  });
  it('상세의 제목·한국 날짜·작성자·본문·본문 이미지만 추출', () => {
    const moment = parseMoment('1', detailHtml(undefined, '2026-11-11T15:20:40+00:00'));
    expect(moment).toMatchObject({
      title: '雪精灵宝宝 & 新赛季',
      publishedAt: '2026-11-12',
      author: 'https://www.taptap.cn/user/27073530',
      text: '都市霓虹点亮街头\n冰雪精灵跃入赛场 <S47>',
      images: [
        'https://img2-tc.tapimg.com/moment/etag/Fpte46_20261111.png',
        'https://img2-tc.tapimg.com/moment/etag/Fv31J6_20261111.jpeg',
      ],
    });
  });
  it('구조화 데이터가 없으면 null', () => {
    expect(parseMoment('1', '<html></html>')).toBeNull();
  });
});
// fetch 응답 생성
const html = (body: string, status = 200) => ({
  ok: status === 200,
  status,
  text: async () => body,
});
// cron 실행
const runCron = async (auth = 'Bearer ' + 'c'.repeat(32)) => {
  const promise = cron(
    new Request('http://localhost/api/cron/taptap', { headers: { authorization: auth } }),
  );
  await vi.runAllTimersAsync();
  return promise;
};
describe('TapTap 매일 수집', () => {
  it('CRON_SECRET이 다르면 거부', async () => {
    expect((await runCron('Bearer wrong')).status).toBe(401);
    expect(fetchMock).not.toHaveBeenCalled();
  });
  it('새 공식 글만 원문·이미지 Draft로 저장하고 다른 작성자는 건너뜀', async () => {
    db.tables.cms_entries.push({
      id: 'old',
      kind: 'cn_update',
      data: { sourceUrl: momentUrl('866835834756665333') },
    });
    fetchMock.mockImplementation(async (url: string) => {
      if (url.includes('/topic?')) return html(listHtml + '<a href="/moment/111111111">x</a>');
      if (url.endsWith('869720983089447556')) return html(detailHtml());
      if (url.endsWith('111111111')) return html(detailHtml('https://www.taptap.cn/user/1'));
      return { ok: false, status: 404, headers: new Headers(), body: null };
    });
    const response = await runCron();
    const report = await response.json();
    expect(report.saved).toEqual(['869720983089447556']);
    expect(report.skipped).toEqual([{ id: '111111111', reason: 'author' }]);
    const saved = db.tables.cms_entries.find(
      (row) => (row.data as { sourceUrl?: string }).sourceUrl === momentUrl('869720983089447556'),
    );
    expect(saved).toMatchObject({
      published: false,
      title: '雪精灵宝宝 & 新赛季',
      data: { translated: false, summary: '', sourceName: 'TapTap 공식 공지' },
    });
  });
  it('7일보다 오래된 글은 저장 안 함', async () => {
    fetchMock.mockImplementation(async (url: string) =>
      url.includes('/topic?')
        ? html('<a href="/moment/222222222">x</a>')
        : html(detailHtml(undefined, '2026-01-01T00:00:00+00:00')),
    );
    const report = await (await runCron()).json();
    expect(report.skipped).toEqual([{ id: '222222222', reason: 'old' }]);
    expect(db.tables.cms_entries).toHaveLength(0);
  });
  it('목록 요청 실패 시 502', async () => {
    fetchMock.mockResolvedValue(html('', 503));
    expect((await runCron()).status).toBe(502);
  });
});
describe('번역 대기 API', () => {
  const id = '44444444-4444-4444-a444-444444444444';
  // 번역 API 요청
  const call = (method: string, body?: unknown, auth = 'Bearer ' + token) =>
    new Request('http://localhost/api/ingest/cn-update', {
      method,
      headers: { authorization: auth, 'content-type': 'application/json' },
      body: body ? JSON.stringify(body) : undefined,
    });
  beforeEach(() => {
    db.tables.cms_entries.push({
      id,
      kind: 'cn_update',
      title: '雪精灵宝宝',
      published: false,
      created_at: '2026-11-15',
      data: {
        sourceUrl: momentUrl('1'),
        originalText: '原文',
        images: 'https://a/1.png',
        translated: false,
      },
    });
  });
  it('token 없으면 목록 거부', async () => {
    expect((await pending(call('GET', undefined, 'Bearer x'))).status).toBe(401);
  });
  it('번역 안 된 Draft만 반환하고 번역 저장 후 목록에서 빠짐', async () => {
    const list = await (await pending(call('GET'))).json();
    expect(list.pending).toEqual([
      expect.objectContaining({ id, originalText: '原文', imageCount: 1 }),
    ]);
    const saved = await translate(
      call('PATCH', { id, title: '눈 정령 아기', summary: '새 펫 공개', krEta: '약 10개월 뒤' }),
    );
    expect(saved.status).toBe(200);
    expect(db.tables.cms_entries[0]).toMatchObject({
      title: '눈 정령 아기',
      published: false,
      data: { summary: '새 펫 공개', translated: true, originalTitle: '雪精灵宝宝' },
    });
    expect((await (await pending(call('GET'))).json()).pending).toEqual([]);
  });
  it('운영자가 직접 쓴 Draft는 번역 대기에서 제외', async () => {
    db.tables.cms_entries.push({
      id: 'manual',
      kind: 'cn_update',
      title: '직접 작성',
      published: false,
      created_at: '2026-11-14',
      data: { summary: '운영자 요약' },
    });
    const list = await (await pending(call('GET'))).json();
    expect(list.pending.map((item: { id: string }) => item.id)).toEqual([id]);
  });
  it('Published 항목은 번역으로 덮어쓰지 않음', async () => {
    db.tables.cms_entries[0].published = true;
    const response = await translate(call('PATCH', { id, title: '변경', summary: '변경' }));
    expect(response.status).toBe(404);
    expect(db.tables.cms_entries[0].title).toBe('雪精灵宝宝');
  });
});
