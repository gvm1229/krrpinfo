import Image from 'next/image';

const ResponsiveImage = ({
  src,
  alt,
  quality,
  aspectRatio = 'aspect-auto',
  isPriority = true,
  objectFit = 'object-cover',
}) => (
  <div className={`relative ${aspectRatio}`}>
    <Image
      src={src}
      alt={alt}
      quality={quality ?? 100}
      width={0}
      height={0}
      style={{ width: '100%', height: 'auto' }}
      sizes="100vw"
      priority={isPriority}
      className={`relative ${objectFit}`}
    />
  </div>
);

export default ResponsiveImage;
