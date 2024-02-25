// import Link from 'next/link';
// import { buttonVariants } from '@/src/components/ui/button';
import { navContents } from '@/config/navBar';
import { ModeToggle } from '@/src/components/DarkMode/theme-toggle';
import { cn } from '@/src/util/utils';
import { MainNav } from './MainNav';

export function SiteHeader({ className }) {
  return (
    <header
      id="header"
      className={cn('z-40', className)}
    >
      <div className="flex h-20 items-center justify-between tablet_only:container desktop:px-8">
        <MainNav items={navContents} />
        {/* <nav> */}
        {/*  <Link */}
        {/*    href="/login" */}
        {/*    className={cn( */}
        {/*      buttonVariants({ variant: 'secondary', size: 'sm' }), */}
        {/*      'px-4', */}
        {/*    )} */}
        {/*  > */}
        {/*    Login */}
        {/*  </Link> */}
        {/* </nav> */}
        <ModeToggle />
      </div>
    </header>
  );
}
