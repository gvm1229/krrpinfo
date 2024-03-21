'use client';

import * as React from 'react';
import { CommandMenu } from '@/components/Command/CommandMenu';
import { ModeToggle } from '@/components/DarkMode/theme-toggle';
import { navContents } from '@/config/navBar';
import { cn } from '@/src/util/utils';
import { MainNav } from './MainNav';
import { MobileNav } from './MobileNav';

export function SiteHeader({ className }: { className?: string }) {
  const [isMobile, setIsMobile] = React.useState(false);

  // won't affect performance too much as this will only run once per render, as devices don't really change frequently
  React.useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 720px)'); // tailwind - mobile
    const handleResize = (e) => {
      setIsMobile(e.matches);
    };

    // Call once to set the initial state
    handleResize(mediaQuery);

    // Add event listener for resize
    mediaQuery.addEventListener('change', handleResize);

    // Cleanup
    return () => {
      mediaQuery.removeEventListener('change', handleResize);
    };
  }, []);

  return (
    <>
      <header
        id="header"
        className={cn(
          'fixed z-40 flex h-20 w-full items-center justify-between gap-x-4 border-b bg-background mobile_only:container tablet_only:container tablet:gap-0 desktop:px-8',
          className,
        )}
      >
        {isMobile ? (
          <>
            {/* mobile view */}
            <MobileNav />
            <div className="w-full flex-1">
              <CommandMenu />
            </div>
            <ModeToggle />
          </>
        ) : (
          <>
            {/* tablet & desktop view */}
            <MainNav items={navContents} />
            <div className="flex w-auto flex-none items-center gap-x-2">
              <CommandMenu />
              <ModeToggle />
            </div>
          </>
        )}
      </header>
      <div className="h-20" />
    </>
  );
}
