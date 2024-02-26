import Link from 'next/link';
import ButtonNewTab from '@/src/components/Button/ButtonNewTab';
import ResponsiveImage from '@/src/components/Image/ResponsiveImage';
import { formatDate } from '@/src/util/utils';

const BlogFeatured = ({
  maxHeight = 'mobile:max-h-80 tablet:max-h-96 desktop:max-h-108',
  thumbnail = 'https://dummyimage.com/1280x720',
  date,
  title = 'Sample Title',
  description,
  tags = ['Sample Tag'],
  toNavigate,
  hyperlink,
  isImagePriority = true,
}) => {
  const children = (
    <>
      <div className="relative">
        <div className="absolute inset-0 z-10 bg-black opacity-0 transition group-hover:opacity-30 dark:bg-white" />
        <ResponsiveImage
          src={thumbnail}
          alt="blog-featured-thumbnail"
          imageClassName={maxHeight}
          isPriority={isImagePriority}
          objectFit="object-cover"
        />
      </div>
      <div className="group space-y-1 p-6 text-left tablet:px-8">
        <h2
          className="text-base font-medium text-neutral-600 dark:text-neutral-200"
        >
          {formatDate(date ?? new Date())}
        </h2>
        <h1 className="truncate text-3xl font-bold text-primary">{title}</h1>
        {description && (
          <p className="truncate text-lg font-medium text-neutral-600 dark:text-neutral-200">{description}</p>
        )}
        <ul className={`flex gap-2 ${description ? 'pt-2' : 'pt-4'}`}>
          {tags.map((tag) => (
            <h2
              key={tag}
              className="w-fit rounded-lg bg-blue-500 px-2 py-1.5 text-sm font-semibold text-white dark:bg-blue-600"
            >
              {tag}
            </h2>
          ))}
        </ul>
      </div>
    </>
  );

  const mutualClassName = 'relative overflow-hidden flex flex-col rounded-lg shadow-lg group transition focus:outline-none hover:bg-secondary dark:shadow-slate-600';

  if (toNavigate)
    return (
      <Link
        href={toNavigate}
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
