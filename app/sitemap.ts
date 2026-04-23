import { siteConfig } from '@/config/site';
import { env } from '@/env.mjs';
import { getAllPosts } from '@/src/lib/queries';
import type { MetadataRoute } from 'next';

export type Changefreq = 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const rootPath = env.NEXT_PUBLIC_APP_URL || `${siteConfig.url}`;

  const posts = await getAllPosts();

  const postsRoutes = posts.map((post) => ({
    url: `${rootPath}/posts/${post.slug}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'daily' as Changefreq,
    priority: 0.8,
  }));

  // youtubers page feature flag gate
  const showYoutubers = process.env.NEXT_PUBLIC_SHOW_YOUTUBERS === 'true';

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
    ...(showYoutubers
      ? [
          {
            url: `${siteConfig.url}/youtubers`,
            lastModified: new Date(),
            changeFrequency: 'daily' as Changefreq,
            priority: 0.9,
          },
          {
            url: `${siteConfig.url}/youtubers/videos`,
            lastModified: new Date(),
            changeFrequency: 'daily' as Changefreq,
            priority: 0.9,
          },
        ]
      : []),
    {
      url: `${siteConfig.url}/redeem`,
      lastModified: new Date(),
      changeFrequency: 'always',
      priority: 0.9,
    },
    {
      url: `${siteConfig.url}/seasons`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
  ];
}
