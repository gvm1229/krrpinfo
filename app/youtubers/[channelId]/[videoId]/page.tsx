import { notFound } from 'next/navigation';
import YouTubeDataInput from '@/components/Video/YouTubeDataInput';
import YouTubeModalContent from '@/components/Video/YouTubeModalContent';
import { siteConfig } from '@/config/site';
import { allYoutubers } from '@/content/youtubers';
import { absoluteUrl } from '@/src/util/utils';
import type { ResolvingMetadata } from 'next';

async function getVideoFromParams(params: { channelId: string; videoId: string }) {
  const channel = allYoutubers[params.channelId];
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
  return Object.keys(allYoutubers).map((channelId) => allYoutubers[channelId].allVideos.map((video) => ({
    channelId,
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

  return (
    <main className="container relative flex h-full flex-col items-center gap-12">
      <div className="grid grid-cols-1 tablet:grid-cols-2 laptop:grid-cols-3">
        <YouTubeModalContent videoId={params.videoId} />
      </div>
      <YouTubeDataInput />
    </main>
  );
}
