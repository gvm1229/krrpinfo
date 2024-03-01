'use client';

import { useState } from 'react';

const RedeemButton = () => {
  const [npaCode, setNpaCode] = useState('');
  const [couponCode, setCouponCode] = useState('');
  const [response, setResponse] = useState(null);

  const handleUserLookup = async (payload) => {
    try {
      const response = await fetch('https://mcoupon.nexon.com/kartrush/coupon/api/v1/characters-by-npacode', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify(payload),
      });
      const responseData = await response.json();
      return responseData;
    } catch (error) {
      console.error('Error fetching user:', error);
      setResponse(`Error fetching user: ${error}`);
      return null;
    }
  };

  const handleRedeem = async (payload) => {
    try {
      const response = await fetch('https://mcoupon.nexon.com/kartrush/coupon/api/v1/redeem-coupon-by-npacode', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      const responseData = await response.json();
      return responseData;
    } catch (error) {
      console.error('Error fetching coupon:', error);
      setResponse(`Error fetching coupon: ${error}`);
      return null;
    }
  };

  const handleUnified = async (npaCode, coupon) => {
    // const npaCode = '07S0LCI10W02W'; // 본계
    // const npaCode = '07X0MCW10M027'; // 부계
    // const coupon = '중요한건잊지않는마음';
    const region = 'KR';

    try {
      const payload = { npaCode, coupon, region };
      const responseData = await handleUserLookup(payload);
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
          if (redeemResponseData.result)
            setResponse(`{${responseData.name}} 에게 {${responseData.coupon}} 쿠폰 사용 성공`);
          else
            setResponse('이미 사용된 쿠폰 / 잘못된 입력');
        } catch (error) {
          console.error('[Unified] Error fetching coupon:', error);
        }
      else
        setResponse('이미 사용된 쿠폰 / 잘못된 입력');
    } catch (error) {
      console.error('[Unified] Error fetching user:', error);
    }
  };

  const handleUserLookupProxy = async (payload) => {
    try {
      const response = await fetch('https://proxy.cors.sh/https://mcoupon.nexon.com/kartrush/coupon/api/v1/characters-by-npacode', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-cors-api-key': 'temp_4b3e164d0edac11bccda267eeffae079',
        },
        body: JSON.stringify(payload),
      });
      const responseData = await response.json();
      return responseData;
    } catch (error) {
      console.error('Error fetching user:', error);
      setResponse(`Error fetching user: ${error}`);
      return null;
    }
  };

  const handleRedeemProxy = async (payload) => {
    try {
      const response = await fetch('https://proxy.cors.sh/https://mcoupon.nexon.com/kartrush/coupon/api/v1/redeem-coupon-by-npacode', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-cors-api-key': 'temp_4b3e164d0edac11bccda267eeffae079',
        },
        body: JSON.stringify(payload),
      });
      const responseData = await response.json();
      return responseData;
    } catch (error) {
      console.error('Error fetching coupon:', error);
      setResponse(`Error fetching coupon: ${error}`);
      return null;
    }
  };

  const handleUnifiedProxy = async (npaCode, coupon) => {
    // const npaCode = '07S0LCI10W02W'; // 본계
    // const npaCode = '07X0MCW10M027'; // 부계
    // const coupon = '중요한건잊지않는마음';
    const region = 'KR';

    try {
      const payload = { npaCode, coupon, region };
      const responseData = await handleUserLookupProxy(payload);
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
          const redeemResponseData = await handleRedeemProxy(redeemPayload);
          if (redeemResponseData.result)
            setResponse(`{${responseData.name}} 에게 {${responseData.coupon}} 쿠폰 사용 성공`);
          else
            setResponse('이미 사용된 쿠폰 / 잘못된 입력');
        } catch (error) {
          console.error('[Unified] Error fetching coupon:', error);
        }
      else
        setResponse('이미 사용된 쿠폰 / 잘못된 입력');
    } catch (error) {
      console.error('[Unified] Error fetching user:', error);
    }
  };

  return (
    <div className="flex size-full flex-col gap-y-8">
      <h2 className="text-2xl font-medium">
        <span className="font-bold">국가/지역:</span>
        {' '}
        KR
      </h2>
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
      <button
        type="button"
        className="rounded-lg bg-blue-500 px-3 py-1.5 text-center text-xl font-semibold text-white hover:cursor-pointer hover:bg-blue-400"
        onClick={() => handleUnified(npaCode, couponCode)}
        data-message="unified"
      >
        쿠폰 리딤
      </button>
      <button
        type="button"
        className="rounded-lg bg-pink-500 px-3 py-1.5 text-center text-xl font-semibold text-white hover:cursor-pointer hover:bg-pink-400"
        onClick={() => handleUnifiedProxy(npaCode, couponCode)}
        data-message="unified"
      >
        쿠폰 리딤 (Proxy)
      </button>
      {response && (
        <div>
          <h2 className="text-2xl font-bold">Response:</h2>
          <p className="mt-2 text-lg font-medium">{JSON.stringify(response, null, 2)}</p>
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
