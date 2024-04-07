import type { YouTubeVideoItem } from '@/app/actions/youtubeFetch';
import {
  channelId_UC2k5P3gHLWmqDHmyG5iLNfQ,
  channelTitle_UC2k5P3gHLWmqDHmyG5iLNfQ,
  allVideos_UC2k5P3gHLWmqDHmyG5iLNfQ,
} from './UC2k5P3gHLWmqDHmyG5iLNfQ';

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
};
