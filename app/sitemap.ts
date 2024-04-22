import { compareDesc } from 'date-fns';
import { env } from '@/env.mjs';
import type { MetadataRoute } from 'next';
import { allPosts } from 'contentlayer/generated';

export type Changefreq = 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';

export default function sitemap(): MetadataRoute.Sitemap {
  const rootPath = env.NEXT_PUBLIC_APP_URL || 'https://kartrushplus.info';

  const posts = allPosts
    .filter((post) => post.published)
    .sort((a, b) => compareDesc(new Date(a.date), new Date(b.date)));

  const postsRoutes = posts.map((post) => ({
    url: `${rootPath}${post.slug}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'daily' as Changefreq,
    priority: 0.8,
  }));

  return [
    {
      url: 'https://kartrushplus.info',
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: 'https://kartrushplus.info/posts',
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    ...postsRoutes,
    {
      url: 'https://kartrushplus.info/youtubers',
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: 'https://kartrushplus.info/redeem',
      lastModified: new Date(),
      changeFrequency: 'always',
      priority: 0.9,
    },
  ];
}
