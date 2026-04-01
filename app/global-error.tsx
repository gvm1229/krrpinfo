'use client';

// Error components must be Client Components

import { Home } from 'lucide-react';
import { useRouter } from 'next/navigation';

import React from 'react';
import ScrollToTopButton from '@/components/Button/ScrollToTopButton';
import { ThemeProvider } from '@/components/DarkMode/theme-provider';
import { SiteFooter } from '@/components/Footer/SiteFooter';
import { SiteHeader } from '@/components/Header/SiteHeader';
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { siteConfig } from '@/config/site';
import { Button } from '@/src/components/ui/button';

export default function GlobalError({
  error,
  // reset,
}: {
  error: Error & { digest?: string };
  // reset: () => void
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="relative h-screen min-h-svh bg-background antialiased">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <div className="relative flex min-h-svh flex-col">
            <SiteHeader userAgent="" />
            <main className="relative flex-1 py-8 tablet:py-12">
              <ErrorBody error={error} />
            </main>
            <SiteFooter totalViews={-1} />
            <ScrollToTopButton />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}

function ErrorBody({
  error,
  // reset,
}: {
  error: Error & { digest?: string };
  // reset: () => void;
}) {
  const router = useRouter();

  return (
    <>
      <title>{`알 수 없는 오류 | ${siteConfig.name}`}</title>
      <div className="absolute inset-0 mx-8 flex items-center justify-center">
        <Card className="flex w-full flex-col items-center justify-center">
          <CardHeader className="space-y-2 text-center tablet:space-y-4 tablet:pt-12">
            <CardTitle className="text-4xl tablet:text-6xl laptop:text-7xl">오류</CardTitle>
            <h1 className="text-2xl font-medium tracking-tight tablet:text-3xl laptop:text-4xl">
              무언가가 잘못되었습니다!
            </h1>
            <CardDescription className="pt-2 text-base tablet:text-xl laptop:text-2xl">
              {error.message}
            </CardDescription>
          </CardHeader>
          <CardFooter className="flex justify-center tablet:pb-12">
            <Button
              onClick={() => {
                router.push('/');
                router.refresh();
              }}
              className="flex items-center gap-3 text-lg tablet:h-13 tablet:text-xl"
            >
              <Home className="size-4 tablet:size-6" />홈 화면으로 돌아가기
            </Button>
          </CardFooter>
        </Card>
      </div>
    </>
  );
}
