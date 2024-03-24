import React from 'react';
import { cn } from '@/src/util/utils';

interface TagProps {
  tagInput: string[];
  isHoverEnabled?: boolean;
  isExtraSmall?: boolean;
  className?: string;
  innerClassName?: string;
}

const Tag = ({
  tagInput,
  isHoverEnabled = true,
  isExtraSmall = false,
  className,
  innerClassName,
}: TagProps) => (
  <ul className={cn('flex gap-2', className)}>
    {tagInput.map((tag) => (
      <li
        key={tag}
        className={cn(
          'w-fit rounded-lg bg-blue-600 font-medium text-white',
          `${isExtraSmall ? 'px-1.5 py-1 text-[0.6rem]' : 'px-2 py-1.5 text-sm'}`,
          `${isHoverEnabled && 'hover:bg-blue-500 hover:underline'}`,
          innerClassName,
        )}
      >
        {tag}
      </li>
    ))}
  </ul>
);

export default Tag;
