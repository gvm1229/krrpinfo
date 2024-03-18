import Image from 'next/image';
import * as React from 'react';
import { calcStdImageWidth, cn } from '@/src/util/utils';

interface StaticImageProps {
  src: string;
  alt?: string;
  width?: number;
  height?: number;
  targetHeight?: number;
  quality?: number;
  aspectRatio?: string;
  isPriority?: boolean;
  wrapperClassName?: string;
  imageClassName?: string;
}

const StaticImage = ({
  src,
  alt = 'static-image-sample',
  width,
  height,
  targetHeight = 1080,
  quality,
  aspectRatio = 'aspect-auto',
  isPriority = false,
  wrapperClassName,
  imageClassName,
}: StaticImageProps) => (
  <div
    className={cn(
      `relative overflow-hidden ${aspectRatio}`,
      wrapperClassName,
    )}
  >
    <Image
      src={src}
      alt={alt}
      quality={quality ?? 75}
      width={calcStdImageWidth(width, height)} // 다른 dimension 입력하면 1080 height 기준으로 맞춤
      height={targetHeight}
      priority={isPriority}
      placeholder="blur"
      className={cn('relative', imageClassName)}
    />
  </div>
);

export default StaticImage;
