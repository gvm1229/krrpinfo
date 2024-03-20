'use client';

import { Menu, SquareLibrary } from 'lucide-react';
import Link from 'next/link';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { siteConfig } from '@/config/site';
import { useLockBody } from '@/src/hooks/use-lock-body';
import { cn } from '@/src/util/utils';

interface MobileNavProps {
  items?: {
    title: string;
    href: string;
    disabled?: boolean;
  }[];
  className?: string;
}

export function MobileNav({ items, className }: MobileNavProps) {
  return (
    <>
      <div
        className={cn(
          'flex w-full items-center justify-between tablet:hidden',
          className,
        )}
      >
        <Link href="/" className="flex items-center space-x-2">
          <div className="flex items-center gap-2">
            <SquareLibrary color="cyan" size={28} />
            <h1 className="text-xl font-bold">{siteConfig.name}</h1>
          </div>
        </Link>
      </div>
      <Popover>
        <PopoverTrigger asChild>
          <button>
            <Menu size={28} />
          </button>
        </PopoverTrigger>
        <MobilePopoverContent items={items} />
      </Popover>
    </>
  );
}

export function MobilePopoverContent({ items, className }: MobileNavProps) {
  useLockBody();

  return (
    <PopoverContent className={cn('top-20 h-svh w-screen ', className)}>
      <Link href="/" className="flex items-center space-x-2">
        <span className="font-bold">{siteConfig.name}</span>
      </Link>
      <nav className="grid grid-flow-row auto-rows-max text-sm">
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.disabled ? '#' : item.href}
            className={cn(
              'flex w-full items-center rounded-md p-2 text-sm font-medium hover:underline',
              item.disabled && 'cursor-not-allowed opacity-60',
            )}
          >
            {item.title}
          </Link>
        ))}
      </nav>
    </PopoverContent>
  );
}
