'use client';

import { useState } from 'react';
import { handleUnified } from '@/app/actions/couponRedeem';

const RedeemButton = () => {
  const [npaCode, setNpaCode] = useState('');
  const [couponCode, setCouponCode] = useState('');
  const [response, setResponse] = useState(null);

  return (
    <div className="flex size-full flex-col gap-y-8">
      <h2 className="text-2xl font-medium">
        <span className="font-bold">국가/지역:</span>
        {' '}
        KR
      </h2>
      {/* npa code input */}
      <label
        htmlFor="npa-code"
        className="text-2xl font-bold"
      >
        회원번호:
      </label>
      <input
        type="text"
        onChange={(e) => setNpaCode(e.target.value)}
        value={npaCode}
        className="-mt-6 border-1 border-slate-500"
      />
      {/* coupon code input */}
      <label
        htmlFor="coupon-code"
        className="text-2xl font-bold"
      >
        쿠폰 코드:
      </label>
      <input
        type="text"
        onChange={(e) => setCouponCode(e.target.value)}
        value={couponCode}
        className="-mt-6 border-1 border-slate-500"
      />
      <button
        type="button"
        className="rounded-lg bg-blue-500 px-3 py-1.5 text-center text-xl font-semibold text-white hover:cursor-pointer hover:bg-blue-400"
        onClick={() => handleUnified(npaCode, couponCode).then((data) => setResponse(data))}
        data-message="unified"
      >
        쿠폰 리딤
      </button>
      {response && (
        <div>
          <h2 className="text-2xl font-bold">Response:</h2>
          {response.success ? (
            <p className="mt-2 text-3xl font-bold text-green-500">
              {response.message}
            </p>
          ) : (
            <p className="mt-2 text-3xl font-bold text-red-500">
              {response.message}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default RedeemButton;

// 부계 npaCode: "07X0MCW10M027"

// 240301 API POST RESULT (유저 조회)
// API URL: https://mcoupon.nexon.com/kartrush/coupon/api/v1/characters-by-npacode
// HTTP REQUEST: POST

// Payload: {npaCode: "07S0LCI10W02W", coupon: "중요한건잊지않는마음", region: "KR"}

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
// {"result":false,"code":95100,"message":"해당 쿠폰 완료 상태","gc_count":0}

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
// Response: {"result":true,"code":0,"message":"Success"}

// 이미 사용한 쿠폰 / 잘못된 쿠폰 정보 입력 시
// {"result":false,"code":95100,"message":"해당 쿠폰 완료 상태"}
