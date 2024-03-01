'use client';

import { useState } from 'react';

const RedeemButton = () => {
  const [response, setResponse] = useState(null);

  const handleUserLookup = async () => {
    try {
      const payload = { npaCode: '07S0LCI10W02W', coupon: '중요한건잊지않는마음', region: 'KR' };
      const response = await fetch('https://mcoupon.nexon.com/kartrush/coupon/api/v1/characters-by-npacode', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      const responseData = await response.json();
      setResponse(responseData);
    } catch (error) {
      console.error('Error fetching user:', error);
    }
  };

  const handleRedeem = async () => {
    try {
      const payload = {
        coupon: '중요한건잊지않는마음',
        id: '16520000032888233',
        name: 'Megiii',
        npaCode: '07S0LCI10W02W',
        region: 'KR',
        world: '',
      };
      const response = await fetch('https://mcoupon.nexon.com/kartrush/coupon/api/v1/redeem-coupon-by-npacode', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      const responseData = await response.json();
      setResponse(responseData);
    } catch (error) {
      console.error('Error fetching coupon:', error);
    }
  };

  return (
    <div className="flex flex-col gap-y-8">
      {/* <button
        type="button"
        className="rounded-lg bg-pink-500 px-3 py-1.5 text-center text-xl font-semibold text-white hover:cursor-pointer hover:bg-pink-400"
        onClick={handleButtonClick}
        data-message="user-lookup"
      >
        Proxy Test
      </button> */}
      <button
        type="button"
        className="rounded-lg bg-purple-500 px-3 py-1.5 text-center text-xl font-semibold text-white hover:cursor-pointer hover:bg-purple-400"
        onClick={handleUserLookup}
        data-message="user-lookup"
      >
        User Lookup
      </button>
      <button
        type="button"
        className="rounded-lg bg-blue-500 px-3 py-1.5 text-center text-xl font-semibold text-white hover:cursor-pointer hover:bg-blue-400"
        onClick={handleRedeem}
        data-message="redeem"
      >
        Redeem
      </button>
      {response && (
        <div>
          <p>Response:</p>
          <pre>{JSON.stringify(response, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default RedeemButton;

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
