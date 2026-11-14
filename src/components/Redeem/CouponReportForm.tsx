'use client';
import React from 'react';
import { reportCoupon } from '@/app/actions/couponReport';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Copy, useCopy } from '@/components/Text/PublicSite';
import { readNpaCode } from '@/components/Redeem/redeemStorage';
import { cn } from '@/src/util/utils';

// 게임 공지 쿠폰 익명 제보, 저장된 회원번호로 사전 확인
const CouponReportForm = () => {
  const t = useCopy();
  const [code, setCode] = React.useState('');
  const [expiresAt, setExpiresAt] = React.useState('');
  const [pending, setPending] = React.useState(false);
  const [result, setResult] = React.useState<{ success: boolean; message: string } | null>(null);
  // 제보 전송
  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!code.trim()) return;
    setPending(true);
    const response = await reportCoupon({ code, expiresAt, npaCode: readNpaCode() });
    setPending(false);
    setResult(response);
    if (!response.success) return;
    setCode('');
    setExpiresAt('');
  };
  return (
    <section className="min-w-0 space-y-4 rounded-lg border p-5">
      <div className="space-y-1">
        <h2 className="text-xl font-bold">
          <Copy id="redeem.report.title" />
        </h2>
        <p className="text-sm text-muted-foreground">
          <Copy id="redeem.report.help" />
        </p>
      </div>
      <form onSubmit={submit} className="space-y-3">
        <div className="grid grid-cols-1 gap-3 tablet:grid-cols-[1fr_auto]">
          <div className="min-w-0 space-y-1.5">
            <Label htmlFor="coupon-report-code">{t('redeem.report.code')}</Label>
            <Input
              id="coupon-report-code"
              value={code}
              maxLength={60}
              required
              autoComplete="off"
              onChange={(event) => setCode(event.target.value)}
              className="h-11 text-base"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="coupon-report-expires">{t('redeem.report.expires')}</Label>
            <Input
              id="coupon-report-expires"
              type="date"
              value={expiresAt}
              onChange={(event) => setExpiresAt(event.target.value)}
              className="h-11 text-base"
            />
          </div>
        </div>
        <Button
          type="submit"
          disabled={pending || !code.trim()}
          className="whitespace-nowrap rounded-md bg-brand-blue font-semibold text-white hover:bg-brand-blue-hover"
        >
          {t('redeem.report.submit')}
        </Button>
        {result && (
          <p
            role="status"
            className={cn('text-sm', result.success ? 'text-success-text' : 'text-error-text')}
          >
            {result.message}
          </p>
        )}
      </form>
    </section>
  );
};
export default CouponReportForm;
