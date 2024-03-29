/* eslint-disable react/no-array-index-key */

'use client';

import * as React from 'react';

import { useMounted } from '@/src/hooks/use-mounted';
import type { TableOfContents } from '@/src/util/toc';
import { cn } from '@/src/util/utils';

interface TocProps {
  toc: TableOfContents;
}

export function DashboardTableOfContents({ toc }: TocProps) {
  const itemIds = React.useMemo(
    () => (toc.items
      ? toc.items
        .flatMap((item) => [item.url, item?.items?.map((item) => item.url)])
        .flat()
        .filter(Boolean)
        .map((id) => id?.split('#')[1])
      : []),
    [toc],
  );
  const activeHeading = useActiveItem(itemIds);
  const mounted = useMounted();

  if (!toc?.items) return null;

  return mounted ? (
    <div className="space-y-2">
      <p className="text-xl font-semibold tablet:text-2xl">목차</p>
      <Tree tree={toc} activeItem={activeHeading} />
    </div>
  ) : null;
}

function useActiveItem(itemIds: (string | undefined)[]) {
  const [activeId, setActiveId] = React.useState<string>('');

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveId(entry.target.id);
        });
      },
      { rootMargin: '0% 0% -80% 0%' },
    );

    itemIds?.forEach((id) => {
      if (!id) return;

      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    return () => {
      itemIds?.forEach((id) => {
        if (!id) return;

        const element = document.getElementById(id);
        if (element) observer.unobserve(element);
      });
    };
  }, [itemIds]);

  return activeId;
}

interface TreeProps {
  tree: TableOfContents;
  level?: number;
  activeItem?: string | null;
}

function Tree({ tree, level = 1, activeItem }: TreeProps) {
  return tree?.items?.length && level < 3 ? (
    <ul className={cn('m-0 list-none', { 'pl-4': level !== 1 })}>
      {tree.items.map((item, index) => (
        <li key={index} className={cn(`mt-0 ${item.title && 'pt-2'}`)}>
          <a
            href={item.url}
            className={cn(
              'inline-block text-lg hover:text-primary',
              item.url === `#${activeItem}`
                ? 'font-medium text-primary underline underline-offset-4'
                : 'text-muted-foreground',
            )}
          >
            {item.title}
          </a>
          {item.items?.length && item.items[0].url ? (
            <Tree tree={item} level={level + 1} activeItem={activeItem} />
          ) : null}
        </li>
      ))}
    </ul>
  ) : null;
}
