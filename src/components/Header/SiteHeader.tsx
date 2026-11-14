'use client';
import Link from 'next/link';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ChevronDown, Gift, Menu, X } from 'lucide-react';
import { CommandMenu } from '@/components/Command/CommandMenu';
import { ModeToggle } from '@/components/DarkMode/theme-toggle';
import { usePublicSite, useCopy } from '@/components/Text/PublicSite';
import { publicPathEnabled, text } from '@/src/cms/schema';
import type { Entry } from '@/src/cms/schema';
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
  const childrenOf = (entry: Entry) =>
    navigation.filter((child) => text(child, 'parent') === entry.slug);
  // 하위 메뉴 중 현재 위치 포함 여부
  const branchCurrent = (entry: Entry) =>
    current(text(entry, 'href')) || childrenOf(entry).some((child) => current(text(child, 'href')));
  const linkClass = (active: boolean) =>
    cn(
      'block whitespace-nowrap py-2 text-base font-medium hover:text-brand-link',
      active && 'font-bold text-brand-link underline underline-offset-8',
    );
  const redeemEnabled = publicPathEnabled(settings, '/redeem');
  return (
    <>
      <header
        className={cn(
          'fixed z-40 w-full border-b bg-background px-4 tablet:px-6 laptop:px-8',
          className,
        )}
      >
        <div className="flex h-16 items-center gap-5">
          <Link href="/" aria-label={settings.name} className="flex shrink-0 items-center gap-3">
            {settings.logo && (
              <img src={settings.logo} width={36} height={36} alt="" className="rounded-lg" />
            )}
            <span className="hidden text-base font-bold tablet:block">{settings.name}</span>
          </Link>
          <nav className="hidden flex-1 items-center gap-5 md:flex">
            {roots.map((entry) => {
              const children = childrenOf(entry);
              if (!children.length)
                return (
                  <Link
                    key={entry.id}
                    href={text(entry, 'href')}
                    aria-current={current(text(entry, 'href')) ? 'page' : undefined}
                    className={linkClass(current(text(entry, 'href')))}
                  >
                    {entry.title}
                  </Link>
                );
              return (
                <div key={entry.id} className="flex items-center gap-0.5">
                  <Link
                    href={text(entry, 'href')}
                    aria-current={current(text(entry, 'href')) ? 'page' : undefined}
                    className={linkClass(branchCurrent(entry))}
                  >
                    {entry.title}
                  </Link>
                  <DropdownMenu modal={false}>
                    <DropdownMenuTrigger asChild>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="size-8 shrink-0"
                        aria-label={entry.title + ' ' + t('navigation.menu')}
                      >
                        <ChevronDown size={16} />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="min-w-48">
                      {children.map((child) => (
                        <DropdownMenuItem key={child.id} asChild>
                          <Link
                            href={text(child, 'href')}
                            aria-current={current(text(child, 'href')) ? 'page' : undefined}
                            className={cn(
                              'cursor-pointer whitespace-nowrap py-2 text-base',
                              current(text(child, 'href')) && 'font-bold text-brand-link',
                            )}
                          >
                            {child.title}
                          </Link>
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              );
            })}
          </nav>
          <div className="ml-auto flex items-center gap-2">
            {redeemEnabled && (
              <Button
                asChild
                className="shrink-0 whitespace-nowrap rounded-md bg-brand-blue px-3 font-semibold text-white hover:bg-brand-blue-hover md:hidden"
              >
                <Link
                  href="/redeem"
                  aria-label={t('redeem.title')}
                  aria-current={current('/redeem') ? 'page' : undefined}
                >
                  <Gift size={18} />
                  <span className="hidden tablet:inline">{t('redeem.title')}</span>
                </Link>
              </Button>
            )}
            <CommandMenu userAgent={userAgent} posts={posts} />
            <ModeToggle />
            <Button
              type="button"
              size="icon"
              className="shrink-0 rounded-md bg-control text-white hover:bg-control-hover md:hidden"
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
            className="max-h-[calc(100svh-4rem)] space-y-1 overflow-y-auto border-t py-4 md:hidden"
          >
            {roots.map((entry) => (
              <div key={entry.id}>
                <Link
                  href={text(entry, 'href')}
                  aria-current={current(text(entry, 'href')) ? 'page' : undefined}
                  className={linkClass(current(text(entry, 'href')))}
                  onClick={() => setOpen(false)}
                >
                  {entry.title}
                </Link>
                {childrenOf(entry).length > 0 && (
                  <div className="border-l pl-4">
                    {childrenOf(entry).map((child) => (
                      <Link
                        key={child.id}
                        href={text(child, 'href')}
                        aria-current={current(text(child, 'href')) ? 'page' : undefined}
                        className={linkClass(current(text(child, 'href')))}
                        onClick={() => setOpen(false)}
                      >
                        {child.title}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>
        )}
      </header>
      <div className="h-16" />
    </>
  );
};
