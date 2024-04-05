import React from 'react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/src/util/utils';

const TooltipWrapper = ({
  text,
  children,
  triggerClassName,
}: {
  text: string;
  children: React.ReactNode;
  triggerClassName?: string;
}) => (
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger className={cn(triggerClassName)}>
        {children}
      </TooltipTrigger>
      <TooltipContent>
        <p>{text}</p>
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
);

export default TooltipWrapper;
