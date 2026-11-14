'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Globe,
  Inbox,
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
import { Badge } from '@/components/ui/badge';
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
  coupon_report: Inbox,
  cn_update: Globe,
};

// 사용 빈도와 작업 성격별 메뉴 묶음
const groups: { title: string; kinds: Kind[] }[] = [
  { title: '자주 쓰는 콘텐츠', kinds: ['post', 'coupon', 'video', 'timeline'] },
  { title: '확인 대기', kinds: ['coupon_report', 'cn_update'] },
  { title: '홈 구성', kinds: ['section', 'countdown', 'link', 'navigation'] },
  { title: '기준 정보', kinds: ['season', 'category', 'copy'] },
];

// 현재 화면을 표시하는 관리자 메뉴, pending은 확인 대기 개수
export const AdminNavigation = ({
  pending = {},
  onNavigate,
}: {
  pending?: Partial<Record<Kind, number>>;
  onNavigate?: () => void;
}) => {
  const pathname = usePathname();
  // 하위 편집 주소를 포함한 메뉴 상태
  const current = (href: string) =>
    pathname === href || (href !== '/admin' && pathname.startsWith(href + '/'));
  const item = (href: string, label: string, Icon: typeof Inbox, count = 0) => (
    <Link
      key={href}
      className="cms-nav-link"
      href={href}
      aria-current={current(href) ? 'page' : undefined}
      onClick={onNavigate}
    >
      <Icon size={18} />
      <span className="min-w-0 flex-1">{label}</span>
      {count > 0 && (
        <Badge className="bg-[var(--cms-primary)] text-white tabular-nums">{count}</Badge>
      )}
    </Link>
  );
  return (
    <nav className="space-y-1 px-3 pb-6" aria-label="관리 메뉴">
      {item('/admin', '대시보드', LayoutDashboard)}
      {groups.map((group) => (
        <div key={group.title} className="space-y-1">
          <p className="px-3 pb-2 pt-6 text-sm text-muted-foreground">{group.title}</p>
          {group.kinds.map((kind) =>
            item('/admin/content/' + kind, kindLabels[kind], icons[kind], pending[kind]),
          )}
        </div>
      ))}
      <p className="px-3 pb-2 pt-6 text-sm text-muted-foreground">라이브러리와 설정</p>
      {item('/admin/media', '미디어', Images)}
      {item('/admin/config', '사이트 설정', Settings)}
    </nav>
  );
};
