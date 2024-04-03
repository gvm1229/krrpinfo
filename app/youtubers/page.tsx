import YouTubeDataInput from '@/components/Video/YouTubeDataInput';
import { YouTubeModalTrigger } from '@/components/Video/YouTubeModalTrigger';
import { siteConfig } from '@/config/site';
import video1 from '@/content/youtubers/루밍밍/w1Rrw2T7Bz4.json';

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

export default async function RedeemRootPage() {
  return (
    <main className="container relative flex h-full flex-col items-center gap-12">
      <div className="grid grid-cols-1 tablet:grid-cols-2 laptop:grid-cols-3">
        <YouTubeModalTrigger videoData={video1} />
      </div>
      <YouTubeDataInput />
    </main>
  );
}
