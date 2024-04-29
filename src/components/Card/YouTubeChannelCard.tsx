import Link from 'next/link';
import ButtonNewTab from '@/components/Button/ButtonNewTab';
import YouTubeIcon from '@/components/Icons/YouTubeIcon';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/avatar';
import { buttonVariants } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import type { YouTubeChannel } from '@/src/types';
import { cn, truncateNumbers } from '@/src/util/utils';

export default function YouTubeChannelCard({
  channelData,
}: {
  channelData: YouTubeChannel
}) {
  return (
    <Card>
      <CardContent className="flex items-start gap-4 p-4">
        <Avatar className="size-24">
          <AvatarImage src={channelData.thumbnail.url} alt={channelData.customUrl} />
          <AvatarFallback>YT</AvatarFallback>
        </Avatar>
        <div className="grid gap-2">
          <h3 className="text-xl font-medium leading-none">{channelData.channelTitle}</h3>
          <p className="text-base leading-none text-gray-500 dark:text-gray-400">{`구독자 ${truncateNumbers(channelData.subscribers)}명`}</p>
          <p className="text-base leading-tight">{channelData.channelDescription}</p>
        </div>
      </CardContent>
      <CardFooter className="gap-4">
        <ButtonNewTab
          href={`https://www.youtube.com/channel/${channelData.channelId}`}
          className={cn(buttonVariants({ variant: 'secondary' }), 'w-full gap-3 text-base')}
        >
          <YouTubeIcon className="flex size-6 items-center justify-center" />
          채널 바로가기
        </ButtonNewTab>
        <Link
          className={cn(buttonVariants({ variant: 'secondary' }), 'w-full text-base')}
          href={`/youtubers/${channelData.channelId}`}
        >
          추천 영상 목록 보기
        </Link>
      </CardFooter>
    </Card>
  );
}
