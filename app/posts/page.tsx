import Blog from '@/components/Blog/Blog';
import { siteConfig } from '@/config/site';
import { getAllPosts } from '@/src/lib/queries';

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

export default async function PostRootPage() {
  const posts = await getAllPosts();

  return (
    <div className="container relative flex flex-col items-center gap-y-12 laptop:gap-y-16">
      {posts.length > 0 ? (
        <>
          <h1 className="text-4xl font-bold laptop:text-5xl">포스트 목록</h1>
          <div className="relative grid w-full grid-cols-1 gap-8 tablet:grid-cols-2 laptop:grid-cols-3">
            {posts.map((post, index) => (
              <Blog
                key={post.id}
                toNavigate={`/posts/${post.slug}`}
                isImagePriority={index < 6}
                title={post.title}
                description={post.description ?? undefined}
                date={post.pub_date}
                thumbnail={post.thumbnail}
                tags={post.tags ?? []}
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
