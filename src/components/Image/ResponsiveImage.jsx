import Image from 'next/image';
import { cn } from '@/src/util/utils';

const ResponsiveImage = ({
  src,
  alt,
  quality,
  aspectRatio = 'aspect-auto',
  isPriority = true,
  objectFit = 'object-cover',
  wrapperClassName,
  imageClassName,
}) => (
  <div className={cn(`relative ${aspectRatio}`, wrapperClassName)}>
    <Image
      src={src}
      alt={alt}
      quality={quality ?? 100}
      width={0}
      height={0}
      style={{ width: '100%', height: 'auto' }}
      sizes="100vw"
      priority={isPriority}
      className={cn(`relative ${objectFit}`, imageClassName)}
    />
  </div>
);

export default ResponsiveImage;
