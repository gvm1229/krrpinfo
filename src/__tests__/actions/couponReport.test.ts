import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { createDatabaseMock } from '../helpers/cms-db';
const { allowMock, dbMock, authMock } = vi.hoisted(() => ({
  allowMock: vi.fn(),
  dbMock: vi.fn(),
  authMock: vi.fn(),
}));
vi.mock('@/src/cms/rate-limit', () => ({ allowRequest: allowMock }));
vi.mock('@/src/cms/client', () => ({ database: () => dbMock() }));
vi.mock('@/src/auth', () => ({ auth: authMock }));
vi.mock('next/cache', () => ({ revalidatePath: vi.fn() }));
import { reportCoupon } from '@/app/actions/couponReport';
import { approveCouponReport } from '@/app/admin/actions';
const fetchMock = vi.fn();
// Nexon JSON 응답 생성
const reply = (body: unknown) => ({ json: async () => body });
let db: ReturnType<typeof createDatabaseMock>;
beforeEach(() => {
  allowMock.mockResolvedValue(true);
  fetchMock.mockReset();
  vi.stubGlobal('fetch', fetchMock);
  db = createDatabaseMock({
    cms_entries: [{ id: 'c1', kind: 'coupon', slug: 'c1', data: { code: 'OLDCODE' } }],
  });
  dbMock.mockReturnValue(db);
  process.env.AUTH_OWNER_ID = 'owner';
  authMock.mockResolvedValue({ user: { id: 'owner' }, expires: '2099-01-01T00:00:00Z' });
});
afterEach(() => vi.unstubAllGlobals());
describe('쿠폰 제보', () => {
  it('회원번호 없이 제보하면 확인 전 Draft 제보 저장', async () => {
    const result = await reportCoupon({ code: ' NEWCODE ', expiresAt: '2026-12-01' });
    expect(result.success).toBe(true);
    const saved = db.tables.cms_entries.find((row) => row.kind === 'coupon_report');
    expect(saved).toMatchObject({
      title: 'NEWCODE',
      published: false,
      data: { code: 'NEWCODE', expiresAt: '2026-12-01', verified: false },
    });
    expect(fetchMock).not.toHaveBeenCalled();
  });
  it('이미 등록된 코드는 대소문자 무관 거절', async () => {
    expect((await reportCoupon({ code: 'oldcode' })).success).toBe(false);
  });
  it('Nexon에서 사용할 수 없는 쿠폰이면 거절', async () => {
    fetchMock.mockResolvedValueOnce(
      reply({ result: false, code: 1, message: '해당 게임에서 사용할 수 없는 쿠폰' }),
    );
    const result = await reportCoupon({ code: 'FAKE', npaCode: '07S0LCI10W02W' });
    expect(result).toEqual({ success: false, message: '사용할 수 없는 쿠폰' });
    expect(db.tables.cms_entries.some((row) => row.kind === 'coupon_report')).toBe(false);
  });
  it('Nexon 조회 성공 시 확인됨으로 저장', async () => {
    fetchMock.mockResolvedValueOnce(
      reply({ result: true, code: 0, message: '조회 완료', info: [{ id: '1', name: 'a' }] }),
    );
    await reportCoupon({ code: 'REAL', npaCode: '07S0LCI10W02W' });
    expect(db.tables.cms_entries.find((row) => row.kind === 'coupon_report')?.data).toMatchObject({
      verified: true,
    });
  });
  it('호출 제한 초과 시 저장 안 함', async () => {
    allowMock.mockResolvedValueOnce(false);
    expect((await reportCoupon({ code: 'NEW' })).success).toBe(false);
    expect(db.tables.cms_entries).toHaveLength(1);
  });
});
describe('쿠폰 제보 승인', () => {
  it('승인 시 Published 쿠폰 생성 후 제보 삭제', async () => {
    const id = '22222222-2222-4222-a222-222222222222';
    db.tables.cms_entries.push({
      id,
      kind: 'coupon_report',
      slug: 'report-a',
      title: 'NEWCODE',
      published: false,
      data: { code: 'NEWCODE', expiresAt: '2026-12-01', verified: true },
    });
    await approveCouponReport(id);
    const coupon = db.tables.cms_entries.find(
      (row) => row.kind === 'coupon' && row.title === 'NEWCODE',
    );
    expect(coupon).toMatchObject({
      published: true,
      data: { code: 'NEWCODE', expiresAt: '2026-12-01T14:59:00.000Z' },
    });
    expect(db.tables.cms_entries.some((row) => row.id === id)).toBe(false);
  });
  it('운영자가 아니면 승인 거부', async () => {
    authMock.mockResolvedValue(null);
    await expect(approveCouponReport('22222222-2222-4222-a222-222222222222')).rejects.toThrow();
  });
});
