'use client';

import { compareDesc } from 'date-fns';
import { Circle, File, Newspaper } from 'lucide-react';
import { useRouter } from 'next/navigation';
import * as React from 'react';

import { Button } from '@/components/ui/button';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { navContents } from '@/config/navBar';
import { cn } from '@/src/util/utils';
import { allPosts } from 'contentlayer/generated';

interface CommandMenuProps {
  userAgent: string;
}

export function CommandMenu({ userAgent }: CommandMenuProps) {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);

  const posts = allPosts
    .filter((post) => post.published)
    .sort((a, b) => compareDesc(new Date(a.date), new Date(b.date)));

  const isAppleDevice = () => {
    const appleDevices = ['Mac', 'iPhone', 'iPod', 'iPad'];
    // determines if the userAgent string includes at least one of the Apple devices
    return appleDevices.some((device: string) => userAgent.includes(device));
  };

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if ((e.key === 'k' && (e.metaKey || e.ctrlKey)) || e.key === '/') {
        if (
          (e.target instanceof HTMLElement && e.target.isContentEditable)
          || e.target instanceof HTMLInputElement
          || e.target instanceof HTMLTextAreaElement
          || e.target instanceof HTMLSelectElement
        )
          return;

        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  const runCommand = React.useCallback((command: () => unknown) => {
    setOpen(false);
    command();
  }, []);

  return (
    <>
      <Button
        variant="outline"
        className={cn(
          'relative h-10 w-full shrink-0 justify-start rounded-[0.5rem] bg-background pr-12 text-sm font-medium text-muted-foreground shadow-none tablet:w-56 laptop:w-64',
        )}
        onClick={() => setOpen(true)}
      >
        <span className="inline-flex">검색...</span>
        <kbd className="pointer-events-none absolute right-[0.6rem] hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-xs font-medium opacity-100 tablet:flex">
          {isAppleDevice() ? (
            <span suppressHydrationWarning className="text-sm">
              ⌘
            </span>
          ) : (
            <span suppressHydrationWarning className="text-xs">
              {'Ctrl + '}
            </span>
          )}
          K
        </kbd>
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="검색..." />
        <CommandList>
          <CommandEmpty>검색 결과가 없습니다.</CommandEmpty>
          <CommandGroup heading="헤더 링크">
            {navContents
              .filter((navItem) => !navItem.items)
              .map((navItem) => (
                <CommandItem
                  key={navItem.href}
                  value={navItem.title}
                  onSelect={() => {
                    runCommand(() => router.push(navItem.href as string));
                  }}
                >
                  <File className="mr-2 size-4" />
                  {navItem.title}
                </CommandItem>
              ))}
          </CommandGroup>
          {navContents
            .filter((navItem) => navItem.items)
            .map((navItem) => (
              <div key={navItem.title}>
                {navItem?.items?.length && (
                  <CommandGroup heading={navItem.title}>
                    {navItem.items.map((navItem) => (
                      <CommandItem
                        key={navItem.href}
                        value={navItem.title}
                        onSelect={() => {
                          runCommand(() => router.push(navItem.href as string));
                        }}
                      >
                        <div className="mr-2 flex size-4 items-center justify-center">
                          <Circle className="size-3" />
                        </div>
                        {navItem.title}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                )}
              </div>
            ))}
          <CommandGroup heading="포스트">
            {posts.map((post) => (
              <CommandItem
                key={post.slugAsParams}
                value={post.title}
                onSelect={() => {
                  runCommand(() => router.push(post.slug as string));
                }}
              >
                <Newspaper className="mr-2 size-4" />
                {post.title}
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}
