import React from 'react';
import TruncateText from '@/components/Text/TruncateText';
import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/src/util/utils';

type BreadcrumbItemObject = {
  url: string;
  label: string;
};

type BreadcrumbItemArray = {
  url: string;
  label: string;
}[];

type BreadcrumbItemType = BreadcrumbItemObject | BreadcrumbItemArray;

interface BreadcrumbContainerProps {
  // itemsInput may contain an object or an array of said objects
  itemsInput: BreadcrumbItemType[];
  className?: string;
}

const BreadcrumbContainer = ({
  itemsInput,
  className,
}: BreadcrumbContainerProps) => {
  const items = [{ url: '/', label: '홈' }, ...itemsInput];

  return (
    <div className={cn('relative', className)}>
      <Breadcrumb>
        <BreadcrumbList>
          {items.map((item, index) => {
            if (Array.isArray(item))
            // if item is BreadcrumbItemArray
              return (
                <>
                  <BreadcrumbItem>
                    <DropdownMenu>
                      <DropdownMenuTrigger className="flex items-center gap-1">
                        <BreadcrumbEllipsis className="size-4" />
                        <span className="sr-only">Toggle menu</span>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="start">
                        {item.map((item: {
                          url: string;
                          label: string;
                        }) => (
                          <DropdownMenuItem key={item.label}>
                            <BreadcrumbLink
                              href={item.url}
                              className="text-base text-primary tablet:text-lg"
                            >
                              <TruncateText
                                text={item.label}
                              />
                            </BreadcrumbLink>
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </BreadcrumbItem>
                  {index < items.length - 1 && <BreadcrumbSeparator />}
                </>
              );

            return (
              <React.Fragment key={item.label}>
                <BreadcrumbItem>
                  <BreadcrumbLink
                    href={item.url}
                    className="text-base text-primary tablet:text-lg"
                  >
                    <TruncateText
                      text={item.label}
                    />
                  </BreadcrumbLink>
                </BreadcrumbItem>
                {index < items.length - 1 && <BreadcrumbSeparator />}
              </React.Fragment>
            );
          })}
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
};

export default BreadcrumbContainer;
