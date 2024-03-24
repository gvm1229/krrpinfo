import Image from 'next/image';
import { cn, dynamicViewport } from '@/src/util/utils';

interface ResponsiveImageProps {
  src: string;
  alt?: string;
  quality?: number;
  aspectRatio?: string;
  gridNums?: number[];
  isPriority?: boolean;
  objectFit?: string;
  wrapperClassName?: string;
  imageClassName?: string;
}

const ResponsiveImage = ({
  src,
  alt = 'responsive-image-sample',
  quality,
  aspectRatio = 'aspect-auto',
  gridNums = [1, 2, 2],
  isPriority = false,
  objectFit = 'object-cover',
  wrapperClassName,
  imageClassName,
}: ResponsiveImageProps) => (
  <div className={cn(`relative overflow-hidden ${aspectRatio}`, wrapperClassName)}>
    <Image
      src={src}
      alt={alt}
      quality={quality ?? 75}
      width={0}
      height={0}
      style={{ width: '100%', height: 'auto' }}
      sizes={dynamicViewport(gridNums)}
      priority={isPriority}
      className={cn(`relative ${objectFit}`, imageClassName)}
    />
  </div>
);

export default ResponsiveImage;
