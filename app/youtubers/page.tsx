import Link from 'next/link';
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

export default async function YouTubersRootPage() {
  return (
    <main className="container relative flex h-full flex-col items-center gap-12">
      <div className="grid grid-cols-1 gap-4 tablet:grid-cols-2 laptop:grid-cols-3">
        <Link
          href="/youtubers/UC2k5P3gHLWmqDHmyG5iLNfQ"
          className="flex size-24 items-center justify-center bg-secondary p-4 font-bold"
        >
          루밍밍
        </Link>
        <button className="flex size-24 items-center justify-center bg-secondary p-4 font-bold">
          YT2
        </button>
        <button className="flex size-24 items-center justify-center bg-secondary p-4 font-bold">
          YT3
        </button>
      </div>
      <YouTubeDataInput />
    </main>
  );
}
