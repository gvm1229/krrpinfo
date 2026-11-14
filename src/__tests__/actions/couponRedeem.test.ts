import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { handleUnified } from '@/app/actions/couponRedeem';
const npaCode = '07S0LCI10W02W';
const fetchMock = vi.fn();
// Nexon JSON 응답 생성
const reply = (body: unknown) => ({ json: async () => body });
beforeEach(() => {
  fetchMock.mockReset();
  vi.stubGlobal('fetch', fetchMock);
});
afterEach(() => vi.unstubAllGlobals());
describe('원클릭 쿠폰 사용', () => {
  it('조회한 첫 캐릭터에 쿠폰 사용', async () => {
    fetchMock
      .mockResolvedValueOnce(
        reply({ result: true, code: 0, message: '조회 완료', info: [{ id: '1', name: 'Megiii' }] }),
      )
      .mockResolvedValueOnce(reply({ result: true, code: 0, message: 'Success' }));
    const result = await handleUnified(npaCode, ' 쿠폰 ');
    expect(result).toEqual({
      success: true,
      message: '[Megiii] 에게 [쿠폰] 쿠폰 사용 성공',
      used: true,
    });
    expect(JSON.parse(fetchMock.mock.calls[1][1].body)).toMatchObject({
      coupon: '쿠폰',
      id: '1',
      npaCode,
    });
  });
  it('이미 사용한 쿠폰은 사용 완료 처리', async () => {
    fetchMock.mockResolvedValueOnce(
      reply({ result: false, code: 95100, message: '해당 쿠폰 완료 상태' }),
    );
    expect(await handleUnified(npaCode, '쿠폰')).toEqual({
      success: false,
      message: '이미 사용한 쿠폰',
      used: true,
    });
  });
  it('잘못된 회원번호는 요청 없이 거절', async () => {
    expect((await handleUnified('short', '쿠폰')).message).toBe('잘못된 회원번호');
    expect(fetchMock).not.toHaveBeenCalled();
  });
  it('연결 실패 시 내부 오류 비노출', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    fetchMock.mockRejectedValueOnce(new Error('secret detail'));
    expect(await handleUnified(npaCode, '쿠폰')).toEqual({
      success: false,
      message: '쿠폰 서버 연결 실패',
      used: false,
    });
  });
});
