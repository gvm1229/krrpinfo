import { Redis } from '@upstash/redis';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import '@/src/styles/globals.css';
import { headers } from 'next/headers';
import React from 'react';
import ScrollToTopButton from '@/components/Button/ScrollToTopButton';
import { ThemeProvider } from '@/components/DarkMode/theme-provider';
import { SiteFooter } from '@/components/Footer/SiteFooter';
import { SiteHeader } from '@/components/Header/SiteHeader';
import ViewReporter from '@/components/View/ViewReporter';
import { siteConfig } from '@/config/site';

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
    icon: [
      {
        media: '(prefers-color-scheme: light)',
        url: '/icons/favicon.ico',
        href: '/icons/favicon.ico',
      },
      {
        media: '(prefers-color-scheme: dark)',
        url: '/icons/favicon.ico',
        href: '/icons/favicon.ico',
      },
    ],
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
};

export const viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#020617' },
  ],
};

export const revalidate = 60;
const redis = Redis.fromEnv();

function render(
  userAgent: string,
  children: React.ReactNode,
  totalViewSlug: string = '',
  totalViews: number = 1234,
) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="relative h-screen min-h-svh bg-background antialiased">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <div className="relative flex min-h-svh flex-col">
            <SiteHeader userAgent={userAgent} />
            <main className="relative flex-1 py-8 tablet:py-12">
              {children}
            </main>
            <SiteFooter totalViews={totalViews} />
            <ScrollToTopButton />
          </div>
        </ThemeProvider>
        <ViewReporter slug={totalViewSlug} path="/" />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}

export default async function RootLayout({ children }) {
  const userAgent: string = headers().get('user-agent');

  if (process.env.NODE_ENV === 'development')
    return render(userAgent, children);

  const totalViewSlug = 'krrpinfo:total-views';
  const totalViews = (await redis.get<number>(
    ['pageviews', 'projects', totalViewSlug].join(':'),
  )) ?? 0;

  return render(userAgent, children, totalViewSlug, totalViews);
}
