'use client';

import { handleUnified } from '@/app/actions/couponRedeem';

const RedeemButton = ({ npaCode, couponCode, setResponse }) => {
  const handleRedeem = () => {
    handleUnified(npaCode, couponCode)
      .then((data) => setResponse(data));
  };

  return (
    <button
      type="button"
      className="rounded-lg bg-blue-500 px-3 py-1.5 text-center text-xl font-semibold text-white hover:cursor-pointer hover:bg-blue-400"
      onClick={handleRedeem}
      data-message="unified"
    >
      쿠폰 리딤
    </button>
  );
};

export default RedeemButton;
