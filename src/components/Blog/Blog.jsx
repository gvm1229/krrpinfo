import { Link as LinkIcon } from 'lucide-react';
import Link from 'next/link';
import ButtonNewTab from '@/src/components/Button/ButtonNewTab';
import ResponsiveImage from '@/src/components/Image/ResponsiveImage';
import { formatDate } from '@/src/util/utils';

const Blog = ({
  width,
  thumbnail = 'https://dummyimage.com/1280x720',
  tags = ['Sample Tag'],
  date,
  title = 'Sample Title',
  description,
  toNavigate,
  hyperlink,
  gridNums = [1, 2, 3],
  isImagePriority = false,
}) => {
  const children = (
    <>
      <div className={`relative aspect-video rounded-md ${width}`}>
        <div
          className="absolute inset-0 z-10 rounded-md bg-black opacity-0 transition group-hover:opacity-20 dark:bg-white"
        />
        {hyperlink && (
          <div className="absolute z-20 rounded-br-md rounded-tl-md bg-white/70 p-2">
            <LinkIcon
              className="size-8 text-blue-600"
            />
          </div>
        )}
        <ResponsiveImage
          src={thumbnail}
          alt="blog-thumbnail"
          wrapperClassName="rounded-md shadow-md dark:shadow-slate-600"
          gridNums={gridNums}
          isPriority={isImagePriority}
        />
      </div>
      <div className="group mt-4 space-y-1 text-left">
        <h2 className="text-sm font-medium text-neutral-600 dark:text-neutral-200">{formatDate(date ?? new Date())}</h2>
        <h1 className="truncate text-2xl font-bold text-primary">{title}</h1>
        {description && (
          <p className="truncate font-medium text-neutral-600 dark:text-neutral-200">{description}</p>
        )}
        <ul className="flex gap-2 pt-2">
          {tags.map((tag) => (
            <h2
              key={tag}
              className="w-fit rounded-lg bg-blue-500 px-2 py-1.5 text-xs font-semibold text-white dark:bg-blue-600"
            >
              {tag}
            </h2>
          ))}
        </ul>
      </div>
    </>
  );

  const mutualClassName = 'p-4 relative flex flex-col rounded-lg focus:outline-none group transition hover:bg-secondary';

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

export default Blog;
