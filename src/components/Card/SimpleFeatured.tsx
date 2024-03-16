import { Link as LinkIcon } from 'lucide-react';
import Image from 'next/image';
import Tag from '@/components/Tag/Tag';
import { Card, CardContent, CardTitle } from '@/components/ui/card';

interface SimpleFeaturedProps {
  thumbnail?: string;
  title: string;
  tags: string[];
  // toNavigate?: string;
  // hyperlink?: string;
}

export default function SimpleFeatured({
  thumbnail = 'https://res.cloudinary.com/djfgq8qk3/image/upload/v1710490251/storybook/nextjs-720p.png',
  title,
  tags,
  // toNavigate,
  // hyperlink,
}: SimpleFeaturedProps) {
  return (
    <Card className="w-[300px] overflow-hidden rounded-lg shadow-lg dark:shadow-slate-600">
      <div className="relative aspect-video">
        <div
          className="absolute inset-0 z-10 bg-black opacity-0 transition group-hover:opacity-20 dark:bg-white"
        />
        <div className="absolute z-20 rounded-br-md rounded-tl-md bg-white/70 p-2">
          <LinkIcon
            className="size-8 text-blue-600"
          />
        </div>
        <Image
          src={thumbnail}
          alt="blog-mini-thumbnail"
          width={1280}
          height={720}
          priority
        />
      </div>
      <CardContent className="p-4">
        <CardTitle className="text-lg font-bold">{title}</CardTitle>
        {/* <CardDescription className="text-sm text-gray-500">2 minutes!</CardDescription> */}
        <Tag
          tagInput={tags}
          isHoverEnabled={false}
          className="flex-wrap pt-2"
          innerClassName="text-xs"
        />
      </CardContent>
    </Card>
  );
}
