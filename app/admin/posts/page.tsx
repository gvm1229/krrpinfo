import Link from 'next/link';
import { redirect } from 'next/navigation';
import { auth, isOwner } from '@/src/auth';
import { getAllPostsForAdmin } from '@/src/lib/queries';
import { PublishedToggle } from '@/components/Admin/PublishedToggle';
import { formatDate } from '@/src/util/utils';

export const metadata = {
  title: 'Admin — Posts',
  robots: { index: false, follow: false },
};

// 포스트 관리 목록 페이지 (owner 전용)
export default async function AdminPostsPage() {
  // 방어적 재검증 — proxy 통과해도 owner email 명시 확인
  const session = await auth();
  if (!isOwner(session)) redirect('/admin/login');

  const posts = await getAllPostsForAdmin();

  return (
    <main className="mx-auto max-w-5xl py-8">
      <h1 className="mb-6 text-xl font-semibold">Posts</h1>
      <div className="overflow-x-auto rounded-lg border">
        <table className="w-full text-sm">
          <thead className="border-b bg-zinc-50 dark:bg-zinc-900">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500">
                Title
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500">
                Slug
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500">
                Date
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500">
                Status
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500">
                Edit
              </th>
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
    </main>
  );
}
