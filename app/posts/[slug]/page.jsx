import matter from 'gray-matter';
import Markdown from 'markdown-to-jsx';
import { notFound } from 'next/navigation';
import { getAllPostSlugs, getPostContent } from '@/app/actions/posts';
import TableOfContents from '@/src/components/Markdown/TableOfContents';

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
  const formattedDate = new Date(data.date).toLocaleDateString();

  return (
    <div className="space-y-8 tablet:space-y-16">
      <div className="border-b pb-4 text-left">
        <h1 className="text-4xl font-bold dark:text-slate-400">{data.title}</h1>
        <p className="mt-2 text-2xl dark:text-slate-500">{data.subtitle}</p>
        <p className="mt-2 text-xl dark:text-slate-600">{formattedDate}</p>
      </div>

      <article className="prose dark:prose-invert">
        <Markdown>{content}</Markdown>
      </article>
    </div>
  );
}
