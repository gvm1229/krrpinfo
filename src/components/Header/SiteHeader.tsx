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
        <div className="flex h-20 w-full items-center justify-between gap-x-4 tablet:gap-0">
          {/* mobile view */}
          <MobileNav />
          {/* tablet & desktop view */}
          <MainNav items={navContents} />
          <div className="contents tablet:flex tablet:w-auto tablet:flex-none tablet:gap-x-2">
            {/* mobile view */}
            <div className="mobile_only:w-full mobile_only:flex-1">
              <CommandMenu userAgent={userAgent} />
            </div>
            <ModeToggle />
          </div>
        </div>
      </header>
      <div className="h-20" />
    </>
  );
}
