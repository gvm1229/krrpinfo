'use client';

import { Menu, SquareLibrary } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import * as React from 'react';

import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { navContents } from '@/config/navBar';
import { siteConfig } from '@/config/site';
import { cn } from '@/src/util/utils';
import type { LinkProps } from 'next/link';

export function MobileNav() {
  const [open, setOpen] = React.useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 tablet:hidden"
        >
          <Menu size={28} />
          <span className="sr-only">Toggle Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="pl-4 pr-0">
        <MobileLink
          href="/"
          className="flex items-center"
          onOpenChange={setOpen}
        >
          <SquareLibrary color="cyan" className="mr-2 size-6" />
          <span className="text-lg font-bold">{siteConfig.name}</span>
        </MobileLink>
        <ScrollArea className="my-4 h-[calc(100vh-8rem)] pb-10 pl-8">
          <div className="flex flex-col space-y-2 pt-2">
            {navContents.map((item, index) => (
              <div key={index} className="flex flex-col space-y-3">
                {item.href && (
                  <MobileLink
                    key={item.href}
                    href={item.href}
                    onOpenChange={setOpen}
                    className={`font-medium ${item?.items?.length ? 'pb-0' : 'pb-2'}`}
                  >
                    {item.title}
                  </MobileLink>
                )}
                {item?.items?.length
                  && item.items.map((item) => (
                    <React.Fragment key={item.href}>
                      {!item.disabled
                        && (item.href ? (
                          <MobileLink
                            href={item.href}
                            onOpenChange={setOpen}
                            className="text-muted-foreground"
                          >
                            {item.title}
                            {item.label && (
                              <span className="ml-2 rounded-md bg-teal-400 px-1.5 py-0.5 text-xs leading-none text-black no-underline group-hover:no-underline">
                                {item.label}
                              </span>
                            )}
                          </MobileLink>
                        ) : (
                          item.title
                        ))}
                    </React.Fragment>
                  ))}
              </div>
            ))}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}

interface MobileLinkProps extends LinkProps {
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
  className?: string;
}

function MobileLink({
  href,
  onOpenChange,
  className,
  children,
  ...props
}: MobileLinkProps) {
  const router = useRouter();
  return (
    <Link
      href={href}
      onClick={() => {
        router.push(href.toString());
        onOpenChange?.(false);
      }}
      className={cn(className)}
      {...props}
    >
      {children}
    </Link>
  );
}
