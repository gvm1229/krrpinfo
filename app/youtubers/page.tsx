import { getAllChannels } from '@/app/actions/handleYTData';
import YouTubeChannelCard from '@/components/Card/YouTubeChannelCard';
// import YouTubeDataInput from '@/components/Video/YouTubeDataInput';
import { siteConfig } from '@/config/site';
import type { YouTubeChannel } from '@/src/types';

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
    <main className="container relative flex h-full flex-col items-center gap-y-12 laptop:gap-y-16">
      <h1 className="text-4xl font-bold laptop:text-5xl">
        추천 유튜버 목록
      </h1>
      <div className="relative grid w-full grid-cols-1 gap-8 tablet:grid-cols-2 laptop:grid-cols-3">
        {channels.map((channel: YouTubeChannel) => (
          <YouTubeChannelCard
            key={channel.channelId}
            channelData={channel}
          />
        ))}
      </div>
      {/* <YouTubeDataInput /> */}
    </main>
  );
}
