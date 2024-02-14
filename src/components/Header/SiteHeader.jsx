import Link from 'next/link';
import { MainNav } from '@/src/components/Header/MainNav';
import { buttonVariants } from '@/src/components/ui/button';
import { navContents } from '@/src/config/navBar';
import { cn } from '@/src/lib/utils';

export function SiteHeader({ className }) {
  return (
    <header
      id="header"
      className={cn('z-40', className)}
    >
      <div className="container flex h-20 items-center justify-between py-6">
        <MainNav items={navContents} />
        <nav>
          <Link
            href="/login"
            className={cn(
              buttonVariants({ variant: 'secondary', size: 'sm' }),
              'px-4',
            )}
          >
            Login
          </Link>
        </nav>
      </div>
    </header>
  );
}
