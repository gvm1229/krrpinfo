import { Link as LinkIcon } from 'lucide-react';
import ButtonNewTab from '@/components/Button/ButtonNewTab';
import ResponsiveImage from '@/components/Image/ResponsiveImage';
import Tag from '@/components/Tag/Tag';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { cn } from '@/src/util/utils';

interface SimpleLinkCardProps {
  thumbnail?: string;
  gridNums?: number[];
  title: string;
  tags: string[];
  // toNavigate?: string;
  hyperlink?: string;
  className?: string;
}

export function SimpleLinkCardMD({
  thumbnail = 'https://res.cloudinary.com/djfgq8qk3/image/upload/v1710490251/storybook/nextjs-720p.png',
  gridNums,
  title,
  tags,
  // toNavigate,
  hyperlink,
  className,
}: SimpleLinkCardProps) {
  // tablet and above
  return (
    <Card
      className={cn(
        'block w-full overflow-hidden rounded-lg shadow dark:shadow-zinc-600',
        className,
      )}
    >
      <ButtonNewTab href={hyperlink}>
        <div className="relative aspect-video">
          <div className="absolute inset-0 z-10 bg-black opacity-0 transition hover:opacity-20 dark:bg-white" />
          <div className="absolute z-20 rounded-br-md rounded-tl-md bg-white/70 p-2">
            <LinkIcon className="size-8 text-blue-600" />
          </div>
          <ResponsiveImage
            src={thumbnail}
            alt="blog-mini-thumbnail"
            gridNums={gridNums}
            isPriority
          />
        </div>
      </ButtonNewTab>
      <CardContent className="p-4">
        <ButtonNewTab href={hyperlink}>
          <CardTitle className="truncate text-lg font-bold hover:underline">
            {title}
          </CardTitle>
        </ButtonNewTab>
        <Tag
          tagInput={tags}
          isHoverEnabled={false}
          className="flex-wrap pt-3"
          innerClassName="text-xs"
        />
      </CardContent>
    </Card>
  );
}

export function SimpleLinkCardSM({
  thumbnail = 'https://res.cloudinary.com/djfgq8qk3/image/upload/v1710490251/storybook/nextjs-720p.png',
  gridNums,
  title,
  tags,
  // toNavigate,
  hyperlink,
  className,
}: SimpleLinkCardProps) {
  return (
    <ButtonNewTab href={hyperlink} className={cn('w-full', className)}>
      {/* mobile only */}
      <Card className="group flex size-full overflow-hidden rounded-lg shadow dark:shadow-zinc-600 dark:hover:bg-zinc-900">
        <div className="relative w-36">
          <div className="absolute inset-0 z-10 bg-black opacity-0 transition group-hover:opacity-20 dark:bg-white" />
          <div className="absolute z-20 rounded-br-md rounded-tl-md bg-white/70 p-2">
            <LinkIcon className="size-4 text-blue-600" />
          </div>
          <ResponsiveImage
            src={thumbnail}
            alt="blog-mini-thumbnail"
            gridNums={gridNums}
            objectFit="object-contain"
          />
        </div>
        <CardContent className="flex flex-col items-start justify-center p-0 pl-4">
          <CardTitle className="truncate text-sm font-bold group-hover:underline">
            {title}
          </CardTitle>
          <Tag
            tagInput={tags}
            isHoverEnabled={false}
            isExtraSmall
            className="flex-wrap pt-2"
          />
        </CardContent>
      </Card>
    </ButtonNewTab>
  );
}
