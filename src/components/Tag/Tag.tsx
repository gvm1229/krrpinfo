'use client';

import { Ellipsis, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import TooltipWrapper from '@/components/Tooltip/TooltipWrapper';
import { cn } from '@/src/util/utils';

interface TagProps {
  tagInput: string[];
  isHoverEnabled?: boolean;
  isExtraSmall?: boolean;
  className?: string;
  innerClassName?: string;
  isEllipsisEnabled?: boolean;
}

const Tag = ({
  tagInput,
  isHoverEnabled = true,
  isExtraSmall = false,
  className,
  innerClassName,
  isEllipsisEnabled = false,
}: TagProps) => {
  const [showEllipsis, setShowEllipsis] = useState(false);
  const [isTagsOpen, setIsTagsOpen] = useState(false);
  const ulRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const checkWidth = () => {
      const ul = ulRef.current;
      if (ul) {
        // Change here: Use clientWidth for checking against max width
        const hasExceededMaxWidth = ul.scrollWidth > ul.clientWidth;
        setShowEllipsis(hasExceededMaxWidth);
      }
    };

    checkWidth();

    // Optional: Re-check on window resize if the layout is responsive
    window.addEventListener('resize', checkWidth);
    return () => window.removeEventListener('resize', checkWidth);
  }, [tagInput]); // Rerun when tagInput changes, you might want to adjust this dependency array based on your needs

  return (
    <div className={cn('relative flex items-center', className)}>
      <ul
        ref={ulRef}
        className={`flex w-full gap-2 ${isEllipsisEnabled && 'max-w-[90%]'} ${isEllipsisEnabled && isTagsOpen ? 'flex-wrap' : 'overflow-x-hidden'}`}
      >
        {Object.values(tagInput).map((tag) => (
          <li
            key={tag}
            className={cn(
              'min-w-fit shrink-0 rounded-lg bg-blue-600 font-medium text-white',
              `${isExtraSmall ? 'px-1.5 py-1 text-[0.6rem]' : 'px-2 py-1.5 text-sm'}`,
              `${isHoverEnabled && 'hover:bg-blue-500 hover:underline'}`,
              innerClassName,
            )}
          >
            {tag}
          </li>
        ))}
      </ul>
      {isEllipsisEnabled && showEllipsis && (
        <TooltipWrapper
          text={isTagsOpen ? '태그 최소화하기' : '태그 더 보기'}
          triggerClassName="flex size-full max-w-[10%] items-center justify-end"
        >
          <button
            onClick={() => setIsTagsOpen(!isTagsOpen)}
            className="aspect-square rounded-full bg-muted p-1"
          >
            {isTagsOpen ? <X /> : <Ellipsis />}
          </button>
        </TooltipWrapper>
      )}
    </div>
  );
};

export default Tag;
