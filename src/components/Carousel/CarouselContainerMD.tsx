'use client';

import Autoplay from 'embla-carousel-autoplay';
import * as React from 'react';

import { SimpleLinkCardMD } from '@/components/Card/SimpleLinkCard';
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

export default function CarouselContainerMD({
  className,
  linksInput,
}: CarouselContainerProps) {
  const plugin = React.useRef(
    Autoplay({ delay: 2000, stopOnInteraction: true }),
  );

  return (
    <Carousel
      className={cn('relative size-full px-12', className)}
      plugins={[plugin.current]}
      // onMouseEnter={plugin.current.stop}
      // onMouseLeave={plugin.current.reset}
      opts={{
        align: 'start',
        loop: true,
      }}
    >
      <CarouselContent className="gap-1">
        {linksInput.map((link) => (
          <CarouselItem
            key={link.title}
            className="tablet:basis-1/3 desktop:basis-1/5"
          >
            <div className="p-1">
              <SimpleLinkCardMD
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
      <CarouselPrevious className="left-0" />
      <CarouselNext className="right-0" />
    </Carousel>
  );
}
