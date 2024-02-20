import { access, readFile } from 'fs/promises';
import path from 'path';

const POSTS_FOLDER = path.join(process.cwd(), 'content/posts');
console.log('posts folder: ', POSTS_FOLDER);

export default async function readPostFile(slug) {
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
