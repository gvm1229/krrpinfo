import matter from 'gray-matter';
import Markdown from 'markdown-to-jsx';
import { notFound } from 'next/navigation';
import { getAllPostSlugs, getPostContent } from '@/app/actions/posts';

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
    <div>
      <div className="text-left">
        <h1 className="text-2xl text-slate-600">{data.title}</h1>
        <p className="mt-2 text-slate-400">{formattedDate}</p>
      </div>

      <article className="prose dark:prose-invert">
        <Markdown>{content}</Markdown>
      </article>
    </div>
  );
}
