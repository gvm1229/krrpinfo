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
          alt={title}
          loading={isImagePriority ? 'eager' : 'lazy'}
          className="aspect-video w-full rounded-lg object-cover"
        />
      )}
      <div className="mt-4 space-y-2">
        {date && <p className="text-sm text-muted-foreground">{formatDate(date)}</p>}
        <h3 className="truncate text-2xl font-bold hover:underline">{title}</h3>
        {description && <p className="truncate text-muted-foreground">{description}</p>}
      </div>
    </>
  );
  return (
    <article className={cn('rounded-lg', width, className)}>
      {toNavigate ? (
        <Link href={toNavigate}>{content}</Link>
      ) : hyperlink ? (
        <a href={hyperlink} target="_blank" rel="noreferrer">
          {content}
        </a>
      ) : (
        content
      )}
      <div className="mt-2">
        <Tag tagInput={tags} isEllipsisEnabled />
      </div>
    </article>
  );
};
export default Blog;
