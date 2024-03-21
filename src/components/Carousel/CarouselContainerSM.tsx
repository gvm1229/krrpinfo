'use client';

import Autoplay from 'embla-carousel-autoplay';
import * as React from 'react';

import { SimpleLinkCardSM } from '@/components/Card/SimpleLinkCard';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { cn } from '@/src/util/utils';

interface CarouselContainerProps {
  className?: string;
  linksInput: {
    thumbnail: string;
    tags: string[];
    title: string;
    hyperlink: string;
  }[];
}

export default function CarouselContainerSM({
  className,
  linksInput,
}: CarouselContainerProps) {
  const plugin = React.useRef(
    Autoplay({ delay: 2000, stopOnInteraction: true }),
  );

  return (
    <Carousel
      orientation="vertical"
      className={cn('relative size-full py-12', className)}
      plugins={[plugin.current]}
      // onMouseEnter={plugin.current.stop}
      // onMouseLeave={plugin.current.reset}
      opts={{
        align: 'start',
        loop: true,
      }}
    >
      <CarouselContent className="h-108">
        {linksInput.map((link) => (
          <CarouselItem key={link.title} className="basis-1/5">
            <div className="p-1">
              <SimpleLinkCardSM
                key={link.title}
                thumbnail={link.thumbnail}
                tags={link.tags}
                title={link.title}
                hyperlink={link.hyperlink}
              />
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="top-0" />
      <CarouselNext className="bottom-0" />
    </Carousel>
  );
}
