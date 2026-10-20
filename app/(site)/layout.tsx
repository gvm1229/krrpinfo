import { publicPathEnabled, text } from '@/src/cms/schema';
import { headers } from 'next/headers';
import { SiteHeader } from '@/components/Header/SiteHeader';
import { SiteFooter } from '@/components/Footer/SiteFooter';
import { PublicSiteProvider } from '@/components/Text/PublicSite';
import { siteSettings, publicCopy, publishedEntries } from '@/src/cms/repository';
import { getPostsForSearch } from '@/src/lib/queries';
import ClientLayout from '@/components/Layout/ClientLayout';
export const dynamic = 'force-dynamic';
// 공개 화면의 공통 데이터 연결
const SiteLayout = async ({ children }: { children: React.ReactNode }) => {
  const [settings, copy, navigation, posts, requestHeaders] = await Promise.all([
    siteSettings(),
    publicCopy(),
    publishedEntries('navigation'),
    getPostsForSearch(),
    headers(),
  ]);
  return (
    <PublicSiteProvider
      value={{
        settings,
        copy,
        navigation: navigation.filter((entry) => publicPathEnabled(settings, text(entry, 'href'))),
      }}
    >
      <ClientLayout>
        <div className="relative flex min-h-svh flex-col">
          <SiteHeader
            userAgent={requestHeaders.get('user-agent') ?? ''}
            posts={settings.postsEnabled === 'true' ? posts : []}
          />
          <main className="relative flex-1 py-8 tablet:py-12">{children}</main>
          <SiteFooter />
        </div>
      </ClientLayout>
    </PublicSiteProvider>
  );
};
export default SiteLayout;
