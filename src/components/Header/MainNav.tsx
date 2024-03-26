'use client';

import Link from 'next/link';
import { useRouter, useSelectedLayoutSegment } from 'next/navigation';

import StaticImage from '@/components/Image/StaticImage';
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
        'hidden items-center gap-6 tablet:flex tablet:gap-8',
        className,
      )}
    >
      <button
        onClick={() => {
          router.push('/');
          router.refresh();
        }}
        className="flex items-center gap-x-4"
      >
        <StaticImage
          src="/krrpLogo-192x192.png"
          width={40}
          height={40}
          targetHeight={40}
          imageClassName="rounded-lg"
        />
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
