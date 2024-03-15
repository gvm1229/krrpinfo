import { Redis } from '@upstash/redis';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import '@/src/styles/globals.css';
import ScrollToTopButton from '@/components/Button/ScrollToTopButton';
import { ThemeProvider } from '@/components/DarkMode/theme-provider';
import { SiteFooter } from '@/components/Footer/SiteFooter';
import { SiteHeader } from '@/components/Header/SiteHeader';
import ViewReporter from '@/components/View/ViewReporter';
import { siteConfig } from '@/config/site';
import { env } from '@/env.mjs';

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
  ],
  authors: [
    {
      name: 'Megi',
      url: 'https://github.com/gvm1229',
    },
  ],
  creator: 'Megi',
  openGraph: {
    title: siteConfig.name,
    description: siteConfig.description,
    type: 'article',
    url: env.NEXT_PUBLIC_APP_URL,
    images: [
      {
        url: './opengraph-image.webp',
        width: 1280,
        height: 720,
        alt: 'current_season_image',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.name,
    description: siteConfig.description,
    images: './opengraph-image.webp',
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
      'en-US': '/en-US',
      'ko-KR': '/ko-KR',
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

export default async function RootLayout({ children }) {
  const totalViewSlug = 'krrpinfo:total-views';
  const totalViews = (await redis.get<number>(
    ['pageviews', 'projects', totalViewSlug].join(':'),
  )) ?? 0;

  return (
    <html lang="en">
      <body className="relative min-h-svh bg-background antialiased">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <div className="relative flex min-h-svh flex-col">
            <SiteHeader className="border-b bg-background" />
            <main className="container relative flex-1 py-8 tablet:py-12">
              {children}
            </main>
            <SiteFooter
              className="border-t bg-background"
              totalViews={totalViews}
            />
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
