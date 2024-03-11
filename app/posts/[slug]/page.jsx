import { allPosts } from 'contentlayer/generated';
import { ChevronLeft } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { DashboardTableOfContents } from '@/src/components/Markdown/TableOfContents';
import { Mdx } from '@/src/components/Markdown/mdx-components';
import Tag from '@/src/components/Tag/Tag';
import { buttonVariants } from '@/src/components/ui/button';
import { getTableOfContents } from '@/src/util/toc';
import { absoluteUrl, cn, formatDate } from '@/src/util/utils';
import '@/src/styles/mdx.css';

async function getPostFromParams(params) {
  const slug = params?.slug;
  const post = allPosts.find((post) => post.slugAsParams === slug);

  if (!post)
    return null;

  return post;
}

export async function generateMetadata({ params }, parent) {
  const post = await getPostFromParams(params);

  if (!post)
    return {};

  // const url = env.NEXT_PUBLIC_APP_URL;

  // const ogUrl = new URL(`${url}/api/og`);
  // ogUrl.searchParams.set('heading', post.title);
  // ogUrl.searchParams.set('type', 'Blog Post');
  // ogUrl.searchParams.set('mode', 'dark');

  return {
    title: post.title,
    description: post.description,
    keywords: post.keywords ? [...(await parent).keywords, ...post.keywords] : [...(await parent).keywords],
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
  };
}

export async function generateStaticParams() {
  return allPosts.map((post) => ({
    slug: post.slugAsParams.split('/').toString(),
  }));
}

export default async function PostPage({ params }) {
  const post = await getPostFromParams(params);

  if (!post)
    notFound();

  const toc = await getTableOfContents(post.body.raw);

  return (
    <div className="flex mobile_only:flex-col tablet:gap-x-16">
      <div className="block text-sm mobile_only:mb-4">
        <div
          className="shrink-0 tablet:sticky tablet:top-16 tablet:-mt-10 tablet:max-h-[calc(var(--vh)-4rem)] tablet:overflow-y-auto tablet:pt-10"
        >
          <Link
            href="/posts"
            className={cn(
              buttonVariants({ variant: 'ghost' }),
              'relative inline-flex text-sm mobile_only:pl-2',
            )}
          >
            <ChevronLeft className="mr-2 size-4" />
            포스트 목록으로 돌아가기
          </Link>
        </div>
      </div>
      <div className="space-y-6 tablet:flex-1">
        <header className="space-y-3 border-b pb-4 text-left tablet:space-y-6 tablet:pb-6">
          <p className="text-sm font-medium text-muted-foreground tablet:text-lg">{formatDate(post.date)}</p>
          <h1 className="text-2xl font-bold tablet:text-5xl">{post.title}</h1>
          {post.description && (
            <p className="text-lg font-semibold text-muted-foreground tablet:text-xl">{post.description}</p>
          )}
          <Tag tagInput={post.tags} />
        </header>
        <Image
          src={post.thumbnail}
          alt="thumbnail"
          width={1920}
          height={1080}
          priority
        />
        <Mdx code={post.body.code} />
      </div>
      <div className="hidden text-sm tablet:block">
        <div
          className="sticky top-16 -mt-10 max-h-[calc(var(--vh)-4rem)] shrink-0 overflow-y-auto pt-10 tablet:min-w-48"
        >
          <DashboardTableOfContents toc={toc} />
        </div>
      </div>
    </div>
  );
}
