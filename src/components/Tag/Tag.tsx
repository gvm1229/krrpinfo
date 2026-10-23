'use client';

import { Ellipsis, X } from 'lucide-react';
import { useEffect, useId, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/src/util/utils';

type TagProps = {
  tagInput: string[];
  isHoverEnabled?: boolean;
  isExtraSmall?: boolean;
  className?: string;
  innerClassName?: string;
  isEllipsisEnabled?: boolean;
};

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
  const listId = useId();

  useEffect(() => {
    const ul = ulRef.current;
    if (!ul || !isEllipsisEnabled || isTagsOpen) return;
    // 접힌 태그 영역의 크기 변경 확인
    const checkWidth = () => {
      setShowEllipsis(ul.scrollWidth > ul.clientWidth);
    };
    checkWidth();
    const observer = new ResizeObserver(checkWidth);
    observer.observe(ul);
    return () => observer.disconnect();
  }, [tagInput, isEllipsisEnabled, isTagsOpen]);

  return (
    <div className={cn('relative flex items-center', className)}>
      <ul
        id={listId}
        ref={ulRef}
        className={`flex min-w-0 flex-1 gap-2 ${isEllipsisEnabled && isTagsOpen ? 'flex-wrap' : 'overflow-x-hidden'}`}
      >
        {Object.values(tagInput).map((tag) => (
          <li
            key={tag}
            className={cn(
              'min-w-fit shrink-0 rounded-sm bg-muted font-medium text-foreground',
              `${isExtraSmall ? 'px-1.5 py-1 text-xs' : 'px-2 py-1.5 text-sm'}`,
              `${isHoverEnabled && 'hover:bg-accent'}`,
              innerClassName,
            )}
          >
            {tag}
          </li>
        ))}
      </ul>
      {isEllipsisEnabled && showEllipsis && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                size="icon"
                aria-label={isTagsOpen ? '태그 접기' : '태그 더 보기'}
                aria-expanded={isTagsOpen}
                aria-controls={listId}
                onClick={() => setIsTagsOpen(!isTagsOpen)}
                className="ml-2 bg-control text-white hover:bg-control-hover"
              >
                {isTagsOpen ? <X size={18} /> : <Ellipsis size={18} />}
              </Button>
            </TooltipTrigger>
            <TooltipContent>{isTagsOpen ? '태그 접기' : '태그 더 보기'}</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </div>
  );
};

export default Tag;
