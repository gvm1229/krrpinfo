// owner 전용 admin 대시보드 placeholder. proxy.ts 에서 세션 검증.
import { auth, signOut } from '@/src/auth';
import { redirect } from 'next/navigation';

export const metadata = {
  title: 'Admin',
  robots: { index: false, follow: false },
};

export default async function AdminDashboardPage() {
  // 방어적 재검증 — proxy 가 통과시켰더라도 server component 에서 한 번 더 확인
  const session = await auth();
  if (!session?.user) redirect('/admin/login');

  return (
    <main className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center gap-6 p-8">
      <h1 className="text-xl font-semibold">Admin Dashboard</h1>
      <p className="text-sm text-neutral-600 dark:text-neutral-400">
        로그인된 계정: {session.user.email}
      </p>
      <form
        action={async () => {
          'use server';
          await signOut({ redirectTo: '/' });
        }}
      >
        <button
          type="submit"
          className="rounded-md border border-neutral-300 bg-white px-4 py-2 text-sm font-medium text-neutral-900 shadow-sm hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100 dark:hover:bg-neutral-800"
        >
          Sign Out
        </button>
      </form>
    </main>
  );
}
