import { ChevronLeft, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getAllChannels, getChannel } from '@/app/actions/handleYTData';
import BreadcrumbContainer from '@/components/Breadcrumb/BreadcrumbContainer';
import ButtonNewTab from '@/components/Button/ButtonNewTab';
import YouTubeIcon from '@/components/Icons/YouTubeIcon';
import YouTubeModalContent from '@/components/Video/YouTubeModalContent';
import { siteConfig } from '@/config/site';
import { buttonVariants } from '@/src/components/ui/button';
import { absoluteUrl, cn } from '@/src/util/utils';
import type { ResolvingMetadata } from 'next';

async function getVideoFromParams(params: { channelId: string; videoId: string }) {
  const channel = await getChannel(params.channelId);
  const video = channel.allVideos.find((video) => video.id === params.videoId);
  if (!video) return null;
  return video;
}

export async function generateMetadata(
  { params }: { params: { channelId: string; videoId: string } },
  parent: ResolvingMetadata,
) {
  const video = await getVideoFromParams(params);

  if (!video) return {};

  const snippet = video.snippet;

  return {
    title: snippet.title,
    description: snippet.channelTitle,
    keywords: snippet.tags
      ? [...(await parent).keywords, ...snippet.tags, snippet.channelTitle]
      : [...(await parent).keywords, snippet.channelTitle],
    openGraph: {
      title: snippet.title,
      description: snippet.channelTitle,
      type: 'article',
      authors: ['Megiii', snippet.channelTitle],
      url: absoluteUrl(video.id),
      images: [
        {
          url: snippet.thumbnails.maxres.url,
          width: 1200,
          height: 630,
          alt: snippet.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: snippet.title,
      description: snippet.channelTitle,
      images: [snippet.thumbnails.maxres.url],
    },
    metadataBase: new URL(`${siteConfig.url}${video.id}`),
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
  return allChannels.flatMap((channel) => channel.allVideos.map((video) => ({
    channelId: channel.channelId,
    videoId: video.id,
  })));
}

export default async function YouTubeVideoPage({
  params,
}: {
  params: { channelId: string; videoId: string };
}) {
  const video = await getVideoFromParams(params);
  if (!video) notFound();

  const { channelId } = params;
  const channelTitle = video.snippet.channelTitle;

  return (
    <main className="container relative flex h-full flex-col items-center gap-12">
      <div className="flex w-full flex-col items-center justify-center gap-y-4 tablet:gap-y-6">
        <h1 className="text-4xl font-bold laptop:text-5xl">
          채널 영상 목록
        </h1>
        <ButtonNewTab
          href={`https://www.youtube.com/channel/${channelId}`}
          className="flex w-fit items-center gap-2 text-lg font-medium text-primary hover:underline tablet:text-xl laptop:text-2xl"
        >
          <YouTubeIcon className="flex size-7 items-center justify-center tablet:size-8" />
          {channelTitle}
          <ExternalLink size={20} className="text-primary tablet:hidden" />
          <ExternalLink size={24} className="text-primary mobile_only:hidden" />
        </ButtonNewTab>
        <BreadcrumbContainer
          itemsInput={[
            [
              { url: '/youtubers', label: '유튜브 채널' },
              { url: `/youtubers/${channelId}`, label: channelTitle },
            ],
            { url: `/youtubers/${channelId}/${video.id}`, label: video.snippet.title.trim() },
          ]}
          className="mt-4 flex w-full justify-center"
        />
        <div className="mt-4 flex w-full justify-center tablet:mt-0 tablet:justify-start">
          <aside className="shrink-0">
            <Link
              href={`/youtubers/${channelId}`}
              className={cn(
                buttonVariants({ variant: 'ghost' }),
                'relative inline-flex text-base',
              )}
            >
              <ChevronLeft className="mr-2 size-4" />
              {`${channelTitle} 채널로 돌아가기`}
            </Link>
          </aside>
        </div>
      </div>
      <YouTubeModalContent videoData={video} />
    </main>
  );
}
