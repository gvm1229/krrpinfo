import { EyeIcon } from 'lucide-react';
import Link from 'next/link';
import ButtonNewTab from '@/components/Button/ButtonNewTab';
import ResponsiveImage from '@/components/Image/ResponsiveImage';
import Tag from '@/components/Tag/Tag';
import { cn, formatDate } from '@/src/util/utils';

interface BlogProps {
  width?: string;
  thumbnail?: string;
  tags?: string[];
  date?: string;
  title?: string;
  description?: string;
  toNavigate?: string;
  hyperlink?: string;
  gridNums?: number[];
  isImagePriority?: boolean;
  views?: number;
  className?: string;
}

export default function Blog({
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
  views = 0,
  className,
}: BlogProps) {
  // When redirect link is present
  if (toNavigate)
    return (
      <TextDataWrapper
        width={width}
        thumbnail={thumbnail}
        tags={tags}
        date={date}
        title={title}
        description={description}
        gridNums={gridNums}
        isPriority={isImagePriority}
        NavigateComponent={Link}
        toLink={toNavigate}
        views={views}
        className={className}
      />
    );

  // When external link is present
  if (hyperlink)
    return (
      <TextDataWrapper
        width={width}
        thumbnail={thumbnail}
        tags={tags}
        date={date}
        title={title}
        description={description}
        gridNums={gridNums}
        isPriority={isImagePriority}
        NavigateComponent={ButtonNewTab}
        toLink={hyperlink}
        views={views}
        className={className}
      />
    );

  // Default render without any links
  return (
    <TextDataWrapper
      width={width}
      thumbnail={thumbnail}
      tags={tags}
      date={date}
      title={title}
      description={description}
      gridNums={gridNums}
      isPriority={isImagePriority}
      NavigateComponent={ButtonNewTab}
      toLink={hyperlink}
      views={views}
      className={className}
    />
  );
}

interface TextDataWrapperProps {
  width: string;
  thumbnail: string;
  tags: string[];
  date: string;
  title: string;
  description: string;
  gridNums: number[];
  isPriority: boolean;
  NavigateComponent?: typeof Link | typeof ButtonNewTab;
  toLink?: string;
  views: number;
  className: string;
}

function TextDataWrapper({
  width,
  thumbnail,
  tags,
  date,
  title,
  description,
  gridNums,
  isPriority,
  NavigateComponent,
  toLink,
  views,
  className,
}: TextDataWrapperProps) {
  return (
    <div className={cn('relative flex flex-col rounded-lg focus:outline-none', className)}>
      {toLink ? (
        <NavigateComponent href={toLink}>
          <ImageWrapper
            src={thumbnail}
            gridNums={gridNums}
            isPriority={isPriority}
            width={width}
          />
        </NavigateComponent>
      ) : (
        <ImageWrapper
          src={thumbnail}
          gridNums={gridNums}
          isPriority={isPriority}
          width={width}
        />
      )}
      <div className="group mt-4 space-y-1 text-left">
        <div className="flex items-center justify-between">
          <p
            id="date"
            className="text-sm font-medium text-slate-600 dark:text-slate-300"
          >
            {formatDate(date ?? new Date())}
          </p>
          <p
            id="views"
            className="flex items-center gap-2 text-sm font-medium text-slate-500 dark:text-slate-400"
          >
            <EyeIcon
              className="size-6"
            />
            {views}
          </p>
        </div>
        <NavigateComponent href={toLink}>
          <h1 className="w-fit truncate text-2xl font-bold text-primary hover:underline">{title}</h1>
        </NavigateComponent>
        {description && (
          <p className="truncate font-medium text-slate-600 dark:text-slate-200">{description}</p>
        )}
        <Tag
          tagInput={tags}
          className="pt-2"
        />
      </div>
    </div>
  );
}

interface ImageWrapperProps {
  src: string;
  alt?: string;
  gridNums: number[];
  isPriority: boolean;
  width: string;
}

function ImageWrapper({
  src,
  alt = 'blog-thumbnail',
  gridNums,
  isPriority,
  width,
}: ImageWrapperProps) {
  return (
    <div className={`relative aspect-video rounded-md ${width}`}>
      <div
        className="absolute inset-0 z-10 rounded-md bg-black opacity-0 transition hover:opacity-20 dark:bg-white"
      />
      <ResponsiveImage
        src={src}
        alt={alt}
        wrapperClassName="rounded-md shadow-md dark:shadow-slate-600"
        gridNums={gridNums}
        isPriority={isPriority}
      />
    </div>
  );
}
