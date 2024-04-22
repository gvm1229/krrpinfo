import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: '/dashboard/',
    },
    host: 'https://kartrushplus.info',
    sitemap: 'https://kartrushplus.info/sitemap.xml',
  };
}
