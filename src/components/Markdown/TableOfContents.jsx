'use client';

import * as React from 'react';

import { useMounted } from '@/src/hooks/use-mounted';
import { cn } from '@/src/util/utils';

export function DashboardTableOfContents({ toc }) {
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
  // eslint-disable-next-line no-use-before-define
  const activeHeading = useActiveItem(itemIds);
  const mounted = useMounted();

  if (!toc?.items)
    return null;

  return mounted ? (
    <div className="space-y-2">
      <p className="text-2xl font-semibold">목차</p>
      <Tree tree={toc} activeItem={activeHeading} />
    </div>
  ) : null;
}

function useActiveItem(itemIds) {
  const [activeId, setActiveId] = React.useState('');

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting)
            setActiveId(entry.target.id);
        });
      },
      { rootMargin: '0% 0% -80% 0%' },
    );

    itemIds?.forEach((id) => {
      if (!id)
        return;

      const element = document.getElementById(id);
      if (element)
        observer.observe(element);
    });

    return () => {
      itemIds?.forEach((id) => {
        if (!id)
          return;

        const element = document.getElementById(id);
        if (element)
          observer.unobserve(element);
      });
    };
  }, [itemIds]);

  return activeId;
}

function Tree({ tree, level = 1, activeItem }) {
  return tree?.items?.length && level < 3 ? (
    <ul className={cn('m-0 list-none', { 'pl-4': level !== 1 })}>
      {tree.items.map((item) => (
        <li key={item.url} className={cn('mt-0 pt-2')}>
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
          {item.items?.length ? (
            <Tree tree={item} level={level + 1} activeItem={activeItem} />
          ) : null}
        </li>
      ))}
    </ul>
  ) : null;
}
