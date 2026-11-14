'use client';
import { Check } from 'lucide-react';
import React from 'react';
import { handleUnified } from '@/app/actions/couponRedeem';
import { Button } from '@/components/ui/button';
import { useCopy } from '@/components/Text/PublicSite';
import { cn } from '@/src/util/utils';
import {
  NPA_CHANGE_EVENT,
  addUsedCoupon,
  readNpaCode,
  readUsedCoupons,
} from '@/components/Redeem/redeemStorage';

// 저장된 회원번호로 쿠폰 한 번에 사용
const RedeemCouponButton = ({ coupon }: { coupon: string }) => {
  const t = useCopy();
  const [used, setUsed] = React.useState(false);
  const [pending, setPending] = React.useState(false);
  const [result, setResult] = React.useState<{ success: boolean; message: string } | null>(null);
  // 회원번호 변경 시 사용 완료 상태 갱신
  React.useEffect(() => {
    const sync = () => {
      setUsed(readUsedCoupons(readNpaCode()).includes(coupon));
      setResult(null);
    };
    sync();
    window.addEventListener(NPA_CHANGE_EVENT, sync);
    window.addEventListener('storage', sync);
    return () => {
      window.removeEventListener(NPA_CHANGE_EVENT, sync);
      window.removeEventListener('storage', sync);
    };
  }, [coupon]);
  // 쿠폰 사용 요청
  const redeem = async () => {
    const npaCode = readNpaCode();
    if (!npaCode) {
      setResult({ success: false, message: t('redeem.required') });
      return;
    }
    setPending(true);
    try {
      const response = await handleUnified(npaCode, coupon);
      setResult(response);
      if (!response.used) return;
      addUsedCoupon(npaCode, coupon);
      setUsed(true);
    } catch {
      setResult({ success: false, message: '쿠폰 서버 연결 실패' });
    } finally {
      setPending(false);
    }
  };
  return (
    <div className="space-y-2">
      <Button
        type="button"
        onClick={redeem}
        disabled={used || pending}
        className={cn(
          'shrink-0 whitespace-nowrap rounded-md px-4 font-semibold text-white',
          used ? 'bg-gray-500' : 'bg-brand-blue hover:bg-brand-blue-hover',
        )}
      >
        {used && <Check size={16} />}
        {used ? t('redeem.done') : t('redeem.use')}
      </Button>
      {result && (
        <p
          role="status"
          className={cn('text-sm', result.success ? 'text-success-text' : 'text-error-text')}
        >
          {result.message}
        </p>
      )}
    </div>
  );
};
export default RedeemCouponButton;
