import Link from 'next/link';
import { getAllPostsForAdmin } from '@/src/lib/queries';
import { PublishedToggle } from '@/components/Admin/PublishedToggle';
import { formatDate } from '@/src/util/utils';

export const metadata = {
  title: 'Admin — Posts',
  robots: { index: false, follow: false },
};

const TH = 'px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500';
const COLS = ['Title', 'Slug', 'Date', 'Status', 'Edit'] as const;

// 포스트 관리 목록 (owner 전용 — auth gate 는 (authenticated)/layout.tsx 에 위임)
export default async function AdminPostsPage() {
  const posts = await getAllPostsForAdmin();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Posts</h1>
      <div className="overflow-x-auto rounded-lg border">
        <table className="w-full text-sm">
          <thead className="border-b bg-zinc-50 dark:bg-zinc-900">
            <tr>
              {COLS.map((col) => (
                <th key={col} className={TH}>
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y">
            {posts.map((post) => (
              <tr key={post.slug} className="hover:bg-zinc-50 dark:hover:bg-zinc-900">
                <td className="px-4 py-3 font-medium">{post.title}</td>
                <td className="px-4 py-3 text-zinc-500">{post.slug}</td>
                <td className="px-4 py-3 text-zinc-500">{formatDate(post.pub_date)}</td>
                <td className="px-4 py-3">
                  <PublishedToggle slug={post.slug} initial={post.published} />
                </td>
                <td className="px-4 py-3">
                  <Link
                    href={`/admin/posts?edit=${post.slug}`}
                    className="text-xs text-blue-600 hover:underline dark:text-blue-400"
                  >
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
