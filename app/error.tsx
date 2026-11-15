'use client';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
// 데이터 연결 실패 시 독립적으로 표시하는 복구 화면
const ErrorPage = ({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) => {
  useEffect(() => {
    console.error('[error::ErrorPage] ' + (error.digest ?? 'request failed'));
  }, [error]);
  return (
    <main className="mx-auto max-w-lg space-y-5 p-8">
      <h1 className="text-2xl font-bold">화면을 불러오지 못했습니다.</h1>
      <p>잠시 후 다시 시도해 주세요.</p>
      <Button
        type="button"
        className="whitespace-nowrap rounded-md bg-brand-blue text-white hover:bg-brand-blue-hover"
        onClick={reset}
      >
        다시 시도
      </Button>
    </main>
  );
};
export default ErrorPage;
