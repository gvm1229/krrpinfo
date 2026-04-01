import { compareDesc } from 'date-fns';
import { siteConfig } from '@/config/site';
import { env } from '@/env.mjs';
import type { MetadataRoute } from 'next';
import { allPosts } from 'contentlayer2/generated';

export type Changefreq = 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';

export default function sitemap(): MetadataRoute.Sitemap {
  const rootPath = env.NEXT_PUBLIC_APP_URL || `${siteConfig.url}`;

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
      url: `${siteConfig.url}`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${siteConfig.url}/posts`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    ...postsRoutes,
    {
      url: `'${siteConfig.url}/youtubers`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${siteConfig.url}/youtubers/videos`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${siteConfig.url}/redeem`,
      lastModified: new Date(),
      changeFrequency: 'always',
      priority: 0.9,
    },
  ];
}
