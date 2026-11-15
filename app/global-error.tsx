'use client';
// 공통 데이터에 의존하지 않는 최종 복구 화면
const GlobalError = ({ reset }: { error: Error & { digest?: string }; reset: () => void }) => (
  <html lang="ko">
    <body>
      <main style={{ maxWidth: 560, margin: '10vh auto', padding: 24, fontFamily: 'sans-serif' }}>
        <h1>화면을 불러오지 못했습니다.</h1>
        <p>잠시 후 다시 시도해 주세요.</p>
        <button
          onClick={reset}
          style={{
            background: '#2563eb',
            color: 'white',
            border: 0,
            borderRadius: 6,
            padding: '12px 20px',
          }}
        >
          다시 시도
        </button>
      </main>
    </body>
  </html>
);
export default GlobalError;
