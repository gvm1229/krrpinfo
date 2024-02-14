import localFont from 'next/font/local';
import React from 'react';
import { ThemeProvider } from '@/app/_components/ui/theme-provider';
import './_styles/globals.css';
import { ModeToggle } from '@/app/_components/ui/theme-toggle';

const pretendard = localFont({ src: './_styles/fonts/PretendardVariable.woff2' });

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
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${pretendard.className} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
