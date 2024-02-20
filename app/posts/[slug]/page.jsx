import { notFound } from 'next/navigation';
import { compileMDX } from 'next-mdx-remote/rsc';
import readPostFile from '@/src/util/posts';

export default async function Post({
  params,
}) {
  const markdown = await readPostFile(params.slug);

  if (!markdown)
    notFound();

  const { content, frontmatter } = await compileMDX({
    source: markdown,
    options: { parseFrontmatter: true },
  });

  // do something with frontmatter, like set metadata or whatever
  console.log('frontmatter: ', frontmatter);

  return <>{content}</>;
}
