// NextAuth signIn 콜백 거부 시 리디렉션되는 에러 페이지.
// owner 가 아닌 계정으로 로그인 시도하면 이 페이지로 이동.
export const metadata = {
  title: 'Admin',
  robots: { index: false, follow: false },
};

export default function AdminAuthErrorPage() {
  return (
    <main className="mx-auto flex min-h-[60vh] max-w-sm flex-col items-center justify-center gap-4 p-8 text-center">
      <h1 className="text-xl font-semibold">Access Denied</h1>
      <p className="text-sm text-neutral-600 dark:text-neutral-400">
        이 사이트는 비공개입니다. 허가된 계정만 로그인 가능합니다.
      </p>
    </main>
  );
}
