'use client';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, FileText } from 'lucide-react';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { usePublicSite, useCopy } from '@/components/Text/PublicSite';
import { text } from '@/src/cms/schema';
import { Button } from '@/components/ui/button';
// CMS 메뉴와 공개 글 검색
export const CommandMenu = ({
  posts = [],
}: {
  userAgent: string;
  posts?: { title: string; slug: string; description: string | null; tags: string[] }[];
}) => {
  const { navigation } = usePublicSite();
  const t = useCopy();
  const [open, setOpen] = useState(false);
  const trigger = useRef<HTMLButtonElement>(null);
  const router = useRouter();
  useEffect(() => {
    const listener = (event: KeyboardEvent) => {
      const target = event.target;
      if (
        target instanceof HTMLElement &&
        (target.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName))
      )
        return;
      if ((event.key === 'k' && (event.ctrlKey || event.metaKey)) || event.key === '/') {
        event.preventDefault();
        setOpen((current) => !current);
      }
    };
    document.addEventListener('keydown', listener);
    return () => document.removeEventListener('keydown', listener);
  }, []);
  const select = (url: string) => {
    setOpen(false);
    router.push(url);
  };
  return (
    <>
      <Button
        ref={trigger}
        type="button"
        className="flex shrink-0 items-center gap-2 rounded-md bg-control px-3 py-2 text-sm text-white hover:bg-control-hover"
        onClick={() => setOpen(true)}
        aria-label={t('search.placeholder')}
      >
        <Search size={17} />
        <span className="hidden laptop:inline">{t('search.placeholder')}</span>
      </Button>
      <CommandDialog
        open={open}
        onOpenChange={setOpen}
        onCloseAutoFocus={(event) => {
          event.preventDefault();
          trigger.current?.focus();
        }}
      >
        <CommandInput aria-label={t('search.placeholder')} placeholder={t('search.placeholder')} />
        <CommandList>
          <CommandEmpty>{t('search.empty')}</CommandEmpty>
          <CommandGroup heading={t('search.navigation')}>
            {navigation.map((entry) => (
              <CommandItem
                key={entry.id}
                value={entry.title}
                onSelect={() => select(text(entry, 'href'))}
              >
                <FileText className="mr-2 size-4" />
                {entry.title}
              </CommandItem>
            ))}
          </CommandGroup>
          <CommandGroup heading={t('search.posts')}>
            {posts.map((post) => (
              <CommandItem
                key={post.slug}
                value={post.title}
                onSelect={() => select('/posts/' + post.slug)}
              >
                <FileText className="mr-2 size-4" />
                {post.title}
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
};
