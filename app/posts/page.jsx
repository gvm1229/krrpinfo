import { allPosts } from 'contentlayer/generated';
import { compareDesc } from 'date-fns';
import Blog from '@/src/components/Blog/Blog';
import { formatDate } from '@/src/util/utils';

export const metadata = {
  title: 'Posts',
};

export default async function PostRootPage() {
  const posts = allPosts
    .filter((post) => post.published)
    .sort((a, b) => compareDesc(new Date(a.date), new Date(b.date)));

  return (
    <main className="container flex h-full flex-col items-center p-8 tablet:py-12">
      <h1 className="text-2xl font-bold">Posts List</h1>
      <div className="mt-8 grid gap-4 tablet:grid-cols-2 desktop:grid-cols-3">
        {posts.map((post, index) => (
          <Blog
            key={post.title}
            thumbnail={post.thumbnail}
            category="No"
            date={formatDate(post.date)}
            title={post.title}
            toNavigate={post.slug}
            isImagePriority={index < 3}
          />
        ))}
      </div>
    </main>
  );
}
