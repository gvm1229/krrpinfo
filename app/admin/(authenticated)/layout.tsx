import Link from 'next/link';
import { redirect } from 'next/navigation';
import React from 'react';
import { auth, isOwner, signOut } from '@/src/auth';

export const metadata = {
  title: 'Admin',
  robots: { index: false, follow: false },
};

// admin shell — 인증된 owner 전용 sidebar + topbar layout
export default async function AdminAuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // 단일 진입점 auth gate — 하위 페이지는 재검증 불필요
  const session = await auth();
  if (!isOwner(session)) redirect('/admin/login');

  const navItems = [
    { href: '/admin', label: 'Dashboard' },
    { href: '/admin/posts', label: 'Posts' },
    { href: '/admin/seasons', label: 'Seasons' },
    { href: '/admin/config', label: 'Config' },
  ];

  return (
    <div className="flex min-h-svh">
      {/* Sidebar */}
      <aside className="hidden w-56 shrink-0 border-r bg-zinc-50 dark:bg-zinc-950 tablet:flex tablet:flex-col">
        <div className="border-b p-4">
          <Link href="/admin" className="text-base font-semibold">
            krrpinfo Admin
          </Link>
        </div>
        <nav className="flex-1 space-y-1 p-3">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="block rounded-md px-3 py-2 text-sm text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>
      {/* Main */}
      <div className="flex flex-1 flex-col">
        {/* Topbar */}
        <header className="flex items-center justify-between border-b px-6 py-3">
          <span className="text-sm text-zinc-500">{session?.user?.email}</span>
          <form
            action={async () => {
              'use server';
              await signOut({ redirectTo: '/' });
            }}
          >
            <button
              type="submit"
              className="rounded-md border px-3 py-1.5 text-xs font-medium hover:bg-zinc-50 dark:hover:bg-zinc-900"
            >
              Sign Out
            </button>
          </form>
        </header>
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
