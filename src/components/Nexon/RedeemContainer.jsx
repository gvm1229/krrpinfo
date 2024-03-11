'use client';

import { useState } from 'react';
import InputComponent from './InputComponent';
import RedeemButton from './RedeemButton';
import ResponseDisplay from './ResponseDisplay';

const RedeemContainer = () => {
  const [npaCode, setNpaCode] = useState('');
  const [couponCode, setCouponCode] = useState('');
  const [response, setResponse] = useState(null);

  return (
    <div className="flex w-full flex-col gap-y-8">
      <h2 className="text-2xl font-medium">
        <span className="font-bold">국가/지역:</span>
        {' '}
        KR
      </h2>
      <InputComponent
        label="회원번호"
        value={npaCode}
        onChange={setNpaCode}
      />
      <InputComponent
        label="쿠폰 코드"
        value={couponCode}
        onChange={setCouponCode}
      />
      <RedeemButton
        npaCode={npaCode}
        couponCode={couponCode}
        setResponse={setResponse}
      />
      <ResponseDisplay response={response} />
    </div>
  );
};

export default RedeemContainer;

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
