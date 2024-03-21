'use client';

import { SquareLibrary } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSelectedLayoutSegment } from 'next/navigation';

import { siteConfig } from '@/config/site';
import { cn } from '@/src/util/utils';

interface MainNavProps {
  items?: {
    title: string;
    href: string;
    disabled?: boolean;
  }[];
  className?: string;
}

export function MainNav({ items, className }: MainNavProps) {
  const segment = useSelectedLayoutSegment();
  const router = useRouter();

  return (
    <div
      id="main-nav"
      className={cn(
        'hidden items-center gap-6 tablet:flex tablet:gap-10',
        className,
      )}
    >
      <button
        onClick={() => {
          router.push('/');
          router.refresh();
        }}
        className="flex items-center space-x-2"
      >
        <SquareLibrary color="cyan" size={28} />
        <span className="text-2xl font-bold">{siteConfig.name}</span>
      </button>
      {items?.length ? (
        <nav className="flex gap-6">
          {items?.map((item) => (
            <Link
              key={item.href}
              href={item.disabled ? '#' : item.href}
              className={cn(
                'flex items-center text-lg font-medium transition-colors hover:text-foreground/80',
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
    </div>
  );
}
