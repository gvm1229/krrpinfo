'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
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
} from 'lucide-react';
import { kindLabels, type Kind } from '@/src/cms/schema';
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

// 현재 화면을 표시하는 관리자 메뉴
export const AdminNavigation = () => {
  const pathname = usePathname();
  // 하위 편집 주소를 포함한 메뉴 상태
  const current = (href: string) =>
    pathname === href || (href !== '/admin' && pathname.startsWith(href + '/'));
  return (
    <nav className="space-y-1 px-3 pb-6" aria-label="관리 메뉴">
      <Link
        className="cms-nav-link"
        href="/admin"
        aria-current={current('/admin') ? 'page' : undefined}
      >
        <LayoutDashboard size={18} />
        대시보드
      </Link>
      <p className="px-3 pb-2 pt-6 text-sm text-muted-foreground">콘텐츠</p>
      {(Object.keys(kindLabels) as Kind[]).map((kind) => {
        const Icon = icons[kind];
        const href = '/admin/content/' + kind;
        return (
          <Link
            key={kind}
            className="cms-nav-link"
            href={href}
            aria-current={current(href) ? 'page' : undefined}
          >
            <Icon size={18} />
            {kindLabels[kind]}
          </Link>
        );
      })}
      <p className="px-3 pb-2 pt-6 text-sm text-muted-foreground">라이브러리와 설정</p>
      <Link
        href="/admin/media"
        className="cms-nav-link"
        aria-current={current('/admin/media') ? 'page' : undefined}
      >
        <Images size={18} />
        미디어
      </Link>
      <Link
        href="/admin/config"
        className="cms-nav-link"
        aria-current={current('/admin/config') ? 'page' : undefined}
      >
        <Settings size={18} />
        사이트 설정
      </Link>
    </nav>
  );
};
