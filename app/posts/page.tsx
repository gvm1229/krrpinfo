import { Redis } from '@upstash/redis';
import { compareDesc } from 'date-fns';
import Blog from '@/components/Blog/Blog';
import { siteConfig } from '@/config/site';
import type { Post } from 'contentlayer/generated';
import { allPosts } from 'contentlayer/generated';

export const metadata = {
  title: '포스트 목록',
  metadataBase: new URL(`${siteConfig.url}/posts`),
  alternates: {
    canonical: '/',
    languages: {
      'ko-KR': '/ko-KR',
      // 'en-US': '/en-US',
    },
  },
};

export const revalidate = 60;
const redis = Redis.fromEnv();

// Extracted rendering of posts to a reusable function
function renderPosts(posts: Post[], views = {}) {
  return (
    <div className="container relative flex flex-col items-center gap-y-8">
      {posts.length > 0 ? (
        <>
          <h1 className="text-3xl font-bold tablet:text-4xl laptop:text-5xl">
            포스트 목록
          </h1>
          <div className="relative grid size-full grid-cols-1 gap-8 tablet:grid-cols-2 laptop:grid-cols-3">
            {posts.map((post, index) => (
              <Blog
                key={post._id}
                toNavigate={post.slug}
                isImagePriority={index < 6}
                views={views[post.slugAsParams] ?? 1234} // Default views for development or if missing in production
                {...post}
              />
            ))}
          </div>
        </>
      ) : (
        <p className="text-center text-2xl font-bold tablet:text-3xl laptop:text-4xl">
          작성된 포스트가 없습니다.
        </p>
      )}
    </div>
  );
}

export default async function PostRootPage() {
  const posts = allPosts
    .filter((post) => post.published)
    .sort((a, b) => compareDesc(new Date(a.date), new Date(b.date)));

  if (process.env.NODE_ENV === 'development') return renderPosts(posts);

  const views = (
    await redis.mget<number[]>(
      ...allPosts.map((p) => ['pageviews', 'projects', 'posts', p.slugAsParams].join(':')),
    )
  ).reduce(
    (acc, v, i) => {
      acc[allPosts[i].slugAsParams] = v ?? 0;
      return acc;
    },
    {} as Record<string, number>,
  );

  return renderPosts(posts, views);
}
