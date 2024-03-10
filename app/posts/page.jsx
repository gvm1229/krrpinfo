import { allPosts } from 'contentlayer/generated';
import { compareDesc } from 'date-fns';
import Blog from '@/src/components/Blog/Blog';

export const metadata = {
  title: '포스트 목록',
};

export default async function PostRootPage() {
  const posts = allPosts
    .filter((post) => post.published)
    .sort((a, b) => compareDesc(new Date(a.date), new Date(b.date)));

  return (
    <main className="container flex h-full flex-col items-center py-8 tablet:py-12">
      {posts?.length ? (
        <>
          <h1 className="text-3xl font-bold tablet:text-4xl desktop:text-5xl">포스트 목록</h1>
          <div className="mt-8 grid gap-4 tablet:grid-cols-2 desktop:grid-cols-3">
            {posts.map((post, index) => (
              <Blog
                key={post._id}
                thumbnail={post.thumbnail}
                date={post.date}
                title={post.title}
                description={post.description}
                tags={post.tags}
                toNavigate={post.slug}
                isImagePriority={index < 3}
              />
            ))}
          </div>
        </>
      ) : (
        <p className="text-center text-2xl font-bold tablet:text-3xl desktop:text-4xl">
          작성된 포스트가 없습니다.
        </p>
      )}
    </main>
  );
}
