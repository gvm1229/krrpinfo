import { siteConfig } from '@/config/site';
import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/dashboard/', '/admin/', '/api/auth/'],
    },
    host: `${siteConfig.url}`,
    sitemap: `${siteConfig.url}/sitemap.xml`,
  };
}
