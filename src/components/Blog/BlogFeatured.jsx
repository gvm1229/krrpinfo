import Link from 'next/link';
import ButtonNewTab from '@/src/components/Button/ButtonNewTab';
import ResponsiveImage from '@/src/components/Image/ResponsiveImage';

const BlogFeatured = ({
  maxHeight = 'mobile:max-h-80 tablet:max-h-96 desktop:max-h-108',
  thumbnail = 'https://dummyimage.com/1280x720',
  category = 'Sample Category',
  title = 'Sample Title',
  toNavigate,
  hyperlink,
}) => {
  const children = (
    <>
      <div className="relative">
        <div className="absolute inset-0 z-10 bg-black opacity-0 transition group-hover:opacity-30 dark:bg-white" />
        <ResponsiveImage
          src={thumbnail}
          alt="blog-featured-thumbnail"
          aspectRatio="aspect-video"
          wrapperClassName={maxHeight}
        />
      </div>
      <div className="p-6 text-left tablet:px-8 desktop:px-8">
        <h2 className="w-fit text-sm font-semibold text-blue-600">{category}</h2>
        <h1 className="mt-2 text-2xl font-bold text-primary">{title}</h1>
      </div>
    </>
  );

  const mutualClassName = 'relative overflow-hidden flex flex-col rounded-lg shadow-lg group transition focus:outline-none hover:bg-secondary dark:shadow-slate-600';

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
