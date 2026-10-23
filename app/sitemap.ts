import type { MetadataRoute } from 'next';
import { getAllPosts } from '@/src/lib/queries';
import { publishedEntries, siteSettings } from '@/src/cms/repository';
import { text, publicPathEnabled } from '@/src/cms/schema';
import { env } from '@/env.mjs';
export const dynamic = 'force-dynamic';
// 공개 콘텐츠와 활성 메뉴만 사이트맵에 반영
const sitemap = async (): Promise<MetadataRoute.Sitemap> => {
  const [posts, navigation, settings] = await Promise.all([
    getAllPosts(),
    publishedEntries('navigation'),
    siteSettings(),
  ]);
  const routes = Array.from(
    new Set([
      '/',
      ...navigation
        .map((entry) => text(entry, 'href'))
        .filter(
          (href) => href.startsWith('/') && !href.startsWith('/admin') && !href.startsWith('//'),
        ),
    ]),
  );
  return [
    ...routes
      .filter((path) => publicPathEnabled(settings, path))
      .map((path) => ({ url: env.NEXT_PUBLIC_APP_URL + path })),
    ...(settings.postsEnabled === 'true' ? posts : []).map((post) => ({
      url: env.NEXT_PUBLIC_APP_URL + '/posts/' + post.slug,
      lastModified: post.updated_at,
    })),
  ];
};
export default sitemap;
