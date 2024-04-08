'use server';

import { env } from '@/env.mjs';

export type YouTubeVideoListResponse = {
  kind: string;
  etag: string;
  items: YouTubeVideoItem[];
  pageInfo: PageInfo;
};

export type YouTubeVideoItem = {
  kind: string;
  etag: string;
  id: string;
  snippet: Snippet;
};

export type Snippet = {
  publishedAt: string;
  channelId: string;
  title: string;
  description: string;
  thumbnails: Thumbnails;
  channelTitle: string;
  tags?: string[];
  categoryId: string;
  liveBroadcastContent: string;
  localized: Localized;
  defaultAudioLanguage?: string;
};

export type Thumbnails = {
  default: ThumbnailDetail;
  medium: ThumbnailDetail;
  high: ThumbnailDetail;
  standard?: ThumbnailDetail;
  maxres?: ThumbnailDetail;
};

export type ThumbnailDetail = {
  url: string;
  width: number;
  height: number;
};

export type Localized = {
  title: string;
  description: string;
};

export type PageInfo = {
  totalResults: number;
  resultsPerPage: number;
};

function filteredUrlId(allUrl: string) {
  if (allUrl.indexOf('/watch') > -1) {
    const arr = allUrl.replaceAll(/=|&/g, '?').split('?');
    return arr[arr.indexOf('v') + 1];
  }
  if (allUrl.indexOf('/youtu.be') > -1) {
    const arr = allUrl.replaceAll(/=|&|\//g, '?').split('?');
    return arr[arr.indexOf('youtu.be') + 1];
  }

  return null;
}

export async function getYoutubeData(url: string) {
  try {
    const id = filteredUrlId(url);

    // move to the error branch if id is null
    if (!id) throw new Error('id is null');

    const res = await fetch(`https://www.googleapis.com/youtube/v3/videos?id=${id}&key=${env.YOUTUBE_API_KEY}
      &part=snippet`);

    // receive res as object
    const data = (await res.json()) as YouTubeVideoListResponse;

    return data.items[0];
  } catch (err) {
    throw new Error(`Error fetching YT Data: ${err}`);
  }
}
