import Link from 'next/link';
import { redirect } from 'next/navigation';
import { LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AdminNavigation } from '@/components/Admin/AdminNavigation';
import { AdminMobileMenu } from '@/components/Admin/AdminMobileMenu';
import { adminEntries } from '@/src/cms/repository';
import { auth, signOut } from '@/src/auth';
import { isOwner } from '@/src/cms/owner';
import '@/src/styles/admin.css';
export const dynamic = 'force-dynamic';
export const metadata = { title: '콘텐츠 관리', robots: { index: false, follow: false } };
// Strapi 구성에 맞춘 단일 운영자 관리 영역
const AdminLayout = async ({ children }: { children: React.ReactNode }) => {
  const session = await auth();
  if (!isOwner(session)) redirect('/admin/login');
  // 확인 대기 개수
  const pending = {
    coupon_report: (await adminEntries('coupon_report')).length,
    cn_update: (await adminEntries('cn_update')).filter((entry) => !entry.published).length,
  };
  return (
    <div className="cms-shell">
      <aside className="cms-sidebar">
        <Link href="/admin" className="flex items-center gap-3 px-5 py-6 font-semibold">
          <span className="grid size-9 place-items-center rounded bg-[var(--cms-primary)] text-white">
            K
          </span>
          콘텐츠 관리
        </Link>
        <AdminNavigation pending={pending} />
      </aside>
      <div className="min-w-0 flex-1">
        <header className="cms-topbar">
          <div className="flex items-center gap-3">
            <AdminMobileMenu pending={pending} />
            <Link href="/" className="text-sm hover:underline">
              사이트 보기
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">{session?.user?.name}</span>
            <form
              action={async () => {
                'use server';
                await signOut({ redirectTo: '/admin/login' });
              }}
            >
              <Button type="submit" className="cms-button cms-secondary">
                <LogOut size={15} />
                로그아웃
              </Button>
            </form>
          </div>
        </header>
        <main className="mx-auto max-w-[1440px] p-5 tablet:p-10">{children}</main>
      </div>
    </div>
  );
};
export default AdminLayout;
