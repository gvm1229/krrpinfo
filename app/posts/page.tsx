import { Redis } from '@upstash/redis';
import { compareDesc } from 'date-fns';
import Blog from '@/components/Blog/Blog';
import { allPosts } from 'contentlayer/generated';

export const metadata = {
  title: '포스트 목록',
};

export const revalidate = 60;
const redis = Redis.fromEnv();

export default async function PostRootPage() {
  const posts = allPosts
    .filter((post) => post.published)
    .sort((a, b) => compareDesc(new Date(a.date), new Date(b.date)));

  const views = (
    await redis.mget<number[]>(
      ...allPosts.map((p) => [
        'pageviews', 'projects', 'posts', p.slugAsParams,
      ].join(':')),
    )
  ).reduce((acc, v, i) => {
    acc[allPosts[i].slugAsParams] = v ?? 0;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="container relative flex flex-col items-center gap-y-8">
      {posts ? (
        <>
          <h1 className="text-3xl font-bold tablet:text-4xl desktop:text-5xl">포스트 목록</h1>
          <div className="relative grid size-full grid-cols-1 gap-8 tablet:grid-cols-2 desktop:grid-cols-3">
            {posts.map((post, index) => (
              <Blog
                key={post._id}
                toNavigate={post.slug}
                isImagePriority={index < 3}
                views={views[post.slugAsParams]}
                {...post}
              />
            ))}
          </div>
        </>
      ) : (
        <p className="text-center text-2xl font-bold tablet:text-3xl desktop:text-4xl">
          작성된 포스트가 없습니다.
        </p>
      )}
    </div>
  );
}
