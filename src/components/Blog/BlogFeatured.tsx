import Link from 'next/link';
import StaticImage from '@/components/Image/StaticImage';
import { cn, formatDate } from '@/src/util/utils';

interface BlogFeaturedProps {
  thumbnail: string;
  lastEditDate?: string;
  title: string;
  description: string;
  className?: string;
}

export default function BlogFeatured({
  thumbnail,
  lastEditDate,
  title,
  description,
  className,
}: BlogFeaturedProps) {
  return (
    <div className={cn('grid gap-4 rounded-lg bg-popover tablet:grid-cols-2 tablet:gap-8', className)}>
      <StaticImage
        src={thumbnail}
        alt="blog-featured-thumbnail"
        width={1920}
        height={1080}
        // gridNums={[1, 2, 3]}
        wrapperClassName="flex items-center justify-center"
        imageClassName="rounded-lg w-full h-auto"
        isPriority
      />
      <div className="laptop:min-w-md flex flex-col justify-center gap-3 tablet_only:max-w-md">
        <p className="text-sm font-medium text-muted-foreground tablet:text-base laptop:text-lg">
          {`최근 수정 날짜: ${formatDate(lastEditDate ?? new Date())}`}
        </p>
        <h2 className="text-2xl font-bold tablet:text-3xl laptop:text-4xl">
          📢
          {' '}
          {title}
        </h2>
        <p className="text-base font-medium text-muted-foreground tablet:text-lg laptop:text-xl">
          {description}
        </p>
        <Link
          href="#"
          className="text-base font-medium text-blue-600 hover:underline hover:underline-offset-4 dark:text-blue-500 tablet:text-lg laptop:text-xl"
        >
          자세히 알아보기 →
        </Link>
      </div>
    </div>
  );
}
