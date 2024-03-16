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

export async function handleUserLookup(payload: UserLookUpPayload) {
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
    return await response.json() as UserLookUpResponse;
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

export async function handleRedeem(payload: RedeemPayload) {
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
    return await response.json() as RedeemResponse;
  } catch (error) {
    // console.error('Error fetching coupon:', error);
    throw new Error(`Error fetching coupon: ${error}`);
  }
}

interface UnifiedResponse {
  success: boolean
  message: string
}

export async function handleUnified(npaCode: string, coupon: string): Promise<UnifiedResponse> {
  // const npaCode = '07S0LCI10W02W'; // 본계
  // const npaCode = '07X0MCW10M027'; // 부계
  // const coupon = '중요한건잊지않는마음';
  const region = 'KR';

  try {
    const payload = { npaCode, coupon, region };
    const responseData = await handleUserLookup(payload);
    // console.log('Unified responseData', responseData);
    if (responseData.result)
      try {
        const redeemPayload = {
          coupon,
          id: responseData.info[0].id,
          name: responseData.info[0].name,
          npaCode,
          region,
          world: '',
        };
        const redeemResponseData = await handleRedeem(redeemPayload);
        // console.log('Unified redeemResponseData', redeemResponseData);
        if (redeemResponseData.result && responseData.info) // 안전을 위해 둘 다
          return {
            success: true,
            message: `{${responseData.info[0].name}} 에게 {${coupon}} 쿠폰 사용 성공`,
          };
        return {
          success: false,
          message:
            reformatMessage(redeemResponseData.message)
            ?? '이미 사용된 쿠폰 / 잘못된 입력',
        };
      } catch (error) {
        // console.error('[Unified] Error fetching coupon:', error);
        return {
          success: false,
          message: `Error: ${error}`,
        };
      }
    else
      return {
        success: false,
        message:
          reformatMessage(responseData.message)
          ?? '이미 사용된 쿠폰 / 잘못된 입력',
      };
  } catch (error) {
    // console.error('[Unified] Error fetching user:', error);
    return {
      success: false,
      message: `Error: fetch failed: ${error}`,
    };
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
  return messageInput;
}
