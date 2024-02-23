'use client';

import { Barcode, X } from 'lucide-react';
import Link from 'next/link';
import { useSelectedLayoutSegment } from 'next/navigation';
import { useState } from 'react';

import { siteConfig } from '@/config/site';
import { cn } from '@/src/util/utils';
import { MobileNav } from './MobileNav';

export function MainNav({ items, children }) {
  const segment = useSelectedLayoutSegment();
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  return (
    <div
      id="main-nav"
      className="flex items-center gap-6 md:gap-10"
    >
      <Link href="/" className="hidden items-center space-x-2 md:flex">
        <Barcode color="red" size={32} />
        <span className="hidden text-2xl font-bold md:inline-block">
          {siteConfig.name}
        </span>
      </Link>
      {items?.length ? (
        <nav className="hidden gap-6 md:flex">
          {items?.map((item) => (
            <Link
              key={item.href}
              href={item.disabled ? '#' : item.href}
              className={cn(
                'flex items-center text-lg font-medium transition-colors hover:text-foreground/80 sm:text-sm',
                item.href.startsWith(`/${segment}`)
                  ? 'text-foreground'
                  : 'text-foreground/60',
                item.disabled && 'cursor-not-allowed opacity-80',
              )}
            >
              {item.title}
            </Link>
          ))}
        </nav>
      ) : null}
      <button
        className={cn(
          'flex items-center space-x-2 md:hidden',
          'ring-transparent focus-visible:ring-transparent',
        )}
        onClick={() => setShowMobileMenu(!showMobileMenu)}
      >
        {showMobileMenu ? <X size={20} /> : <Barcode color="red" size={20} />}
        <span className="font-bold">Menu</span>
      </button>
      {showMobileMenu && items && (
        <MobileNav
          items={items}
          // setShowMobileMenu={setShowMobileMenu}
        >
          {children}
        </MobileNav>
      )}
    </div>
  );
}
