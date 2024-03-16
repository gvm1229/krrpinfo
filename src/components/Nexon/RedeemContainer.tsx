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
