import { compareDesc } from 'date-fns';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { getAllChannels } from '@/app/actions/handleYTData';
import { buttonVariants } from '@/components/ui/button';
import { siteConfig } from '@/config/site';
import YouTubeVideoTabs from '@/src/components/Video/YouTubeVideoTabs';
import type { YouTubeChannel, YouTubeVideoItem } from '@/src/types';
import { cn } from '@/src/util/utils';

export const metadata = {
  title: '추천 영상 종합 목록',
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

export default async function YouTubeVideosRootPage({
  searchParams,
}: {
  searchParams?: { [key: string]: string | undefined };
}) {
  const overrideIndex = searchParams?.idx ? parseInt(searchParams?.idx, 10) : 0;

  const channels = await getAllChannels();
  const flatAllVideos = channels.flatMap((channel: YouTubeChannel) => channel.allVideos);
  const combinedAllVideos = flatAllVideos.sort((a: YouTubeVideoItem, b: YouTubeVideoItem) => compareDesc(
    new Date(a.snippet.publishedAt),
    new Date(b.snippet.publishedAt),
  ));
  const categorizedAllVideos = {
    '현재 시즌': combinedAllVideos.filter((video) => video.category === '현재 시즌'),
    '향후 시즌': combinedAllVideos.filter((video) => video.category === '향후 시즌'),
    '지난 시즌': combinedAllVideos.filter((video) => video.category === '지난 시즌'),
    팁: combinedAllVideos.filter((video) => video.category === '팁'),
  };
  const nonZeroCategoryKeys = Object.keys(categorizedAllVideos).filter((key) => categorizedAllVideos[key].length > 0);

  return (
    <main className="container relative flex h-full flex-col items-center">
      <h1 className="text-4xl font-bold laptop:text-5xl">
        추천 영상 종합 목록
      </h1>
      <YouTubeVideoTabs
        categorizedVideos={categorizedAllVideos}
        nonZeroCategoryKeys={nonZeroCategoryKeys}
        overrideIndex={overrideIndex}
        className="mt-8 laptop:mt-16"
      />
      <footer className="mt-8 flex w-full items-center justify-center border-t pt-8">
        <Link
          href="/youtubers"
          className={cn(
            buttonVariants({ variant: 'default' }),
            'relative inline-flex text-base',
          )}
        >
          <ChevronLeft className="mr-2 size-4" />
          채널 별로 모아보기
        </Link>
      </footer>
    </main>
  );
}
