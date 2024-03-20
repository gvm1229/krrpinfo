// import Link from 'next/link';
// import { buttonVariants } from '@/components/ui/button';
import { ModeToggle } from '@/components/DarkMode/theme-toggle';
import { MobileNav } from '@/components/Header/MobileNav';
import { navContents } from '@/config/navBar';
import { cn } from '@/src/util/utils';
import { MainNav } from './MainNav';

export function SiteHeader({ className }: { className?: string }) {
  return (
    <>
      <header
        id="header"
        className={cn(
          'fixed z-40 flex h-20 w-full items-center justify-between border-b bg-background mobile_only:container tablet_only:container desktop:px-8',
          className,
        )}
      >
        <MainNav items={navContents} />
        <div className="hidden tablet:block">
          <ModeToggle />
        </div>
        <MobileNav items={navContents} />
      </header>
      <div className="h-20" />
    </>
  );
}
