import { getAllChannels } from '@/app/actions/handleYTData';
// import YouTubeDataInput from '@/components/Video/YouTubeDataInput';
import YouTubeChannelCard from '@/components/Card/YouTubeChannelCard';
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
    <main className="container relative flex h-full flex-col items-center gap-y-8">
      <h1 className="text-3xl font-bold tablet:text-4xl laptop:text-5xl">
        유튜버 목록
      </h1>
      <div className="relative grid w-full grid-cols-1 gap-8 tablet:grid-cols-2 laptop:grid-cols-3">
        {channels.map((channel: {
          channelId: string;
          channelTitle: string;
        }) => (
          <YouTubeChannelCard
            key={channel.channelId}
            channelId={channel.channelId}
            title={channel.channelTitle}
            description="sample description"
          />
        ))}
      </div>
      {/* <YouTubeDataInput /> */}
    </main>
  );
}
