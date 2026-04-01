import { compareDesc } from 'date-fns';
import { ChevronLeft, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getAllChannels, getChannel } from '@/app/actions/handleYTData';
import ButtonNewTab from '@/components/Button/ButtonNewTab';
import YouTubeIcon from '@/components/Icons/YouTubeIcon';
import { siteConfig } from '@/config/site';
import YouTubeVideoTabs from '@/src/components/Video/YouTubeVideoTabs';
import { buttonVariants } from '@/src/components/ui/button';
import type { YouTubeVideoItem } from '@/src/types';
import { absoluteUrl, cn } from '@/src/util/utils';
import type { ResolvingMetadata } from 'next';

async function getChannelFromParams(params: { channelId: string }) {
  const channel = getChannel(params.channelId);
  if (!channel) return null;
  return channel;
}

export async function generateMetadata(
  { params }: { params: Promise<{ channelId: string }> },
  parent: ResolvingMetadata,
) {
  const resolvedParams = await params;
  const channel = await getChannelFromParams(resolvedParams);

  if (!channel) return {};

  const { channelTitle } = channel;

  const mutualTitle = `${channelTitle} | 유튜버`;

  return {
    title: mutualTitle,
    description: channelTitle,
    keywords: [...(await parent).keywords, channelTitle],
    authors: [
      {
        name: 'Megi',
        url: 'https://github.com/gvm1229',
      },
      {
        name: channelTitle,
        url: `https://www.youtube.com/channel/${resolvedParams.channelId}`,
      },
    ],
    openGraph: {
      title: mutualTitle,
      description: channelTitle,
      type: 'article',
      authors: ['Megiii', channelTitle],
      url: absoluteUrl(channelTitle),
      images: (await parent).openGraph.images,
    },
    twitter: {
      card: 'summary_large_image',
      title: mutualTitle,
      description: channelTitle,
      images: (await parent).twitter.images,
    },
    metadataBase: new URL(`${siteConfig.url}/${channelTitle}`),
    alternates: {
      canonical: '/',
      languages: {
        'ko-KR': '/ko-KR',
        // 'en-US': '/en-US',
      },
    },
  };
}

export async function generateStaticParams() {
  const allChannels = await getAllChannels();
  return allChannels.map((channel) => ({
    channelId: channel.channelId,
  }));
}

export default async function YouTuberRootPage({
  params,
  searchParams,
}: {
  params: Promise<{ channelId: string }>;
  searchParams?: Promise<{ [key: string]: string | undefined }>;
}) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  const channel = await getChannelFromParams(resolvedParams);
  if (!channel) notFound();

  const overrideIndex = resolvedSearchParams?.idx ? parseInt(resolvedSearchParams?.idx, 10) : 0;

  const { channelId, channelTitle, channelDescription } = channel;

  const videos = channel.allVideos.sort((a: YouTubeVideoItem, b: YouTubeVideoItem) =>
    compareDesc(new Date(a.snippet.publishedAt), new Date(b.snippet.publishedAt)),
  );
  const categorizedVideos = {
    '현재 시즌': videos.filter((video) => video.category === '현재 시즌'),
    '향후 시즌': videos.filter((video) => video.category === '향후 시즌'),
    '지난 시즌': videos.filter((video) => video.category === '지난 시즌'),
    팁: videos.filter((video) => video.category === '팁'),
  };
  const nonZeroCategoryKeys = Object.keys(categorizedVideos).filter(
    (key) => categorizedVideos[key].length > 0,
  );

  return (
    <div className="container relative flex flex-col items-center">
      {videos.length > 0 ? (
        <>
          <div className="flex w-full flex-col items-center justify-center gap-y-4 tablet:gap-y-6">
            <h1 className="text-4xl font-bold laptop:text-5xl">추천 영상 목록</h1>
            <ButtonNewTab
              href={`https://www.youtube.com/channel/${channelId}`}
              className="flex w-fit items-center gap-2 text-xl font-medium text-primary hover:underline laptop:text-2xl"
            >
              <YouTubeIcon className="flex size-7 items-center justify-center tablet:size-8" />
              {channelTitle}
              <ExternalLink size={20} className="text-primary tablet:hidden" />
              <ExternalLink size={24} className="text-primary mobile_only:hidden" />
            </ButtonNewTab>
            <p className="text-center text-lg text-muted-foreground tablet:text-xl">
              {channelDescription}
            </p>
          </div>
          <YouTubeVideoTabs
            categorizedVideos={categorizedVideos}
            nonZeroCategoryKeys={nonZeroCategoryKeys}
            overrideIndex={overrideIndex}
            className="mt-8 laptop:mt-16"
          />
          <footer className="mt-8 flex w-full items-center justify-center border-t pt-8">
            <Link
              href="/youtubers"
              className={cn(buttonVariants({ variant: 'ghost' }), 'relative inline-flex text-base')}
            >
              <ChevronLeft className="mr-2 size-4" />
              유튜브 채널 목록으로 돌아가기
            </Link>
          </footer>
        </>
      ) : (
        <p className="text-center text-2xl font-bold tablet:text-3xl laptop:text-4xl">
          아직 미허가
        </p>
      )}
    </div>
  );
}
