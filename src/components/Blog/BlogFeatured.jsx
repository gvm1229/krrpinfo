import Image from 'next/image';
import Link from 'next/link';
import ButtonNewTab from '@/src/components/Button/ButtonNewTab';

const BlogFeatured = ({
  width = 'w-full',
  height = 'mobile:h-80 tablet:h-96 desktop:h-108',
  thumbnail = 'https://dummyimage.com/1280x720',
  imgStyle = 'object-cover',
  category = 'Sample Category',
  title = 'Sample Title',
  transitionAtHover = 'scale',
  toNavigate,
  hyperlink,
}) => {
  const children = (
    <>
      <div className="relative">
        {transitionAtHover === 'bgChange' && (
          <div className="absolute inset-0 bg-black opacity-0 transition group-hover:opacity-30" />
        )}
        <Image
          src={thumbnail}
          className={`${width} ${height} ${imgStyle}`}
          alt="blog-featured-thumbnail"
        />
      </div>
      <div className="px-8 py-6 text-left">
        <h2 className="w-fit text-sm font-semibold text-blue-600">{category}</h2>
        <h1 className="mt-2 text-2xl font-bold text-neutral-900">{title}</h1>
      </div>
    </>
  );

  const mutualClassName = `relative overflow-hidden flex flex-col rounded-lg shadow-lg focus:outline-none ${transitionAtHover === 'scale' && 'transition hover:scale-103'} ${transitionAtHover === 'bgChange' && 'group transition hover:bg-neutral-200'}`;

  if (toNavigate)
    return (
      <Link
        href={`/${toNavigate}`}
        className={mutualClassName}
      >
        {children}
      </Link>
    );

  if (hyperlink)
    return (
      <ButtonNewTab
        href={hyperlink}
        className={mutualClassName}
      >
        {children}
      </ButtonNewTab>
    );

  return (
    <div className={mutualClassName}>
      {children}
    </div>
  );
};

export default BlogFeatured;
