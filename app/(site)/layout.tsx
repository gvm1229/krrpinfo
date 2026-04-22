import { headers } from 'next/headers';
import React from 'react';
import ScrollToTopButton from '@/components/Button/ScrollToTopButton';
import { SiteFooter } from '@/components/Footer/SiteFooter';
import { SiteHeader } from '@/components/Header/SiteHeader';
import { getPostsForSearch } from '@/src/lib/queries';
import ClientLayout from '@/src/components/Layout/ClientLayout';

// site chrome 래퍼 — 일반 방문자 페이지 전용 layout
export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const userAgent: string = (await headers()).get('user-agent') ?? '';
  const posts = await getPostsForSearch();

  return (
    <ClientLayout>
      <div className="relative flex min-h-svh flex-col">
        <SiteHeader userAgent={userAgent} posts={posts} />
        <main className="relative flex-1 py-8 tablet:py-12">{children}</main>
        <SiteFooter />
        <ScrollToTopButton />
      </div>
    </ClientLayout>
  );
}
