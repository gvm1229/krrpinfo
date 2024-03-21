import { CommandMenu } from '@/components/Command/CommandMenu';
import { ModeToggle } from '@/components/DarkMode/theme-toggle';
import { navContents } from '@/config/navBar';
import { cn } from '@/src/util/utils';
import { MainNav } from './MainNav';
import { MobileNav } from './MobileNav';

export function SiteHeader({ className }: { className?: string }) {
  return (
    <>
      <header
        id="header"
        className={cn(
          'fixed z-40 flex h-20 w-full items-center justify-between gap-x-4 border-b bg-background mobile_only:container tablet_only:container tablet:gap-0 desktop:px-8',
          className,
        )}
      >
        <MainNav items={navContents} />
        <div className="tablet:hidden">
          <MobileNav />
        </div>
        <div className="w-full flex-1 tablet:hidden">
          <CommandMenu />
        </div>
        <div className="hidden w-auto flex-none items-center gap-x-2 tablet:flex">
          <CommandMenu />
          <ModeToggle />
        </div>
        <div className="tablet:hidden">
          <ModeToggle />
        </div>
      </header>
      <div className="h-20" />
    </>
  );
}
