import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import '@/src/styles/globals.css';
import { siteConfig } from '@/config/site';
import { ThemeProvider } from '@/src/components/DarkMode/theme-provider';
import { SiteFooter } from '@/src/components/Footer/SiteFooter';
import { SiteHeader } from '@/src/components/Header/SiteHeader';

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
  metadataBase: siteConfig.url,
  alternates: {
    canonical: '/',
    languages: {
      'en-US': '/en-US',
      'ko-KR': '/ko-KR',
    },
  },
  openGraph: {
    images: './opengraph-image.webp',
  },
};

export const viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#020617' },
  ],
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
    >
      <body className="relative min-h-screen bg-background antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
        >
          <div className="relative flex min-h-screen flex-col">
            <SiteHeader className="border-b bg-background" />
            <main className="container relative flex-1 py-8 tablet:py-12">
              {children}
            </main>
            <SiteFooter className="border-t bg-background" />
          </div>
        </ThemeProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
