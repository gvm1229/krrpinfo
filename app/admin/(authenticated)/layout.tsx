import Link from 'next/link';
import { redirect } from 'next/navigation';
import {
  LayoutDashboard,
  FileText,
  Film,
  CalendarDays,
  Clock,
  Gift,
  Menu,
  Link2,
  Tags,
  Layers,
  Type,
  Settings,
  Images,
  LogOut,
} from 'lucide-react';
import { auth, signOut } from '@/src/auth';
import { isOwner } from '@/src/cms/owner';
import { kindLabels, type Kind } from '@/src/cms/schema';
import '@/src/styles/admin.css';
export const dynamic = 'force-dynamic';
export const metadata = { title: '콘텐츠 관리', robots: { index: false, follow: false } };
const icons = {
  post: FileText,
  video: Film,
  season: CalendarDays,
  timeline: CalendarDays,
  countdown: Clock,
  coupon: Gift,
  navigation: Menu,
  link: Link2,
  category: Tags,
  section: Layers,
  copy: Type,
};
// Strapi 구성에 맞춘 단일 운영자 관리 영역
const AdminLayout = async ({ children }: { children: React.ReactNode }) => {
  const session = await auth();
  if (!isOwner(session)) redirect('/admin/login');
  return (
    <div className="cms-shell">
      <aside className="cms-sidebar">
        <Link href="/admin" className="flex items-center gap-3 px-5 py-6 font-semibold">
          <span className="grid size-9 place-items-center rounded bg-[#4945ff] text-white">K</span>
          콘텐츠 관리
        </Link>
        <nav className="space-y-1 px-3 pb-6" aria-label="관리 메뉴">
          <Link className="cms-nav-link" href="/admin">
            <LayoutDashboard size={18} />
            대시보드
          </Link>
          <p className="px-3 pb-2 pt-6 text-sm text-muted-foreground">콘텐츠</p>
          {(Object.keys(kindLabels) as Kind[]).map((kind) => {
            const Icon = icons[kind];
            return (
              <Link key={kind} className="cms-nav-link" href={'/admin/content/' + kind}>
                <Icon size={18} />
                {kindLabels[kind]}
              </Link>
            );
          })}
          <p className="px-3 pb-2 pt-6 text-sm text-muted-foreground">라이브러리와 설정</p>
          <Link href="/admin/media" className="cms-nav-link">
            <Images size={18} />
            미디어
          </Link>
          <Link href="/admin/config" className="cms-nav-link">
            <Settings size={18} />
            사이트 설정
          </Link>
        </nav>
      </aside>
      <div className="min-w-0 flex-1">
        <header className="cms-topbar">
          <Link href="/" className="text-sm hover:underline">
            사이트 보기
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">{session?.user?.name}</span>
            <form
              action={async () => {
                'use server';
                await signOut({ redirectTo: '/admin/login' });
              }}
            >
              <button className="cms-button cms-secondary">
                <LogOut size={15} />
                로그아웃
              </button>
            </form>
          </div>
        </header>
        <main className="mx-auto max-w-[1440px] p-5 tablet:p-10">{children}</main>
      </div>
    </div>
  );
};
export default AdminLayout;
