import Link from 'next/link';
import YouTubeIcon from '@/components/Icons/YouTubeIcon';
import { Button } from '@/components/ui/button';
import {
  CardTitle, CardDescription, Card,
} from '@/components/ui/card';

export default function YouTubeChannelCard({
  channelId,
  title,
  description,
}: {
  channelId: string;
  title: string;
  description: string;
}) {
  return (
    <Card className="flex w-full flex-col justify-center gap-6 px-6 py-8">
      <div className="flex items-center gap-4 tablet:gap-6">
        <YouTubeIcon className="flex size-10 items-center justify-center tablet:size-14" />
        <div className="grid">
          <CardTitle className="text-lg tablet:text-xl laptop:text-2xl">{title}</CardTitle>
          <CardDescription className="text-base tablet:text-lg laptop:text-xl">{description}</CardDescription>
        </div>
      </div>
      <Link
        key={channelId}
        href={`/youtubers/${channelId}`}
        className="w-full"
      >
        <Button className="w-full text-base tablet:text-lg">채널 보기</Button>
      </Link>
    </Card>
  );
}
