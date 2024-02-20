import localFont from 'next/font/local';
import '@/src/styles/globals.css';
import { ThemeProvider } from '@/src/components/DarkMode/theme-provider';
import { SiteFooter } from '@/src/components/Footer/SiteFooter';
import { SiteHeader } from '@/src/components/Header/SiteHeader';
import { siteConfig } from '@/src/config/site';
import { cn } from '@/src/util/utils';

const pretendard = localFont({ src: '../src/styles/fonts/PretendardVariable.woff2' });

export const metadata = {
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [
    'Kartrider Rush+',
    'Kartrider Rush Plus',
  ],
  authors: [
    {
      name: 'Megi',
      url: 'https://github.com/gvm1229',
    },
  ],
  creator: 'Megi',
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
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={cn(
          'min-h-screen bg-background antialiased',
          pretendard.className,
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
        >
          <div className="flex min-h-screen flex-col">
            <SiteHeader className="border-b bg-background" />
            <main className="container flex-1 p-8 md:py-12">
              {children}
            </main>
            <SiteFooter className="border-t bg-background" />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
