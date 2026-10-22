import Link from 'next/link';
import { formatDate, cn } from '@/src/util/utils';
import Tag from '@/components/Tag/Tag';
type BlogProps = {
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
  className?: string;
};
// 실제로 등록된 데이터만 표시하는 콘텐츠 카드
const Blog = ({
  width,
  thumbnail,
  date,
  title,
  description,
  tags,
  toNavigate,
  hyperlink,
  isImagePriority = false,
  className,
}: BlogProps) => {
  const content = (
    <>
      {thumbnail && (
        <img
          src={thumbnail}
          alt={toNavigate || hyperlink ? '' : title}
          loading={isImagePriority ? 'eager' : 'lazy'}
          className="aspect-video w-full rounded-lg object-cover"
        />
      )}
      <div className="mt-4 space-y-2">
        <h3 className="break-words text-xl font-bold leading-snug group-hover:underline">
          {title}
        </h3>
        {description && (
          <p className="line-clamp-2 break-words text-muted-foreground">{description}</p>
        )}
        {date && <p className="text-sm text-muted-foreground">{formatDate(date)}</p>}
      </div>
    </>
  );
  return (
    <article className={cn('min-w-0 rounded-lg', width, className)}>
      {toNavigate ? (
        <Link
          href={toNavigate}
          className="group block rounded-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-blue"
        >
          {content}
        </Link>
      ) : hyperlink ? (
        <a
          href={hyperlink}
          target="_blank"
          rel="noreferrer"
          className="group block rounded-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-blue"
        >
          {content}
        </a>
      ) : (
        content
      )}
      {tags.length > 0 && (
        <div className="mt-3">
          <Tag tagInput={tags} isEllipsisEnabled />
        </div>
      )}
    </article>
  );
};
export default Blog;
