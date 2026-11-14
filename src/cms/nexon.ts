import 'server-only';

// Nexon 쿠폰 API 서버 전용 호출
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
    return (await response.json()) as RedeemResponse;
  } catch (error) {
    // console.error('Error fetching coupon:', error);
    throw new Error(`Error fetching coupon: ${error}`);
  }
}
