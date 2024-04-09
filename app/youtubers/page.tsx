import Link from 'next/link';
import { getAllChannels } from '@/app/actions/handleYTData';
import YouTubeDataInput from '@/components/Video/YouTubeDataInput';
import { siteConfig } from '@/config/site';

export const metadata = {
  title: '추천 유튜버 목록',
  metadataBase: new URL(`${siteConfig.url}/youtubers`),
  alternates: {
    canonical: '/',
    languages: {
      'ko-KR': '/ko-KR',
      // 'en-US': '/en-US',
    },
  },
};

export const revalidate = 60;

export default async function YouTubersRootPage() {
  const channels = await getAllChannels();

  return (
    <main className="container relative flex h-full flex-col items-center gap-12">
      <div className="grid grid-cols-1 gap-4 tablet:grid-cols-2 laptop:grid-cols-3">
        {channels.map((channel: {
          channelId: string;
          channelTitle: string;
        }) => (
          <Link
            key={channel.channelId}
            href={`/youtubers/${channel.channelId}`}
            className="flex size-28 items-center justify-center bg-secondary p-4 font-bold"
          >
            {channel.channelTitle}
          </Link>
        ))}
      </div>
      <YouTubeDataInput />
    </main>
  );
}
