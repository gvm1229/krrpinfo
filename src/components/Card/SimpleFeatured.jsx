import { Link as LinkIcon } from 'lucide-react';
import Image from 'next/image';
import Tag from '@/src/components/Tag/Tag';
import { Card, CardContent, CardTitle } from '@/src/components/ui/card';

export default function SimpleFeatured({
  thumbnail = 'https://dummyimage.com/1280x720',
  title = 'Sample Title',
  tags = ['Sample Tag', 'Sample Tag', 'Sample Tag'],
  toNavigate,
  hyperlink,
}) {
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
          className="flex-wrap pt-2"
          innerClassName="text-xs"
        />
      </CardContent>
    </Card>
  );
}
