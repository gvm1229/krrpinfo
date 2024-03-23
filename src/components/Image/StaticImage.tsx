import Image from 'next/image';
import { cn, calcStdImageWidth, dynamicViewport } from '@/src/util/utils';

interface StaticImageProps {
  src: string;
  alt?: string;
  width: number;
  height: number;
  targetHeight?: number;
  quality?: number;
  aspectRatio?: string;
  gridNums?: number[];
  isPriority?: boolean;
  wrapperClassName?: string;
  imageClassName?: string;
}

const StaticImage = ({
  src,
  alt = 'static-image-sample',
  width = 1546, // 기본 iPad 11 비율
  height = 1080, // 기본 iPad 11 비율
  targetHeight = 1080,
  quality,
  aspectRatio = 'aspect-auto',
  gridNums = [1, 2, 2],
  isPriority = false,
  wrapperClassName,
  imageClassName,
}: StaticImageProps) => (
  <div
    className={cn(`relative overflow-hidden ${aspectRatio}`, wrapperClassName)}
  >
    <Image
      src={src}
      alt={alt}
      quality={quality ?? 75}
      width={calcStdImageWidth(width, height)} // 다른 dimension 입력하면 1080 height 기준으로 맞춤
      height={targetHeight}
      sizes={dynamicViewport(gridNums)}
      priority={isPriority}
      className={cn('relative', imageClassName)}
    />
  </div>
);

export default StaticImage;
