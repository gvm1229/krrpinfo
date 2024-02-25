import matter from 'gray-matter';
import { notFound } from 'next/navigation';
import { getAllPostSlugs, getPostContent } from '@/app/actions/posts';
import MarkdownViewer from '@/src/components/Markdown/MarkdownViewer';
import { DashboardTableOfContents } from '@/src/components/Markdown/TableOfContents';
import { getTableOfContents } from '@/src/util/toc';
import { formatDate } from '@/src/util/utils';

export async function generateStaticParams() {
  const paths = await getAllPostSlugs();

  return paths.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }) {
  const { slug } = params;
  const post = await getPostContent(slug);
  const { data } = matter(post);

  return {
    title: data.title,
    description: data.subtitle,
  };
}

export default async function PostPage({ params }) {
  const { slug } = params;
  const post = await getPostContent(slug);

  if (!post)
    notFound();

  const { content, data } = matter(post);
  const toc = await getTableOfContents(content);

  return (
    <div className="flex tablet:gap-x-16">
      <div className="flex-1 space-y-8 tablet:space-y-16">
        <header className="space-y-3 border-b pb-4 text-left tablet:space-y-6 tablet:pb-8">
          <p className="text-sm font-medium dark:text-slate-500 tablet:text-lg">{formatDate(data.date)}</p>
          <h1 className="text-2xl font-bold tablet:text-5xl">{data.title}</h1>
          <p className="text-lg font-semibold dark:text-slate-400 tablet:text-2xl">{data.description}</p>
        </header>
        <MarkdownViewer content={content} />
      </div>
      <div className="hidden text-sm tablet:block">
        <div className="sticky top-16 -mt-10 max-h-[calc(var(--vh)-4rem)] overflow-y-auto pt-10">
          <DashboardTableOfContents toc={toc} />
        </div>
      </div>
    </div>
  );
}
