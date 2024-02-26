import { allPosts } from 'contentlayer/generated';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { DashboardTableOfContents } from '@/src/components/Markdown/TableOfContents';
import { Mdx } from '@/src/components/Markdown/mdx-components';
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

export async function generateMetadata({
  params,
}) {
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
    <div className="flex tablet:gap-x-16">
      <Link
        href="/posts"
        className={cn(
          buttonVariants({ variant: 'ghost' }),
          'relative hidden tablet:inline-flex',
        )}
      >
        <ChevronLeft className="mr-2 size-4" />
        포스트 목록으로 돌아가기
      </Link>
      <div className="flex-1 space-y-8">
        <header className="space-y-3 border-b pb-4 text-left tablet:space-y-6 tablet:pb-8">
          <p className="text-sm font-medium text-muted-foreground tablet:text-lg">{formatDate(post.date)}</p>
          <h1 className="text-2xl font-bold tablet:text-5xl">{post.title}</h1>
          {post.description && (
            <p className="text-lg font-semibold text-muted-foreground tablet:text-xl">{post.description}</p>
          )}
        </header>
        <Mdx code={post.body.code} />
      </div>
      <div className="hidden text-sm tablet:block">
        <div className="sticky top-16 -mt-10 max-h-[calc(var(--vh)-4rem)] overflow-y-auto pt-10">
          <DashboardTableOfContents toc={toc} />
        </div>
      </div>
    </div>
  );
}
