/* eslint-disable no-use-before-define */

'use server';

// 240301 API POST RESULT (유저 조회)
// API URL: https://mcoupon.nexon.com/kartrush/coupon/api/v1/characters-by-npacode
// HTTP REQUEST: POST

// Payload: {
//   npaCode: "07S0LCI10W02W",
//   coupon: "중요한건잊지않는마음",
//   region: "KR"
// }

// RESPONSE: 200 OK
// Response: {
//   "result": true,
//   "code": 0,
//   "message": "조회 완료",
//   "info": [
//       {
//           "id": "16520000032888233",
//           "name": "Megiii"
//       }
//   ],
//   "gc_count": 0
// }

// 이미 사용한 쿠폰 / 잘못된 쿠폰 정보 입력 시
// {
//   "result":false,
//   "code":95100,
//   "message":"해당 쿠폰 완료 상태",
//   "gc_count":0
// }

interface UserLookUpPayload {
  npaCode: string;
  coupon: string;
  region: string;
}

interface UserLookUpResponse {
  result: boolean;
  code: number;
  message: string;
  info?: {
    id: string;
    name: string;
  }[];
  gc_count: number;
}

async function handleUserLookup(payload: UserLookUpPayload) {
  try {
    const response = await fetch(
      'https://mcoupon.nexon.com/kartrush/coupon/api/v1/characters-by-npacode',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify(payload),
      },
    );
    return (await response.json()) as UserLookUpResponse;
  } catch (error) {
    // console.error('Error fetching user:', error);
    throw new Error(`Error fetching user: ${error}`);
  }
}

// 240301 API POST RESULT (쿠폰 수령)
// API URL: https://mcoupon.nexon.com/kartrush/coupon/api/v1/redeem-coupon-by-npacode
// HTTP REQUEST: POST

// Payload: {
//   coupon: "중요한건잊지않는마음",
//   id: "16520000032888233",
//   name: "Megiii",
//   npaCode: "07S0LCI10W02W",
//   region: "KR",
//   world: ""
// }

// RESPONSE: 200 OK
// Response: {
//   "result":true,
//   "code":0,
//   "message":"Success"
// }

// 이미 사용한 쿠폰 / 잘못된 쿠폰 정보 입력 시
// {
//   "result":false,
//   "code":95100,
//   "message":"해당 쿠폰 완료 상태"
// }

interface RedeemPayload {
  coupon: string;
  id: string;
  name: string;
  npaCode: string;
  region: string;
  world: string;
}

interface RedeemResponse {
  result: boolean;
  code: number;
  message: string;
}

async function handleRedeem(payload: RedeemPayload) {
  try {
    const response = await fetch(
      'https://mcoupon.nexon.com/kartrush/coupon/api/v1/redeem-coupon-by-npacode',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      },
    );
    return (await response.json()) as RedeemResponse;
  } catch (error) {
    // console.error('Error fetching coupon:', error);
    throw new Error(`Error fetching coupon: ${error}`);
  }
}

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
