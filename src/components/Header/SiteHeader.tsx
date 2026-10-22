'use client';
import Link from 'next/link';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
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
  const pathname = usePathname();
  // 내부 메뉴의 현재 위치 확인
  const current = (href: string) =>
    href === pathname || (href.startsWith('/') && href !== '/' && pathname.startsWith(href + '/'));
  const t = useCopy();
  const roots = navigation.filter((entry) => !text(entry, 'parent'));
  const links = (
    <>
      {roots.map((entry) => (
        <div key={entry.id} className="group relative">
          <Link
            href={text(entry, 'href')}
            aria-current={current(text(entry, 'href')) ? 'page' : undefined}
            className={cn(
              'block whitespace-nowrap py-2 text-base font-medium hover:text-brand-blue',
              current(text(entry, 'href')) &&
                'font-bold text-brand-blue underline underline-offset-8',
            )}
            onClick={() => setOpen(false)}
          >
            {entry.title}
          </Link>
          {navigation.some((child) => text(child, 'parent') === entry.slug) && (
            <div className="space-y-1 rounded bg-background p-3 laptop:absolute laptop:hidden laptop:min-w-48 laptop:border laptop:group-hover:block laptop:group-focus-within:block">
              {navigation
                .filter((child) => text(child, 'parent') === entry.slug)
                .map((child) => (
                  <Link
                    key={child.id}
                    href={text(child, 'href')}
                    aria-current={current(text(child, 'href')) ? 'page' : undefined}
                    className={cn(
                      'block whitespace-nowrap py-2 hover:text-brand-blue',
                      current(text(child, 'href')) && 'font-bold text-brand-blue',
                    )}
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
          <Link href="/" aria-label={settings.name} className="flex shrink-0 items-center gap-3">
            {settings.logo && (
              <img src={settings.logo} width={40} height={40} alt="" className="rounded-lg" />
            )}
            <span className="hidden text-xl font-bold tablet:block">{settings.name}</span>
          </Link>
          <nav className="hidden flex-1 gap-5 laptop:flex">{links}</nav>
          <div className="ml-auto flex items-center gap-2">
            <CommandMenu userAgent={userAgent} posts={posts} />
            <ModeToggle />
            <Button
              type="button"
              size="icon"
              className="shrink-0 rounded-md bg-brand-blue text-white hover:bg-brand-blue-hover laptop:hidden"
              aria-label={open ? t('common.close') : t('navigation.menu')}
              aria-expanded={open}
              aria-controls="site-mobile-navigation"
              onClick={() => setOpen(!open)}
            >
              {open ? <X size={22} /> : <Menu size={22} />}
            </Button>
          </div>
        </div>
        {open && (
          <nav
            id="site-mobile-navigation"
            className="max-h-[calc(100svh-5rem)] space-y-2 overflow-y-auto border-t py-5 laptop:hidden"
          >
            {links}
          </nav>
        )}
      </header>
      <div className="h-20" />
    </>
  );
};
