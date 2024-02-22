import Link from 'next/link';
import ButtonNewTab from '@/src/components/Button/ButtonNewTab';
import ResponsiveImage from '@/src/components/Image/ResponsiveImage';

const BlogFeatured = ({
  width = 'w-full',
  height = 'mobile:h-80 tablet:h-96 desktop:h-108',
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
        <div className={`${width} ${height}`}>
          <ResponsiveImage
            src={thumbnail}
            alt="blog-featured-thumbnail"
          />
        </div>
      </div>
      <div className="px-8 py-6 text-left">
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
