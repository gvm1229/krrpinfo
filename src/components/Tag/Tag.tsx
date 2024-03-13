import React from 'react';
import { cn } from '@/src/util/utils';

interface TagProps {
  tagInput: string[];
  className?: string;
  innerClassName?: string;
}

const Tag = ({ tagInput, className, innerClassName }: TagProps) => (
  <ul className={cn('flex gap-2', className)}>
    {tagInput.map((tag) => (
      <li
        key={tag}
        className={cn(
          `w-fit rounded-lg bg-blue-500 px-2 py-1.5 text-sm font-medium text-white dark:bg-blue-600 ${innerClassName}`,
          'hover:bg-blue-400 hover:underline dark:hover:bg-blue-500',
        )}
      >
        {tag}
      </li>
    ))}
  </ul>
);

export default Tag;
