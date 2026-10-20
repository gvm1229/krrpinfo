'use client';
import Link from 'next/link';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { CommandMenu } from '@/components/Command/CommandMenu';
import { ModeToggle } from '@/components/DarkMode/theme-toggle';
import { usePublicSite, useCopy } from '@/components/Text/PublicSite';
import { text } from '@/src/cms/schema';
import { cn } from '@/src/util/utils';
// CMS 메뉴를 데스크톱과 모바일에 함께 표시
export const SiteHeader = ({
  userAgent,
  posts = [],
  className,
}: {
  userAgent: string;
  posts?: { title: string; slug: string; description: string | null; tags: string[] }[];
  className?: string;
}) => {
  const { settings, navigation } = usePublicSite();
  const [open, setOpen] = useState(false);
  const t = useCopy();
  const roots = navigation.filter((entry) => !text(entry, 'parent'));
  const links = (
    <>
      {roots.map((entry) => (
        <div key={entry.id} className="group relative">
          <Link
            href={text(entry, 'href')}
            className="block whitespace-nowrap py-2 text-base font-medium hover:text-brand-blue"
            onClick={() => setOpen(false)}
          >
            {entry.title}
          </Link>
          {navigation.some((child) => text(child, 'parent') === entry.slug) && (
            <div className="space-y-1 rounded bg-background p-3 tablet:absolute tablet:hidden tablet:min-w-48 tablet:border tablet:group-hover:block tablet:group-focus-within:block">
              {navigation
                .filter((child) => text(child, 'parent') === entry.slug)
                .map((child) => (
                  <Link
                    key={child.id}
                    href={text(child, 'href')}
                    className="block whitespace-nowrap py-2 hover:text-brand-blue"
                    onClick={() => setOpen(false)}
                  >
                    {child.title}
                  </Link>
                ))}
            </div>
          )}
        </div>
      ))}
    </>
  );
  return (
    <>
      <header
        className={cn('fixed z-40 w-full border-b bg-background px-5 laptop:px-8', className)}
      >
        <div className="flex h-20 items-center gap-5">
          <Link href="/" className="flex shrink-0 items-center gap-3">
            {settings.logo && (
              <img src={settings.logo} width={40} height={40} alt="" className="rounded-lg" />
            )}
            <span className="hidden text-xl font-bold tablet:block">{settings.name}</span>
          </Link>
          <nav className="hidden flex-1 gap-5 tablet:flex">{links}</nav>
          <div className="ml-auto flex items-center gap-2">
            <CommandMenu userAgent={userAgent} posts={posts} />
            <ModeToggle />
            <button
              type="button"
              className="rounded-md bg-brand-blue p-2 text-white tablet:hidden"
              aria-label={open ? t('common.close') : t('navigation.menu')}
              onClick={() => setOpen(!open)}
            >
              {open ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
        {open && <nav className="space-y-2 border-t py-5 tablet:hidden">{links}</nav>}
      </header>
      <div className="h-20" />
    </>
  );
};
