'use client';
import { useEffect } from 'react';
// 데이터 연결 실패 시 독립적으로 표시하는 복구 화면
const ErrorPage = ({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) => {
  useEffect(() => {
    console.error('[error::ErrorPage] ' + (error.digest ?? 'request failed'));
  }, [error]);
  return (
    <main className="mx-auto max-w-lg space-y-5 p-8">
      <h1 className="text-2xl font-bold">화면을 불러오지 못했습니다.</h1>
      <p>잠시 후 다시 시도해 주세요.</p>
      <button className="rounded-md bg-blue-600 px-4 py-2 text-white" onClick={reset}>
        다시 시도
      </button>
    </main>
  );
};
export default ErrorPage;
