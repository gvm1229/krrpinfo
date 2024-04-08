import type { YouTubeVideoItem } from '@/app/actions/youtubeFetch';
import {
  channelId_UC2k5P3gHLWmqDHmyG5iLNfQ,
  channelTitle_UC2k5P3gHLWmqDHmyG5iLNfQ,
  allVideos_UC2k5P3gHLWmqDHmyG5iLNfQ,
} from './UC2k5P3gHLWmqDHmyG5iLNfQ';
import {
  channelId_UCY74n_XQJ69dxNdN7h71wLg,
  channelTitle_UCY74n_XQJ69dxNdN7h71wLg,
  allVideos_UCY74n_XQJ69dxNdN7h71wLg,
} from './UCY74n_XQJ69dxNdN7h71wLg';

export type YouTubeChannel = {
  channelId: string;
  channelTitle: string;
  allVideos: YouTubeVideoItem[];
};

export const allYoutubers: Record<string, YouTubeChannel> = {
  UC2k5P3gHLWmqDHmyG5iLNfQ: {
    channelId: channelId_UC2k5P3gHLWmqDHmyG5iLNfQ,
    channelTitle: channelTitle_UC2k5P3gHLWmqDHmyG5iLNfQ,
    allVideos: allVideos_UC2k5P3gHLWmqDHmyG5iLNfQ,
  },
  UCY74n_XQJ69dxNdN7h71wLg: {
    channelId: channelId_UCY74n_XQJ69dxNdN7h71wLg,
    channelTitle: channelTitle_UCY74n_XQJ69dxNdN7h71wLg,
    allVideos: allVideos_UCY74n_XQJ69dxNdN7h71wLg,
  },
};
