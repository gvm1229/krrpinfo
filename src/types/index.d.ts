// YouTube API types
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
  timestamps?: TimeStamp[];
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
};

export type TimeStamp = {
  title: string;
  seconds: number;
};
