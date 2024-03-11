import Image from 'next/image';
import { cn } from '@/src/util/utils';

const ResponsiveImage = ({
  src,
  alt = 'responsive-image-sample',
  quality,
  aspectRatio = 'aspect-auto',
  gridNums = [1, 1, 1],
  isPriority = false,
  objectFit = 'object-cover',
  wrapperClassName,
  imageClassName,
}) => {
  const dynamicViewport = () => {
    // if (mobile=1, tablet=2, desktop=3) return '(max-width: 720px) 100vw, (max-width: 1240px) 50vw, 33vw';
    // if (mobile=1, tablet=2, desktop=2) return '(max-width: 720px) 100vw, (max-width: 1240px) 50vw, 50vw';
    // if (mobile=1, tablet=1, desktop=1) return '100vw';

    const baseViewport = 90;
    const calcViewWidth = (viewport) => Math.round(baseViewport / viewport);

    return [
      `(max-width: 720px) ${calcViewWidth(gridNums[0])}vw`,
      `(max-width: 1240px) ${calcViewWidth(gridNums[1])}vw`,
      `${calcViewWidth(gridNums[2])}vw`,
    ].join(', ');
  };

  return (
    <div className={cn(`relative overflow-hidden ${aspectRatio}`, wrapperClassName)}>
      <Image
        src={src}
        alt={alt}
        quality={quality ?? 75}
        width={0}
        height={0}
        style={{ width: '100%', height: 'auto' }}
        sizes={dynamicViewport()}
        priority={isPriority}
        className={cn(`relative ${objectFit}`, imageClassName)}
      />
    </div>
  );
};

export default ResponsiveImage;
