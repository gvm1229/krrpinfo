import Link from 'next/link';
import ResponsiveImage from '@/components/Image/ResponsiveImage';
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
      <ResponsiveImage
        src={thumbnail}
        wrapperClassName="rounded-lg w-full h-auto"
      />
      <div className="desktop:min-w-md flex flex-col justify-center gap-3 tablet_only:max-w-md">
        <p className="font-medium text-muted-foreground">
          {`최근 수정 날짜: ${formatDate(lastEditDate ?? new Date())}`}
        </p>
        <h2 className="text-3xl font-bold">
          {title}
        </h2>
        <p className="font-medium text-muted-foreground">
          {description}
        </p>
        <Link className="font-medium text-blue-600 hover:underline dark:text-blue-500" href="#">
          자세히 알아보기 →
        </Link>
      </div>
    </div>
  );
}
