import React from 'react';
import { cn } from '@/src/util/utils';

const Tag = ({
  tagInput,
  className,
}) => (
  <ul className={cn('flex gap-2', className)}>
    {tagInput.map((tag) => (
      <li
        key={tag}
        className="w-fit rounded-lg bg-blue-500 px-2 py-1.5 text-sm font-semibold text-white hover:bg-blue-400 dark:bg-blue-600"
      >
        {tag}
      </li>
    ))}
  </ul>
);

export default Tag;
