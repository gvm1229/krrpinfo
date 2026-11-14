/* eslint-disable no-use-before-define */

'use server';

import { allowRequest } from '@/src/cms/rate-limit';
import { handleRedeem, handleUserLookup } from '@/src/cms/nexon';

type UnifiedResponse = {
  success: boolean;
  message: string;
  // 해당 회원번호에서 다시 사용할 필요 없는 쿠폰 여부
  used: boolean;
};

// Nexon 이미 사용 응답 문구
const ALREADY_USED = '해당 쿠폰 완료 상태';

// 회원번호 조회 후 첫 캐릭터에 쿠폰 사용
export async function handleUnified(npaCode: string, coupon: string): Promise<UnifiedResponse> {
  const region = 'KR';
  const code = coupon.trim();
  if (!/^[a-zA-Z0-9]{13}$/.test(npaCode))
    return { success: false, message: '잘못된 회원번호', used: false };
  if (!code || code.length > 100) return { success: false, message: '쿠폰 미입력', used: false };
  if (!(await allowRequest('redeem', 30, 600)))
    return { success: false, message: '요청이 많아 잠시 후 다시 시도', used: false };

  try {
    const lookup = await handleUserLookup({ npaCode, coupon: code, region });
    const character = lookup.info?.[0];
    if (!lookup.result || !character)
      return {
        success: false,
        message: reformatMessage(lookup.message),
        used: lookup.message === ALREADY_USED,
      };
    const redeemed = await handleRedeem({
      coupon: code,
      id: character.id,
      name: character.name,
      npaCode,
      region,
      world: '',
    });
    if (redeemed.result)
      return {
        success: true,
        message: `[${character.name}] 에게 [${code}] 쿠폰 사용 성공`,
        used: true,
      };
    return {
      success: false,
      message: reformatMessage(redeemed.message),
      used: redeemed.message === ALREADY_USED,
    };
  } catch (error) {
    console.error(`[couponRedeem::handleUnified] ${error}`);
    return { success: false, message: '쿠폰 서버 연결 실패', used: false };
  }
}

function reformatMessage(messageInput: string) {
  if (messageInput === 'Incorrect npaCode.') return '잘못된 회원번호';
  if (messageInput === 'NpaCode is required.') return '회원번호 미입력';
  if (messageInput === 'NpaCode is invalid length.') return '잘못된 회원번호';
  if (messageInput === 'Coupon is required.') return '쿠폰 미입력';
  if (messageInput === '해당 게임에서 사용할 수 없는 쿠폰') return '존재하지 않는 쿠폰';
  if (messageInput === '쿠폰사용기간이 아님') return '사용 기간이 지난 쿠폰';
  if (messageInput === '해당 쿠폰 완료 상태') return '이미 사용한 쿠폰';
  return messageInput || '쿠폰 사용 실패';
}
