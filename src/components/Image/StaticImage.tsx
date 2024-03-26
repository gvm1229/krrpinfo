import Image from 'next/image';
import { calcStdImageWidth, cn, dynamicViewport } from '@/src/util/utils';

interface StaticImageProps {
  src: string;
  width: number;
  height: number;
  targetHeight?: number;
  alt?: string;
  quality?: number;
  aspectRatio?: string;
  gridNums?: number[];
  isPriority?: boolean;
  objectFit?: string;
  wrapperClassName?: string;
  imageClassName?: string;
}

const StaticImage = ({
  src,
  width = 1546, // 기본 iPad 11 비율
  height = 1080, // 기본 iPad 11 비율
  targetHeight = 1080,
  alt = 'static-image-sample',
  quality,
  aspectRatio = 'aspect-auto',
  gridNums = [1, 2, 2],
  isPriority = false,
  objectFit = 'object-cover',
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
      width={calcStdImageWidth(width, height, targetHeight)} // 다른 dimension 입력하면 1080 height 기준으로 맞춤
      height={targetHeight}
      sizes={dynamicViewport(gridNums)}
      priority={isPriority}
      className={cn(`relative ${objectFit}`, imageClassName)}
    />
  </div>
);

export default StaticImage;
