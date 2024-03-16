import { Link as LinkIcon } from 'lucide-react';
import Image from 'next/image';
import ButtonNewTab from '@/components/Button/ButtonNewTab';
import ResponsiveImage from '@/components/Image/ResponsiveImage';
import Tag from '@/components/Tag/Tag';
import { Card, CardContent, CardTitle } from '@/components/ui/card';

interface SimpleLinkCardProps {
  thumbnail?: string;
  title: string;
  tags: string[];
  // toNavigate?: string;
  hyperlink?: string;
}

export default function SimpleLinkCard({
  thumbnail = 'https://res.cloudinary.com/djfgq8qk3/image/upload/v1710490251/storybook/nextjs-720p.png',
  title,
  tags,
  // toNavigate,
  hyperlink,
}: SimpleLinkCardProps) {
  return (
    <div id="simplecard_wrapper" className="mobile_only:w-full">
      {/* tablet and above */}
      <Card className="hidden overflow-hidden rounded-lg shadow-lg dark:shadow-slate-600 tablet:block tablet:w-[300px]">
        <ButtonNewTab href={hyperlink}>
          <div className="relative aspect-video">
            <div className="absolute inset-0 z-10 bg-black opacity-0 transition hover:opacity-20 dark:bg-white" />
            <div className="absolute z-20 rounded-br-md rounded-tl-md bg-white/70 p-2">
              <LinkIcon className="size-8 text-blue-600" />
            </div>
            <Image
              src={thumbnail}
              alt="blog-mini-thumbnail"
              width={1280}
              height={720}
              priority
            />
          </div>
        </ButtonNewTab>
        <CardContent className="p-4">
          <ButtonNewTab href={hyperlink}>
            <CardTitle className="text-lg font-bold hover:underline">{title}</CardTitle>
          </ButtonNewTab>
          <Tag
            tagInput={tags}
            isHoverEnabled={false}
            className="flex-wrap pt-3"
          />
        </CardContent>
      </Card>
      {/* mobile only */}
      <Card className="group flex size-full overflow-hidden rounded-lg shadow-lg dark:shadow-slate-600 tablet:hidden">
        <ButtonNewTab href={hyperlink}>
          <div className="relative w-36">
            <div className="absolute inset-0 z-10 bg-black opacity-0 transition group-hover:opacity-20 dark:bg-white" />
            <div className="absolute z-20 rounded-br-md rounded-tl-md bg-white/70 p-2">
              <LinkIcon className="size-4 text-blue-600" />
            </div>
            <ResponsiveImage
              src={thumbnail}
              alt="blog-mini-thumbnail"
              gridNums={[3, 3, 3]}
              objectFit="object-contain"
            />
          </div>
        </ButtonNewTab>
        <CardContent className="flex flex-col items-start justify-center p-0 pl-4">
          <ButtonNewTab href={hyperlink}>
            <CardTitle className="text-sm font-bold hover:underline">{title}</CardTitle>
          </ButtonNewTab>
          <Tag
            tagInput={tags}
            isHoverEnabled={false}
            isExtraSmall
            className="flex-wrap pt-2"
          />
        </CardContent>
      </Card>
    </div>
  );
}
