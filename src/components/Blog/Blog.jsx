import { Link as LinkIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import ButtonNewTab from '@/src/components/Button/ButtonNewTab';

const Blog = ({
  width = 'min-w-80',
  thumbnail = 'https://dummyimage.com/1280x720',
  imgStyle = 'object-cover',
  category = 'Sample Category',
  date = '2024/1/11',
  title = 'Sample Title',
  toNavigate,
  hyperlink,
}) => {
  const children = (
    <>
      <div className={`relative aspect-[2/1] rounded-md ${width}`}>
        <div className="absolute inset-0 z-10 rounded-md bg-black opacity-0 transition group-hover:opacity-20" />
        {hyperlink && (
          <div className="absolute z-20 rounded-br-md rounded-tl-md bg-white/70 p-2">
            <LinkIcon
              className="size-8 text-blue-600"
            />
          </div>
        )}
        <div className={`relative size-full min-h-56 overflow-hidden rounded-md shadow-md ${imgStyle}`}>
          <Image
            src={thumbnail}
            fill
            alt="blog-thumbnail"
          />
        </div>
      </div>
      <div className="group text-left">
        <div className="flex items-center justify-between">
          <h2 className="mt-4 w-fit text-sm font-semibold text-blue-600">{category}</h2>
          <h2 className="mt-4 w-fit text-sm font-semibold text-neutral-600">{date}</h2>
        </div>
        <h1 className="mt-2 text-2xl font-bold text-neutral-900">{title}</h1>
      </div>
    </>
  );

  const mutualClassName = 'p-4 relative flex flex-col rounded-lg focus:outline-none group transition hover:bg-neutral-200';

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
