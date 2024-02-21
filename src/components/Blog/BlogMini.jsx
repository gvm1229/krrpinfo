import { Link as LinkIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import ButtonNewTab from '@/src/components/Button/ButtonNewTab';

const BlogMini = ({
  height = 'h-20',
  thumbnail = 'https://dummyimage.com/1280x720',
  imgStyle = 'object-cover',
  category = 'Sample Category',
  title = 'Sample Title',
  toNavigate,
  hyperlink,
}) => {
  const children = (
    <>
      <div className="relative flex max-w-32 shrink-0 items-center justify-center">
        <Image
          src={thumbnail}
          className={`w-full ${height} ${imgStyle}`}
          alt="blog-mini-thumbnail"
        />
      </div>
      <div className="ml-6 text-left">
        <h2 className="mt-1 w-fit text-xs font-semibold text-blue-600">{category}</h2>
        <h1 className="mt-2 text-lg font-bold text-neutral-900">{title}</h1>
      </div>
      {hyperlink && (
        <div className="absolute right-0 top-0 rounded-bl-md rounded-tr-md bg-white/50 p-2">
          {/* <HeroIconWrapper */}
          {/*  icon={LinkIcon} */}
          {/*  size="size-6" */}
          {/*  style="text-blue-600" */}
          {/*  strokeWidth={2} */}
          {/* /> */}
          <LinkIcon />
        </div>
      )}
    </>
  );

  const mutualClassName = 'p-4 relative bg-neutral-200 rounded-md flex items-center group transition hover:bg-neutral-300 hover:scale-103 focus:outline-none';

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

export default BlogMini;
