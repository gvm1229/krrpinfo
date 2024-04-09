import { compareDesc } from 'date-fns';
import { notFound } from 'next/navigation';
import type { YouTubeVideoItem } from '@/app/actions/fetchYouTube';
import { getAllChannels, getChannel } from '@/app/actions/handleYTData';
import Blog from '@/components/Blog/Blog';
import { siteConfig } from '@/config/site';
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
    <div className="container relative flex flex-col items-center gap-y-8">
      {videos.length > 0 ? (
        <>
          <h1 className="text-3xl font-bold tablet:text-4xl laptop:text-5xl">
            {`${channelTitle} - 영상 목록`}
          </h1>
          <div className="relative grid size-full grid-cols-1 gap-8 tablet:grid-cols-2 laptop:grid-cols-3">
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
