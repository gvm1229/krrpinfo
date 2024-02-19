import { access, readFile } from 'fs/promises';
import path from 'path';
import { notFound } from 'next/navigation';
import { compileMDX } from 'next-mdx-remote/rsc';

const POSTS_FOLDER = path.join(process.cwd(), 'content/posts');
console.log('posts folder: ', POSTS_FOLDER);

async function readPostFile(slug) {
  const filePath = path.resolve(path.join(POSTS_FOLDER, `${slug}.mdx`));
  console.log('filePath: ', filePath);

  try {
    await access(filePath);
  } catch (err) {
    return null;
  }

  // return fileContent;
  return readFile(filePath, { encoding: 'utf8' });
}

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

  return <>{content}</>;
}
