import * as React from 'react';
import { CommandMenu } from '@/components/Command/CommandMenu';
import { ModeToggle } from '@/components/DarkMode/theme-toggle';
import { navContents } from '@/config/navBar';
import { cn } from '@/src/util/utils';
import { MainNav } from './MainNav';
import { MobileNav } from './MobileNav';

export function SiteHeader({
  userAgent,
  className,
}: {
  userAgent: string;
  className?: string;
}) {
  return (
    <>
      <header
        id="header"
        className={cn(
          'fixed z-40 w-full border-b bg-background mobile_only:container tablet_only:container laptop:px-8',
          className,
        )}
      >
        <div className="flex h-20 w-full items-center justify-between gap-x-4 tablet:hidden">
          {/* mobile view */}
          <React.Suspense
            fallback={(
              <h1 className="bg-blue-400 p-2">Toggle Menu</h1>
            )}
          >
            <MobileNav />
          </React.Suspense>
          <div className="w-full flex-1">
            <CommandMenu userAgent={userAgent} />
          </div>
          <ModeToggle />
        </div>
        <div className="hidden h-20 w-full items-center justify-between gap-0 tablet:flex">
          {/* tablet & desktop view */}
          <MainNav items={navContents} />
          <div className="flex w-auto flex-none items-center gap-x-2">
            <CommandMenu userAgent={userAgent} />
            <ModeToggle />
          </div>
        </div>
      </header>
      <div className="h-20" />
    </>
  );
}
