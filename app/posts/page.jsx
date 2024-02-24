import { getAllPosts } from '@/app/actions/posts';
import Blog from '@/src/components/Blog/Blog';

export default async function PostRootPage() {
  const paths = await getAllPosts();

  return (
    <main className="container flex h-full flex-col items-center p-8 tablet:py-12">
      <h1 className="text-2xl font-bold">Posts List</h1>
      <div className="mt-8 grid gap-4 tablet:grid-cols-2 desktop:grid-cols-3">
        {paths.map((post) => (
          <Blog
            key={post.title}
            thumbnail={post.thumbnail}
            category="No"
            date={post.date}
            title={post.title}
            toNavigate={`posts/${post.slug}`}
          />
        ))}
      </div>
    </main>
  );
}
