'use server';

import { randomBytes } from 'node:crypto';
import { database } from '@/src/cms/client';
import { handleUserLookup } from '@/src/cms/nexon';
import { allowRequest } from '@/src/cms/rate-limit';

type ReportResponse = { success: boolean; message: string };

// Nexon 조회로 쿠폰 존재 여부 확인, 확인 불가 시 null
const verifyCoupon = async (npaCode: string, code: string): Promise<boolean | null> => {
  if (!/^[a-zA-Z0-9]{13}$/.test(npaCode)) return null;
  try {
    const lookup = await handleUserLookup({ npaCode, coupon: code, region: 'KR' });
    if (lookup.result || lookup.message === '해당 쿠폰 완료 상태') return true;
    if (['해당 게임에서 사용할 수 없는 쿠폰', '쿠폰사용기간이 아님'].includes(lookup.message))
      return false;
    return null;
  } catch (error) {
    console.error(`[couponReport::verifyCoupon] ${error}`);
    return null;
  }
};

// 익명 쿠폰 제보를 승인 대기 항목으로 저장
export async function reportCoupon(input: {
  code: string;
  expiresAt?: string;
  npaCode?: string;
}): Promise<ReportResponse> {
  if (typeof input?.code !== 'string') return { success: false, message: '쿠폰 코드 확인 필요' };
  const code = input.code.trim();
  const expiresAt = typeof input.expiresAt === 'string' ? input.expiresAt : '';
  if (!code || code.length > 60) return { success: false, message: '쿠폰 코드 확인 필요' };
  if (
    expiresAt &&
    (!/^\d{4}-\d{2}-\d{2}$/.test(expiresAt) ||
      new Date(expiresAt + 'T00:00:00Z').toISOString().slice(0, 10) !== expiresAt)
  )
    return { success: false, message: '만료일 형식 확인 필요' };
  if (!(await allowRequest('report', 5, 3600)))
    return { success: false, message: '제보가 많아 잠시 후 다시 시도' };

  const db = database();
  const { data: existing, error } = await db
    .from('cms_entries')
    .select('kind,data')
    .in('kind', ['coupon', 'coupon_report']);
  if (error) {
    console.error('[couponReport::reportCoupon] ' + error.code);
    return { success: false, message: '제보 저장 실패' };
  }
  const normalized = code.toLowerCase();
  if (
    existing?.some(
      (row) =>
        String(row.data?.code ?? '')
          .trim()
          .toLowerCase() === normalized,
    )
  )
    return { success: false, message: '이미 등록되었거나 확인 중인 쿠폰' };

  const verified = await verifyCoupon(typeof input.npaCode === 'string' ? input.npaCode : '', code);
  if (verified === false) return { success: false, message: '사용할 수 없는 쿠폰' };

  const result = await db.from('cms_entries').insert({
    kind: 'coupon_report',
    slug: 'report-' + Date.now().toString(36) + '-' + randomBytes(3).toString('hex'),
    title: code,
    published: false,
    position: 0,
    data: { code, expiresAt, verified: verified === true },
  });
  if (result.error) {
    console.error('[couponReport::reportCoupon] ' + result.error.code);
    return { success: false, message: '제보 저장 실패' };
  }
  return { success: true, message: '제보 완료. 운영자 확인 후 표시' };
}
