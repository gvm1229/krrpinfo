/* eslint-disable no-undef */

// YouTube API types
export type YouTubeChannelResponse = {
  kind: string;
  etag: string;
  pageInfo: PageInfo;
  items: YouTubeChannelItem[];
};

export type YouTubeChannelItem = {
  kind: string;
  etag: string;
  id: string;
  snippet: YouTubeChannelSnippet;
};

export type YouTubeChannelSnippet = {
  title: string;
  description: string;
  customUrl: string;
  publishedAt: string;
  thumbnails: {
    default: ThumbnailDetail;
    medium: ThumbnailDetail;
    high: ThumbnailDetail;
  };
  localized: Localized;
  country: string;
};

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
  timestamps?: Timestamp[];
  category?: typeof categories[number];
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

// Custom YouTube types
export type YouTubeChannel = {
  channelId: string;
  channelTitle: string;
  allVideos: YouTubeVideoItem[];
  channelDescription?: string;
  customUrl?: string;
  thumbnail?: ThumbnailDetail;
  subscribers?: number;
};

export type Timestamp = {
  title: string;
  seconds: number;
};

export const categories = [
  '현재 시즌',
  '향후 시즌',
  '지난 시즌',
  '팁',
] as const;
