import { notFound as disabledPage } from 'next/navigation';
import { siteSettings as pageSettings } from '@/src/cms/repository';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { auth } from '@/src/auth';
import { isOwner } from '@/src/cms/owner';
import { getPost } from '@/src/lib/queries';
import { renderPostContent } from '@/src/cms/post-content';
import { siteSettings } from '@/src/cms/repository';
import { env } from '@/env.mjs';
import { getTableOfContentsFromHtml } from '@/src/util/toc';
import { DashboardTableOfContents } from '@/components/Markdown/TableOfContents';
import { Copy } from '@/components/Text/PublicSite';
import Tag from '@/components/Tag/Tag';
import { Button } from '@/components/ui/button';
import { formatDate } from '@/src/util/utils';
import '@/src/styles/mdx.css';
export const dynamic = 'force-dynamic';
// 공개 글만 검색 메타데이터에 반영
export const generateMetadata = async ({ params }: { params: Promise<{ slug: string }> }) => {
  if ((await pageSettings()).postsEnabled !== 'true') return {};
  const post = await getPost((await params).slug);
  if (!post) return {};
  const settings = await siteSettings();
  return {
    title: post.title,
    description: post.description,
    keywords: post.keywords,
    alternates: { canonical: '/posts/' + post.slug },
    authors: [{ name: settings.author, url: settings.authorUrl }],
    openGraph: {
      type: 'article',
      title: post.title,
      description: post.description,
      url: env.NEXT_PUBLIC_APP_URL + '/posts/' + post.slug,
      images: post.thumbnail ? [{ url: post.thumbnail }] : [],
    },
  };
};
// 공개 글 상세 화면
const PostPage = async ({ params }: { params: Promise<{ slug: string }> }) => {
  if ((await pageSettings()).postsEnabled !== 'true') disabledPage();
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();
  const [html, session] = await Promise.all([renderPostContent(post), auth()]);
  const toc = getTableOfContentsFromHtml(html);
  return (
    <div className="container flex flex-col gap-8 laptop:flex-row laptop:justify-center">
      <main className="mx-auto w-full min-w-0 max-w-reading space-y-6 laptop:mx-0">
        <Link href="/posts" className="text-brand-blue hover:underline">
          <Copy id="posts.back" />
        </Link>
        <header className="space-y-4 border-b pb-5">
          <p className="text-muted-foreground">{formatDate(post.pub_date)}</p>
          <div className="flex items-start justify-between gap-4">
            <h1 className="text-2xl font-bold tablet:text-title">{post.title}</h1>
            {isOwner(session) && (
              <Button
                asChild
                className="shrink-0 whitespace-nowrap rounded-md bg-brand-blue text-white hover:bg-brand-blue-hover"
              >
                <Link href={'/admin/posts/' + slug + '/edit'}>Edit</Link>
              </Button>
            )}
          </div>
          {post.description && <p className="text-lg text-muted-foreground">{post.description}</p>}
          <Tag tagInput={post.tags} />
        </header>
        {post.thumbnail && (
          <img
            src={post.thumbnail}
            alt={post.title}
            width={1280}
            height={720}
            className="h-auto w-full rounded-lg bg-muted"
          />
        )}
        {toc.items && toc.items.length > 0 && (
          <details className="rounded-lg border p-4 laptop:hidden">
            <summary className="cursor-pointer font-semibold">
              <Copy id="posts.toc" />
            </summary>
            <div className="mt-2 text-sm">
              <DashboardTableOfContents toc={toc} hideTitle />
            </div>
          </details>
        )}
        <div className="mdx" dangerouslySetInnerHTML={{ __html: html }} />
      </main>
      <aside className="hidden w-56 shrink-0 text-sm laptop:block">
        <div className="sticky top-24">
          <DashboardTableOfContents toc={toc} />
        </div>
      </aside>
    </div>
  );
};
export default PostPage;
