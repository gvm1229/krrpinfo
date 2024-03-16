import Link from 'next/link';
import React from 'react';

import { siteConfig } from '@/config/site';
import { useLockBody } from '@/src/hooks/use-lock-body';
import { cn } from '@/src/util/utils';

interface MobileNavProps {
  items?: {
    title: string
    href: string
    disabled?: boolean
  }[]
  children?: React.ReactNode
}

export function MobileNav({
  items,
  // setShowMobileMenu,
  children,
}: MobileNavProps) {
  useLockBody();

  return (
    <div
      id="mobile-nav"
      className={cn(
        'fixed inset-0 top-16 z-50 grid h-[calc(100vh-4rem)] grid-flow-row auto-rows-max overflow-auto p-6 pb-32 shadow-md animate-in slide-in-from-bottom-80 tablet:hidden',
      )}
    >
      <div
        className={cn(
          'relative z-20 grid gap-6 rounded-md bg-popover p-4 text-popover-foreground shadow-md',
          'dark:shadow-slate-600',
        )}
      >
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
        {children}
      </div>
    </div>
  );
}