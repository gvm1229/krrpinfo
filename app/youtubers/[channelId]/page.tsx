import { compareDesc } from 'date-fns';
import { ExternalLink } from 'lucide-react';
import { notFound } from 'next/navigation';
import { getAllChannels, getChannel } from '@/app/actions/handleYTData';
import Blog from '@/components/Blog/Blog';
import ButtonNewTab from '@/components/Button/ButtonNewTab';
import YouTubeIcon from '@/components/Icons/YouTubeIcon';
import { siteConfig } from '@/config/site';
import type { YouTubeVideoItem } from '@/src/types';
import { absoluteUrl } from '@/src/util/utils';
import type { ResolvingMetadata } from 'next';

async function getChannelFromParams(params: { channelId: string }) {
  const channel = getChannel(params.channelId);
  if (!channel) return null;
  return channel;
}

export async function generateMetadata(
  { params }: { params: { channelId: string } },
  parent: ResolvingMetadata,
) {
  const channel = await getChannelFromParams(params);

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
        url: `https://www.youtube.com/channel/${params.channelId}`,
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
}: {
  params: { channelId: string };
}) {
  const channel = await getChannelFromParams(params);
  if (!channel) notFound();

  const { channelId, channelTitle } = channel;

  const videos = channel.allVideos.sort((a: YouTubeVideoItem, b: YouTubeVideoItem) => compareDesc(
    new Date(a.snippet.publishedAt),
    new Date(b.snippet.publishedAt),
  ));

  return (
    <div className="container relative flex flex-col items-center gap-y-12 laptop:gap-y-16">
      {videos.length > 0 ? (
        <>
          <div className="flex flex-col items-center justify-center gap-y-4 tablet:gap-y-6">
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
          </div>
          <div className="relative grid w-full grid-cols-1 gap-8 tablet:grid-cols-2 laptop:grid-cols-3">
            {videos.map((video: YouTubeVideoItem, index: number) => (
              <Blog
                key={video.id}
                toNavigate={`${channelId}/${video.id}`}
                thumbnail={video.snippet.thumbnails.maxres.url}
                isImagePriority={index < 6}
                title={video.snippet.title}
                description={channelTitle}
                date={video.snippet.publishedAt}
                tags={[]}
              />
            ))}
          </div>
        </>
      ) : (
        <p className="text-center text-2xl font-bold tablet:text-3xl laptop:text-4xl">
          아직 미허가
        </p>
      )}
    </div>
  );
}
