import { Redis } from '@upstash/redis';
import { ChevronLeft, EyeIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import BreadcrumbContainer from '@/components/Breadcrumb/BreadcrumbContainer';
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

export default async function PostPage({ params }) {
  const post = await getPostFromParams(params);

  if (!post) notFound();

  const toc = await getTableOfContents(post.body.raw);

  if (process.env.NODE_ENV === 'development')
    return (
      <div className="container flex flex-col tablet:gap-x-16 desktop:flex-row">
        <div className="hidden desktop:block">
          <div className="shrink-0 desktop:sticky desktop:top-16 desktop:-mt-10 desktop:max-h-[calc(var(--vh)-4rem)] desktop:overflow-y-auto desktop:pt-10">
            <Link
              href="/posts"
              className={cn(
                buttonVariants({ variant: 'ghost' }),
                'relative inline-flex text-sm',
              )}
            >
              <ChevronLeft className="mr-2 size-4" />
              포스트 목록으로 돌아가기
            </Link>
          </div>
        </div>
        <div className="space-y-6 desktop:mt-1 desktop:flex-1">
          <header className="space-y-4 border-b pb-4 text-left desktop:space-y-6 desktop:pb-6">
            <BreadcrumbContainer
              itemsInput={[{ url: '/posts', label: '포스트' }]}
            />
            <p className="text-base font-medium text-muted-foreground tablet:text-lg desktop:text-xl">
              {formatDate(post.date)}
            </p>
            <h1 className="text-2xl font-bold tablet:text-3xl desktop:text-4xl">
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
                className="flex items-center gap-2 text-base font-medium text-muted-foreground tablet:text-lg desktop:text-xl"
              >
                <EyeIcon className="size-6" />
                {1234}
              </p>
            </div>
          </header>
          <div className="block border-b pb-6 text-sm desktop:hidden">
            <DashboardTableOfContents toc={toc} />
          </div>
          <Image
            src={post.thumbnail}
            alt="thumbnail"
            width={1920}
            height={1080}
            priority
          />
          <Mdx code={post.body.code} />
          <div className="flex w-full items-center justify-center border-t pt-8 desktop:hidden">
            <Link
              href="/posts"
              className={cn(
                buttonVariants({ variant: 'ghost' }),
                'relative inline-flex text-sm',
              )}
            >
              <ChevronLeft className="mr-2 size-4" />
              포스트 목록으로 돌아가기
            </Link>
          </div>
        </div>
        <div className="hidden text-sm desktop:block">
          <div className="sticky top-16 -mt-10 max-h-[calc(var(--vh)-4rem)] min-w-48 shrink-0 overflow-y-auto pt-10">
            <DashboardTableOfContents toc={toc} />
          </div>
        </div>
      </div>
    );

  const views = (await redis.get<number>(
    ['pageviews', 'projects', 'posts', params.slug].join(':'),
  )) ?? 0;

  return (
    <div className="container flex flex-col tablet:gap-x-16 desktop:flex-row">
      <div className="hidden desktop:block">
        <div className="shrink-0 desktop:sticky desktop:top-16 desktop:-mt-10 desktop:max-h-[calc(var(--vh)-4rem)] desktop:overflow-y-auto desktop:pt-10">
          <Link
            href="/posts"
            className={cn(
              buttonVariants({ variant: 'ghost' }),
              'relative inline-flex text-sm',
            )}
          >
            <ChevronLeft className="mr-2 size-4" />
            포스트 목록으로 돌아가기
          </Link>
        </div>
      </div>
      <div className="space-y-6 desktop:mt-1 desktop:flex-1">
        <header className="space-y-4 border-b pb-4 text-left desktop:space-y-6 desktop:pb-6">
          <BreadcrumbContainer
            itemsInput={[{ url: '/posts', label: '포스트' }]}
          />
          <p className="text-base font-medium text-muted-foreground tablet:text-lg desktop:text-xl">
            {formatDate(post.date)}
          </p>
          <h1 className="text-2xl font-bold tablet:text-5xl">{post.title}</h1>
          {post.description && (
            <p className="text-lg font-semibold text-muted-foreground tablet:text-xl desktop:text-2xl">
              {post.description}
            </p>
          )}
          <div className="flex items-center justify-between">
            <Tag tagInput={post.tags} />
            <p
              id="views"
              className="flex items-center gap-2 text-base font-medium text-muted-foreground tablet:text-lg desktop:text-xl"
            >
              <EyeIcon className="size-6" />
              {views}
            </p>
          </div>
        </header>
        <div className="block border-b pb-6 text-sm desktop:hidden">
          <DashboardTableOfContents toc={toc} />
        </div>
        <Image
          src={post.thumbnail}
          alt="thumbnail"
          width={1920}
          height={1080}
          priority
        />
        <Mdx code={post.body.code} />
        <div className="flex w-full items-center justify-center border-t pt-8 desktop:hidden">
          <Link
            href="/posts"
            className={cn(
              buttonVariants({ variant: 'ghost' }),
              'relative inline-flex text-sm',
            )}
          >
            <ChevronLeft className="mr-2 size-4" />
            포스트 목록으로 돌아가기
          </Link>
        </div>
      </div>
      <div className="hidden text-sm desktop:block">
        <div className="sticky top-16 -mt-10 max-h-[calc(var(--vh)-4rem)] min-w-48 shrink-0 overflow-y-auto pt-10">
          <DashboardTableOfContents toc={toc} />
        </div>
      </div>
      <ViewReporter
        slug={`posts:${params.slug}`}
        path={`/posts/${params.slug}`}
      />
    </div>
  );
}
