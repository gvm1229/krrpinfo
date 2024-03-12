import { Link as LinkIcon } from 'lucide-react';
import Link from 'next/link';
import ButtonNewTab from '@/components/Button/ButtonNewTab';
import ResponsiveImage from '@/components/Image/ResponsiveImage';
import Tag from '@/components/Tag/Tag';
import { cn, formatDate } from '@/src/util/utils';

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
  className,
}) => {
  const mutualClassName = cn('relative flex flex-col rounded-lg focus:outline-none', className);

  if (toNavigate)
    return (
      <div className={mutualClassName}>
        <Link href={toNavigate}>
          <div className={`relative aspect-video rounded-md ${width}`}>
            <div
              className="absolute inset-0 z-10 rounded-md bg-black opacity-0 transition hover:opacity-20 dark:bg-white"
            />
            <ResponsiveImage
              src={thumbnail}
              alt="blog-thumbnail"
              wrapperClassName="rounded-md shadow-md dark:shadow-slate-600"
              gridNums={gridNums}
              isPriority={isImagePriority}
            />
          </div>
        </Link>
        <div className="group mt-4 space-y-1 text-left">
          <h2
            className="text-sm font-medium text-neutral-600 dark:text-neutral-200"
          >
            {formatDate(date ?? new Date())}
          </h2>
          <Link href={toNavigate}>
            <h1 className="w-fit truncate text-2xl font-bold text-primary hover:underline">{title}</h1>
          </Link>
          {description && (
            <p className="truncate font-medium text-neutral-600 dark:text-neutral-200">{description}</p>
          )}
          <Tag
            tagInput={tags}
            className="pt-2"
          />
        </div>
      </div>
    );

  if (hyperlink)
    return (
      <div className={mutualClassName}>
        <ButtonNewTab href={hyperlink}>
          <div className={`relative aspect-video rounded-md ${width}`}>
            <div
              className="absolute inset-0 z-10 rounded-md bg-black opacity-0 transition hover:opacity-20 dark:bg-white"
            />
            <div className="absolute z-20 rounded-br-md rounded-tl-md bg-white/70 p-2">
              <LinkIcon
                className="size-8 text-blue-600"
              />
            </div>
            <ResponsiveImage
              src={thumbnail}
              alt="blog-thumbnail"
              wrapperClassName="rounded-md shadow-md dark:shadow-slate-600"
              gridNums={gridNums}
              isPriority={isImagePriority}
            />
          </div>
        </ButtonNewTab>
        <div className="group mt-4 space-y-1 text-left">
          <h2
            className="text-sm font-medium text-neutral-600 dark:text-neutral-200"
          >
            {formatDate(date ?? new Date())}
          </h2>
          <ButtonNewTab href={hyperlink}>
            <h1 className="w-fit truncate text-2xl font-bold text-primary hover:underline">{title}</h1>
          </ButtonNewTab>
          {description && (
            <p className="truncate font-medium text-neutral-600 dark:text-neutral-200">{description}</p>
          )}
          <Tag
            tagInput={tags}
            className="pt-2"
          />
        </div>
      </div>
    );

  return (
    <div className={mutualClassName}>
      <div className={`relative aspect-video rounded-md ${width}`}>
        <div
          className="absolute inset-0 z-10 rounded-md bg-black opacity-0 transition hover:opacity-20 dark:bg-white"
        />
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
        <h1 className="w-fit truncate text-2xl font-bold text-primary hover:underline">{title}</h1>
        {description && (
          <p className="truncate font-medium text-neutral-600 dark:text-neutral-200">{description}</p>
        )}
        <Tag
          tagInput={tags}
          className="pt-2"
        />
      </div>
    </div>
  );
};

export default Blog;
