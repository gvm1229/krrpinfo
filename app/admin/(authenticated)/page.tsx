// owner 전용 admin 대시보드. layout.tsx 의 admin shell 안에서 렌더
import { auth } from '@/src/auth';
import { getAllPostsForAdmin } from '@/src/lib/queries';
import { formatDate } from '@/src/util/utils';

export const metadata = {
  title: 'Admin',
  robots: { index: false, follow: false },
};

export default async function AdminDashboardPage() {
  const session = await auth();
  const posts = await getAllPostsForAdmin();

  const total = posts.length;
  const published = posts.filter((p) => p.published).length;
  const drafts = total - published;
  const latest = posts[0]?.updated_at ? formatDate(posts[0].updated_at) : '—';

  const tiles = [
    { label: '전체 포스트', value: total },
    { label: '게시됨', value: published },
    { label: '드래프트', value: drafts },
    { label: '최근 업데이트', value: latest },
  ];

  return (
    <div className="space-y-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <p className="text-sm text-zinc-500">로그인된 계정: {session?.user?.email}</p>
      </header>
      <div className="grid grid-cols-2 gap-4 tablet:grid-cols-4">
        {tiles.map((tile) => (
          <div key={tile.label} className="rounded-lg border bg-white p-4 dark:bg-zinc-950">
            <p className="text-xs uppercase tracking-wider text-zinc-500">{tile.label}</p>
            <p className="mt-2 text-2xl font-semibold">{tile.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
