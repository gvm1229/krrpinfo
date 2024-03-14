import React from 'react';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { cn } from '@/src/util/utils';

interface BreadcrumbContainerProps {
  itemsInput: {
    url: string;
    label: string;
  }[];
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
          {items.map((item, index) => (
            <React.Fragment key={item.label}>
              <BreadcrumbItem>
                <BreadcrumbLink
                  href={item.url}
                  className="text-base tablet:text-lg"
                >
                  {item.label}
                </BreadcrumbLink>
              </BreadcrumbItem>
              {index < items.length - 1 && <BreadcrumbSeparator />}
            </React.Fragment>
          ))}
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
};

export default BreadcrumbContainer;
