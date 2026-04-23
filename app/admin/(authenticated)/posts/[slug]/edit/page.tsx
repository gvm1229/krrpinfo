import { notFound } from 'next/navigation';
import { getPostByAnySlug } from '@/src/lib/queries';
import { EditPostForm } from '@/components/Admin/EditPostForm';
import { formatDate } from '@/src/util/utils';

export const metadata = {
  title: 'Admin — Edit Post',
  robots: { index: false, follow: false },
};

// 포스트 편집 페이지 — owner 전용 (auth gate: layout.tsx)
export default async function EditPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPostByAnySlug(slug);
  if (!post) notFound();

  return (
    <div className="space-y-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold">Edit: {post.title}</h1>
        <p className="text-sm text-zinc-500">slug: {post.slug}</p>
      </header>
      <EditPostForm
        initial={{
          slug: post.slug,
          title: post.title,
          description: post.description ?? '',
          tags: post.tags.join(', '),
          keywords: (post.keywords ?? []).join(', '),
          thumbnail: post.thumbnail,
          content: post.content,
          pubDate: formatDate(post.pub_date),
        }}
      />
    </div>
  );
}
