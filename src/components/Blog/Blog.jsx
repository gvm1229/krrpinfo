import { Link as LinkIcon } from 'lucide-react';
import Link from 'next/link';
import ButtonNewTab from '@/src/components/Button/ButtonNewTab';
import ResponsiveImage from '@/src/components/Image/ResponsiveImage';

const Blog = ({
  width = 'min-w-80',
  thumbnail = 'https://dummyimage.com/1280x720',
  category = 'Sample Category',
  date = '2024/1/11',
  title = 'Sample Title',
  toNavigate,
  hyperlink,
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
          aspectRatio="aspect-video"
          wrapperClassName="rounded-md shadow-md dark:shadow-slate-600"
        />
      </div>
      <div className="group text-left">
        <div className="flex items-center justify-between">
          <h2 className="mt-4 w-fit text-sm font-semibold text-blue-600">{category}</h2>
          <h2 className="mt-4 w-fit text-sm font-semibold text-neutral-600 dark:text-neutral-200">{date}</h2>
        </div>
        <h1 className="mt-2 text-2xl font-bold text-primary">{title}</h1>
      </div>
    </>
  );

  const mutualClassName = 'p-4 relative flex flex-col rounded-lg focus:outline-none group transition hover:bg-secondary';

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

export default Blog;
