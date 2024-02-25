import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';
import { formatDate } from '@/src/util/utils';

const defaultPostsFolder = 'content/posts';

/**
 * Retrieves all the slugs for the post files.
 *
 * @param {string} customPostsFolder - the custom posts folder path
 * @return {Promise<string[]>} an array of post slugs
 */
export async function getAllPostSlugs(customPostsFolder) {
  const postsFolder = path.join(process.cwd(), customPostsFolder || defaultPostsFolder);
  const postFiles = await fs.readdir(postsFolder);
  return postFiles.map((fileName) => fileName.replace(/\.mdx$/, ''));
}

/**
 * Asynchronously retrieves the content of a post based on its slug.
 *
 * @param {string} slug - The unique identifier of the post.
 * @param {string} customPostsFolder - The custom folder path where the posts are stored.
 * @return {Promise<Object|null>} A Promise that resolves to the parsed content of the post, or null if an error occurs.
 */
export async function getPostContent(slug, customPostsFolder) {
  const postsFolder = path.join(process.cwd(), customPostsFolder || defaultPostsFolder);
  const filePath = path.resolve(path.join(postsFolder, `${slug}.mdx`));
  try {
    return await fs.readFile(filePath, { encoding: 'utf8' });
  } catch (err) {
    return null;
  }
}

/**
 * Retrieves the contents of all posts in the specified folder.
 *
 * @param {string} customPostsFolder - The folder containing custom posts
 * @return {Promise<Array>} An array of post contents
 */
export async function getAllPosts(customPostsFolder) {
  const postsFolder = path.join(process.cwd(), customPostsFolder || defaultPostsFolder);
  const postFiles = await fs.readdir(postsFolder);

  // Use Promise.all to asynchronously fetch and process all post contents
  return Promise.all(postFiles.map(async (fileName) => {
    const slug = fileName.replace(/\.mdx$/, '');
    const content = await getPostContent(slug, customPostsFolder);
    const matterResult = matter(content);

    return {
      slug,
      title: matterResult.data?.title,
      date: formatDate(matterResult.data?.date),
      description: matterResult.data?.description,
      thumbnail: matterResult.data?.thumbnail,
      tags: matterResult.data?.tags,
    };
  }));
}
