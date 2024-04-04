import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://krrpinfo.vercel.app',
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 1,
    },
    {
      url: 'https://krrpinfo.vercel.app/posts',
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: 'https://krrpinfo.vercel.app/youtubers',
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.5,
    },
    {
      url: 'https://krrpinfo.vercel.app/redeem',
      lastModified: new Date(),
      changeFrequency: 'always',
      priority: 0.2,
    },
  ];
}
