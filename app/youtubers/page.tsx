import YouTubeDataInput from '@/components/Video/YouTubeDataInput';
import { YouTubeModalTrigger } from '@/components/Video/YouTubeModalTrigger';
import { siteConfig } from '@/config/site';

export const metadata = {
  title: '추천 유튜버 목록',
  metadataBase: new URL(`${siteConfig.url}/redeem`),
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
    <main className="container flex h-full flex-col items-center gap-12">
      <YouTubeModalTrigger />
      <YouTubeDataInput />
    </main>
  );
}
