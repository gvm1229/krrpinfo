import Link from 'next/link';
import { getAllPosts } from '@/app/actions/posts';

export default async function PostRootPage() {
  const paths = await getAllPosts();

  return (
    <main className="container flex h-full flex-col items-center p-8 tablet:py-12">
      <h1 className="text-2xl font-bold">Posts List</h1>
      <div className="mt-8 grid gap-4 tablet:grid-cols-2 desktop:grid-cols-3">
        {paths.map((post) => (
          <div
            key={post.slug}
            className="rounded-md bg-slate-200 p-4 dark:bg-slate-800"
          >
            <p className="text-sm text-primary">{new Date(post.date).toLocaleDateString()}</p>
            <Link
              href={`/posts/${post.slug}`}
              className="text-xl font-semibold"
            >
              <h2 className="mt-4 text-violet-600 hover:underline">{post.title}</h2>
            </Link>
            <p className="mt-4 text-primary">{post.subtitle}</p>
          </div>
        ))}
      </div>
    </main>
  );
}
