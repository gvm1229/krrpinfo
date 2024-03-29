import { Redis } from '@upstash/redis';
import { ChevronLeft, EyeIcon } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import BreadcrumbContainer from '@/components/Breadcrumb/BreadcrumbContainer';
import StaticImage from '@/components/Image/StaticImage';
import { DashboardTableOfContents } from '@/components/Markdown/TableOfContents';
import { Mdx } from '@/components/Markdown/mdx-components';
import Tag from '@/components/Tag/Tag';
import ViewReporter from '@/components/View/ViewReporter';
import { buttonVariants } from '@/components/ui/button';
import { siteConfig } from '@/config/site';
import { getTableOfContents } from '@/src/util/toc';
import { absoluteUrl, cn, formatDate } from '@/src/util/utils';
import { allPosts } from 'contentlayer/generated';
import '@/src/styles/mdx.css';

export const revalidate = 60;
const redis = Redis.fromEnv();

async function getPostFromParams(params) {
  const post = allPosts.find((post) => post.slugAsParams === params.slug);
  if (!post) return null;
  return post;
}

export async function generateMetadata({ params }, parent) {
  const post = await getPostFromParams(params);

  if (!post) return {};

  // const url = env.NEXT_PUBLIC_APP_URL;

  // const ogUrl = new URL(`${url}/api/og`);
  // ogUrl.searchParams.set('heading', post.title);
  // ogUrl.searchParams.set('type', 'Blog Post');
  // ogUrl.searchParams.set('mode', 'dark');

  return {
    title: post.title,
    description: post.description,
    keywords: post.keywords
      ? [...(await parent).keywords, ...post.keywords]
      : [...(await parent).keywords],
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
      authors: ['Megiii'],
      url: absoluteUrl(post.slug),
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
    },
    metadataBase: new URL(`${siteConfig.url}${post.slug}`),
    alternates: {
      canonical: '/',
      languages: {
        'ko-KR': '/ko-KR',
        // 'en-US': '/en-US',
      },
    },
  };
}

export async function generateStaticParams() {
  return allPosts.map((post) => ({
    slug: post.slugAsParams.split('/').toString(),
  }));
}

async function getViewCount(slug: string) {
  if (process.env.NODE_ENV === 'production') {
    const views = await redis.get<number>(
      ['pageviews', 'projects', 'posts', slug].join(':'),
    );
    return views ?? 0;
  }
  return 1234; // Default view count for development
}

export default async function PostPage({
  params,
}: {
  params: { slug: string };
}) {
  const post = await getPostFromParams(params);
  if (!post) notFound();

  const toc = await getTableOfContents(post.body.raw);
  const views = await getViewCount(params.slug);

  return (
    <div className="container flex mobile_only:flex-col tablet:gap-x-16">
      <aside className="hidden tablet:block">
        <div className="shrink-0 tablet:sticky tablet:top-16 tablet:-mt-10 tablet:max-h-[calc(var(--vh)-4rem)] tablet:overflow-y-auto tablet:pt-10">
          <Link
            href="/posts"
            className={cn(
              buttonVariants({ variant: 'ghost' }),
              'relative inline-flex text-base',
            )}
          >
            <ChevronLeft className="mr-2 size-4" />
            포스트 목록으로 돌아가기
          </Link>
        </div>
      </aside>
      <main className="space-y-6 tablet:mt-1 tablet:flex-1">
        <header className="space-y-4 border-b pb-4 text-left tablet:space-y-6 tablet:pb-6">
          <BreadcrumbContainer
            itemsInput={[{ url: '/posts', label: '포스트' }]}
          />
          <p className="text-base font-medium text-muted-foreground tablet:text-lg">
            {formatDate(post.date)}
          </p>
          <h1 className="text-2xl font-bold tablet:text-5xl">
            {post.title}
          </h1>
          {post.description && (
            <p className="text-lg font-semibold text-muted-foreground tablet:text-xl">
              {post.description}
            </p>
          )}
          <div className="flex items-center justify-between">
            <Tag tagInput={post.tags} />
            <p
              id="views"
              className="flex items-center gap-2 text-base font-medium text-muted-foreground tablet:text-lg"
            >
              <EyeIcon className="size-6" />
              {views}
            </p>
          </div>
        </header>
        <div className="block border-b pb-6 text-sm tablet:hidden">
          <DashboardTableOfContents toc={toc} />
        </div>
        <StaticImage
          src={post.thumbnail}
          alt="thumbnail"
          width={1920}
          height={1080}
          isPriority
        />
        <Mdx code={post.body.code} />
        <footer className="flex w-full items-center justify-center border-t pt-8 tablet:hidden">
          <Link
            href="/posts"
            className={cn(
              buttonVariants({ variant: 'ghost' }),
              'relative inline-flex text-base',
            )}
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
      <ViewReporter
        slug={`posts:${params.slug}`}
        path={`/posts/${params.slug}`}
      />
    </div>
  );
}
