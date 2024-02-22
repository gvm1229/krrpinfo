// import Link from 'next/link';
// import { buttonVariants } from '@/src/components/ui/button';
import { ModeToggle } from '@/src/components/DarkMode/theme-toggle';
import { navContents } from '@/src/config/navBar';
import { cn } from '@/src/util/utils';
import { MainNav } from './MainNav';

export function SiteHeader({ className }) {
  return (
    <header
      id="header"
      className={cn('z-40', className)}
    >
      <div className="flex h-20 items-center justify-between px-8 py-6 md:px-20">
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
