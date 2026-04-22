// owner 전용 sign-in 페이지. 외부 링크/sitemap/robots 어디에도 노출되지 않음.
import { auth, signIn } from '@/src/auth';
import { redirect } from 'next/navigation';

export const metadata = {
  title: 'Admin',
  robots: { index: false, follow: false },
};

export default async function AdminLoginPage() {
  // 이미 로그인된 owner 는 dashboard 로
  const session = await auth();
  if (session?.user) redirect('/admin');

  return (
    <main className="mx-auto flex min-h-[60vh] max-w-sm flex-col items-center justify-center gap-6 p-8">
      <h1 className="text-xl font-semibold">Admin Sign In</h1>
      <form
        action={async () => {
          'use server';
          await signIn('google', { redirectTo: '/admin' });
        }}
      >
        <button
          type="submit"
          className="rounded-md border border-neutral-300 bg-white px-4 py-2 text-sm font-medium text-neutral-900 shadow-sm hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100 dark:hover:bg-neutral-800"
        >
          Google 로 로그인
        </button>
      </form>
    </main>
  );
}
