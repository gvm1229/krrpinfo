import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { ThemeProvider } from '@/components/DarkMode/theme-provider';
import { siteSettings } from '@/src/cms/repository';
import { env } from '@/env.mjs';
import '@/src/styles/globals.css';
export const dynamic = 'force-dynamic';
// CMS 사이트 메타데이터
export const generateMetadata = async () => {
  try {
    const settings = await siteSettings();
    return {
      title: { default: settings.name, template: '%s | ' + settings.name },
      description: settings.description,
      keywords: settings.keywords
        .split(',')
        .map((value) => value.trim())
        .filter(Boolean),
      authors: [{ name: settings.author, url: settings.authorUrl }],
      creator: settings.author,
      openGraph: {
        type: 'website',
        locale: 'ko_KR',
        url: env.NEXT_PUBLIC_APP_URL,
        title: settings.name,
        description: settings.description,
        siteName: settings.name,
        images: settings.ogImage
          ? [{ url: settings.ogImage, width: 1200, height: 630, alt: settings.name }]
          : [],
      },
      twitter: {
        card: 'summary_large_image' as const,
        title: settings.name,
        description: settings.description,
        images: settings.ogImage ? [settings.ogImage] : [],
      },
      metadataBase: new URL(env.NEXT_PUBLIC_APP_URL),
      verification: {
        google: settings.googleVerification,
        other: { naver: settings.naverVerification },
      },
    };
  } catch {
    return {};
  }
};
// 공개 사이트와 관리자 공통 기반
const RootLayout = ({ children }: { children: React.ReactNode }) => (
  <html lang="ko" suppressHydrationWarning>
    <body className="relative min-h-svh bg-background antialiased">
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        {children}
      </ThemeProvider>
      <Analytics />
      <SpeedInsights />
    </body>
  </html>
);
export default RootLayout;
