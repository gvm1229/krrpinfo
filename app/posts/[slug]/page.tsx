import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { auth } from '@/src/auth';
import BreadcrumbContainer from '@/components/Breadcrumb/BreadcrumbContainer';
import StaticImage from '@/components/Image/StaticImage';
import { DashboardTableOfContents } from '@/components/Markdown/TableOfContents';
import Tag from '@/components/Tag/Tag';
import { buttonVariants } from '@/components/ui/button';
import { siteConfig } from '@/config/site';
import { getPost, getPostMeta, getAllPostSlugs } from '@/src/lib/queries';
import { getCachedMarkdown } from '@/src/lib/markdown';
import { getTableOfContentsFromHtml } from '@/src/util/toc';
import { absoluteUrl, cn, formatDate } from '@/src/util/utils';
import type { ResolvingMetadata } from 'next';
import '@/src/styles/mdx.css';

export const revalidate = 60;

export async function generateStaticParams() {
  return getAllPostSlugs();
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> },
  parent: ResolvingMetadata,
) {
  const post = await getPostMeta((await params).slug);

  if (!post) return {};

  return {
    title: post.title,
    description: post.description,
    keywords: post.keywords
      ? [...((await parent).keywords ?? []), ...post.keywords]
      : [...((await parent).keywords ?? [])],
    authors: [
      {
        name: 'Megi',
        url: 'https://github.com/gvm1229',
      },
    ],
    openGraph: {
      title: post.title,
      description: post.description,
      type: 'article',
      authors: ['Megi'],
      url: absoluteUrl(`/posts/${post.slug}`),
      images: [
        {
          url: post.thumbnail,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description,
      images: [post.thumbnail],
      creator: 'Megi',
    },
    metadataBase: new URL(`${siteConfig.url}/posts/${post.slug}`),
    alternates: {
      canonical: '/',
      languages: {
        'ko-KR': '/ko-KR',
        // 'en-US': '/en-US',
      },
    },
  };
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [post, session] = await Promise.all([getPost(slug), auth()]);
  if (!post) notFound();

  const contentHtml = await getCachedMarkdown(slug, post.content);
  const toc = getTableOfContentsFromHtml(contentHtml);

  return (
    <div className="container flex mobile_only:flex-col tablet:gap-x-16">
      <aside className="hidden tablet:block">
        <div className="shrink-0 tablet:sticky tablet:top-16 tablet:-mt-10 tablet:max-h-[calc(var(--vh)-4rem)] tablet:overflow-y-auto tablet:pt-10">
          <Link
            href="/posts"
            className={cn(buttonVariants({ variant: 'ghost' }), 'relative inline-flex text-base')}
          >
            <ChevronLeft className="mr-2 size-4" />
            포스트 목록으로 돌아가기
          </Link>
        </div>
      </aside>
      <main className="space-y-6 tablet:mt-1 tablet:flex-1">
        <header className="space-y-4 border-b pb-4 text-left tablet:space-y-6 tablet:pb-6">
          <BreadcrumbContainer itemsInput={[{ url: '/posts', label: '포스트' }]} />
          <p className="text-base font-medium text-muted-foreground tablet:text-lg">
            {formatDate(post.pub_date)}
          </p>
          <h1 className="text-2xl font-bold tablet:text-5xl">{post.title}</h1>
          {isOwner(session) && (
            <Link
              href={`/admin/posts?edit=${slug}`}
              className="text-sm text-zinc-500 hover:text-blue-600"
            >
              Edit
            </Link>
          )}
          {post.description && (
            <p className="text-lg font-semibold text-muted-foreground tablet:text-xl">
              {post.description}
            </p>
          )}
          <Tag tagInput={post.tags} />
        </header>
        <div className="block border-b pb-6 text-sm tablet:hidden">
          <DashboardTableOfContents toc={toc} />
        </div>
        <StaticImage src={post.thumbnail} alt="thumbnail" width={1920} height={1080} isPriority />
        <div className="mdx" dangerouslySetInnerHTML={{ __html: contentHtml }} />
        <footer className="flex w-full items-center justify-center border-t pt-8 tablet:hidden">
          <Link
            href="/posts"
            className={cn(buttonVariants({ variant: 'ghost' }), 'relative inline-flex text-base')}
          >
            <ChevronLeft className="mr-2 size-4" />
            포스트 목록으로 돌아가기
          </Link>
        </footer>
      </main>
      <aside className="hidden text-sm tablet:block">
        <div className="sticky top-16 -mt-10 max-h-[calc(var(--vh)-4rem)] shrink-0 overflow-y-auto pt-10 tablet:min-w-48">
          <DashboardTableOfContents toc={toc} />
        </div>
      </aside>
    </div>
  );
}
