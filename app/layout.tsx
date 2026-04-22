import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import '@/src/styles/globals.css';
import { headers } from 'next/headers';
import React from 'react';
import ScrollToTopButton from '@/components/Button/ScrollToTopButton';
import { ThemeProvider } from '@/components/DarkMode/theme-provider';
import { SiteFooter } from '@/components/Footer/SiteFooter';
import { SiteHeader } from '@/components/Header/SiteHeader';
import { siteConfig } from '@/config/site';
import { getPostsForSearch } from '@/src/lib/queries';
import ClientLayout from '@/src/components/Layout/ClientLayout';

export const metadata = {
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [
    'Kartrider Rush+',
    'Kartrider Rush Plus',
    '카트라이더 러쉬플러스',
    '카러플',
    '정보',
    '정보통',
    '공략',
    '팁',
  ],
  authors: [
    {
      name: 'Megi',
      url: 'https://github.com/gvm1229',
    },
  ],
  creator: 'Megi',
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: siteConfig.name,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.name,
    description: siteConfig.description,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: siteConfig.name,
      },
    ],
    creator: 'Megi',
  },
  // themeColor: [
  //   { media: '(prefers-color-scheme: light)', color: 'white' },
  //   { media: '(prefers-color-scheme: dark)', color: 'black' },
  // ],
  icons: {
    // In case of Dark Mode icon switch
    // icon: [
    //   {
    //     media: '(prefers-color-scheme: light)',
    //     url: '/favicon.ico',
    //     href: '/favicon.ico',
    //   },
    //   {
    //     media: '(prefers-color-scheme: dark)',
    //     url: '/favicon.ico',
    //     href: '/favicon.ico',
    //   },
    // ],
    icon: '/favicon.ico',
    shortcut: '/apple-touch-icon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  manifest: `${siteConfig.url}/site.webmanifest`,
  metadataBase: new URL(siteConfig.url),
  alternates: {
    canonical: '/',
    languages: {
      'ko-KR': '/ko-KR',
      // 'en-US': '/en-US',
    },
  },
  verification: {
    google: 'C7yAFuoHGn1yFWeweU6z9pwxdHNzwmYUAajFNjBfGNA',
    naver: 'b41015a8ba8f731e92476553c4fa3dc48ad9f63c',
  },
};

export const viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#020617' },
  ],
};

export const revalidate = 60;

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const userAgent: string = (await headers()).get('user-agent') ?? '';
  const posts = await getPostsForSearch();

  return (
    <html lang="en" suppressHydrationWarning>
      <body className="relative min-h-svh bg-background antialiased">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <ClientLayout>
            <div className="relative flex min-h-svh flex-col">
              <SiteHeader userAgent={userAgent} posts={posts} />
              <main className="relative flex-1 py-8 tablet:py-12">{children}</main>
              <SiteFooter />
              <ScrollToTopButton />
            </div>
          </ClientLayout>
        </ThemeProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
