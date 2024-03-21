import { EyeIcon, LinkIcon } from 'lucide-react';
import Link from 'next/link';
import ButtonNewTab from '@/components/Button/ButtonNewTab';
import ResponsiveImage from '@/components/Image/ResponsiveImage';
import Tag from '@/components/Tag/Tag';
import { cn, formatDate } from '@/src/util/utils';

interface BlogProps {
  width?: string;
  thumbnail?: string;
  date?: string;
  title: string;
  description?: string;
  tags: string[];
  toNavigate?: string;
  hyperlink?: string;
  gridNums?: number[];
  isImagePriority?: boolean;
  views?: number;
  className?: string;
}

export default function Blog({
  width,
  thumbnail = 'https://res.cloudinary.com/djfgq8qk3/image/upload/v1710490251/storybook/nextjs-720p.png',
  date,
  title,
  description,
  tags,
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
        toNavigate={toNavigate}
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
        hyperlink={hyperlink}
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
  toNavigate?: string;
  hyperlink?: string;
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
  toNavigate,
  hyperlink,
  views,
  className,
}: TextDataWrapperProps) {
  return (
    <div
      className={cn(
        'relative flex flex-col rounded-lg focus:outline-none',
        className,
      )}
    >
      {(toNavigate || hyperlink) ? (
        <NavigateComponent href={toNavigate || hyperlink}>
          <ImageWrapper
            src={thumbnail}
            gridNums={gridNums}
            isPriority={isPriority}
            isHyperlink={!!hyperlink}
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
      <div className="group mt-4 space-y-2 text-left">
        <div
          className={`flex items-center justify-between ${toNavigate && 'pb-2'}`}
        >
          <p
            id="date"
            className="text-sm font-medium text-zinc-600 dark:text-zinc-300"
          >
            {formatDate(date ?? new Date())}
          </p>
          {views > 0 && (
            <p
              id="views"
              className="flex items-center gap-2 text-sm font-medium text-zinc-500 dark:text-zinc-400"
            >
              <EyeIcon className="size-5" />
              {views}
            </p>
          )}
        </div>
        {(toNavigate || hyperlink) ? (
          <NavigateComponent
            href={toNavigate || hyperlink}
            className="w-fit truncate text-2xl font-bold text-primary hover:underline"
          >
            {title}
          </NavigateComponent>
        ) : (
          <h1
            id="title"
            className="w-fit truncate text-2xl font-bold text-primary hover:underline"
          >
            {title}
          </h1>
        )}
        {description && (
          <p className="truncate font-medium text-zinc-600 dark:text-zinc-200">
            {description}
          </p>
        )}
        <Tag tagInput={tags} />
      </div>
    </div>
  );
}

interface ImageWrapperProps {
  src: string;
  alt?: string;
  gridNums: number[];
  isPriority: boolean;
  isHyperlink?: boolean;
  width: string;
}

function ImageWrapper({
  src,
  alt = 'blog-thumbnail',
  gridNums,
  isPriority,
  isHyperlink,
  width,
}: ImageWrapperProps) {
  return (
    <div className={`relative aspect-video rounded-md ${width}`}>
      <div className="absolute inset-0 z-10 rounded-md bg-black opacity-0 transition hover:opacity-20 dark:bg-white" />
      {isHyperlink && (
        <div className="absolute z-20 rounded-br-md rounded-tl-md bg-white/70 p-2">
          <LinkIcon className="size-8 text-blue-600" />
        </div>
      )}
      <ResponsiveImage
        src={src}
        alt={alt}
        wrapperClassName="rounded-md shadow-md dark:shadow-zinc-600"
        gridNums={gridNums}
        isPriority={isPriority}
      />
    </div>
  );
}
