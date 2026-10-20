import { notFound as disabledPage } from 'next/navigation';
import { siteSettings as pageSettings } from '@/src/cms/repository';
import Blog from '@/components/Blog/Blog';
import { getAllPosts } from '@/src/lib/queries';
import { publicCopy } from '@/src/cms/repository';
import { Copy } from '@/components/Text/PublicSite';
// 관리자 문구로 목록 메타데이터 표시
export const generateMetadata = async () => {
  if ((await pageSettings()).postsEnabled !== 'true') return {};
  return { title: (await publicCopy())['posts.title'], alternates: { canonical: '/posts' } };
};
// 공개 글 목록
const PostsPage = async () => {
  if ((await pageSettings()).postsEnabled !== 'true') disabledPage();
  const posts = await getAllPosts();
  return (
    <main className="container space-y-10">
      <h1 className="text-center text-4xl font-bold">
        <Copy id="posts.title" />
      </h1>
      {posts.length ? (
        <div className="grid grid-cols-1 gap-8 tablet:grid-cols-2 laptop:grid-cols-3">
          {posts.map((post, index) => (
            <Blog
              key={post.id}
              toNavigate={'/posts/' + post.slug}
              thumbnail={post.thumbnail}
              title={post.title}
              description={post.description ?? undefined}
              date={post.pub_date}
              tags={post.tags}
              isImagePriority={index < 6}
            />
          ))}
        </div>
      ) : (
        <p className="py-12 text-center">
          <Copy id="posts.empty" />
        </p>
      )}
    </main>
  );
};
export default PostsPage;
