'use server';

import { env } from '@/env.mjs';
import type {
  YouTubeChannelItem, YouTubeChannelResponse, YouTubeVideoItem, YouTubeVideoListResponse,
} from '@/src/types';

/**
 * Retrieves YouTube channel data based on the provided ID.
 *
 * @param {string} id - The ID of the YouTube channel.
 * @return {Promise<YouTubeChannelItem>} The retrieved YouTube channel data.
 */
export async function getYouTubeChannelData(id: string): Promise<YouTubeChannelItem> {
  try {
    const res = await fetch(`https://www.googleapis.com/youtube/v3/channels?part=snippet&id=${id}&key=${env.YOUTUBE_API_KEY}`);

    const data = (await res.json()) as YouTubeChannelResponse;

    return data.items[0];
  } catch (err) {
    throw new Error(`Error fetching YouTube Channel Data: ${err}`);
  }
}

export async function getYouTubeChannelSubscribers(id: string): Promise<number> {
  try {
    const res = await fetch(`https://www.googleapis.com/youtube/v3/channels?part=statistics&id=${id}&key=${env.YOUTUBE_API_KEY}`);
    const data = (await res.json());
    return data.items[0].statistics.subscriberCount;
  } catch (err) {
    throw new Error(`Error fetching YouTube Channel Data: ${err}`);
  }
}

/**
 * Retrieves YouTube video data from the provided URL.
 *
 * @param {string} url - The URL of the YouTube video.
 * @return {Promise<YouTubeVideoItem>} The retrieved YouTube video data.
 */
export async function getYouTubeVideoData(url: string): Promise<YouTubeVideoItem> {
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
    throw new Error(`Error fetching YouTube Video Data: ${err}`);
  }
}

/**
 * Function to extract the video ID from a YouTube URL.
 *
 * @param {string} allUrl - the input URL
 * @return {string | null} the video ID if found, otherwise null
 */
function filteredUrlId(allUrl: string): string | null {
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
