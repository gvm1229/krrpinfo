'use server';

import type { YouTubeChannel, YouTubeVideoItem } from '@/src/types';
import mongoClient from '@/src/util/db';
import { getYouTubeChannelData, getYouTubeChannelSubscribers } from './fetchYouTube';

// YouTube Channel functions

/**
 * Checks if a channel exists in the 'youtubers' database.
 *
 * @param {string} channelId - The ID of the channel to check
 * @return {Promise<boolean>} Whether the channel exists or not
 */
export async function checkIfChannelExists(channelId: string): Promise<boolean> {
  const db = (await mongoClient()).db('youtubers');

  try {
    const result = await db.collection('channels').findOne({ channelId });
    return result !== null;
  } catch (error) {
    // Handle the error, you can log it or throw a custom error
    throw new Error(`Failed to check if channel exists: ${error}`);
  }
}

/**
 * Retrieves all YouTube channels from the database.
 *
 * @return {Promise<YouTubeChannel[]>} An array of YouTube channels.
 */
export async function getAllChannels(): Promise<YouTubeChannel[]> {
  const db = (await mongoClient()).db('youtubers');

  try {
    return db.collection('channels').find().toArray();
  } catch (error) {
    // Handle the error, you can log it or throw a custom error
    throw new Error(`Failed to retrieve all channels: ${error}`);
  }
}

/**
 * Retrieves a YouTube channel from the 'channels' collection in the 'youtubers' database based on the provided channel ID.
 *
 * @param {string} channelId - The unique identifier of the YouTube channel to retrieve.
 * @return {Promise<YouTubeChannel>} The retrieved YouTube channel.
 */
export async function getChannel(channelId: string): Promise<YouTubeChannel | null> {
  const db = (await mongoClient()).db('youtubers');

  try {
    return db.collection('channels').findOne({ channelId });
  } catch (error) {
    // Handle the error, you can log it or throw a custom error
    throw new Error(`Failed to retrieve individual channel: ${error}`);
  }
}

/**
 * Insert a channel into the 'channels' collection in the 'youtubers' database.
 *
 * @param {YouTubeChannel} data - the data to be inserted into the collection
 * return nothing as this function just performs an action
 */
export async function insertOneChannel(data: YouTubeChannel) {
  const db = (await mongoClient()).db('youtubers');

  try {
    const channelRes = await getYouTubeChannelData(data.channelId);
    const subscriberCount = await getYouTubeChannelSubscribers(data.channelId);

    const finalData = {
      ...data,
      channelDescription: 'Sample Description',
      customUrl: channelRes.snippet.customUrl,
      thumbnail: channelRes.snippet.thumbnails.high,
      subscribers: subscriberCount as number,
    } as YouTubeChannel;

    await db.collection('channels').insertOne(finalData);
  } catch (error) {
    // Handle the error, you can log it or throw a custom error
    throw new Error(`Failed to insert channel: ${error}`);
  }
}

/**
 * Edit a YouTube channel in the 'channels' collection of the 'youtubers' database.
 *
 * @param {string} channelId - The ID (YouTube ID, not MongoDB ObjectId) of the channel to be edited
 * @param {YouTubeChannel} newChannelData - The updated data for the channel
 * return nothing as this function just performs an action
 */
export async function editChannel(channelId: string, newChannelData: YouTubeChannel) {
  const db = (await mongoClient()).db('youtubers');

  try {
    await db
      .collection('channels')
      .updateOne({ channelId }, { $set: newChannelData });
  } catch (error) {
    // Handle the error, you can log it or throw a custom error
    throw new Error(`Failed to edit channel: ${error}`);
  }
}

// YouTube Video functions

/**
 * Check if a video exists for a given channel ID.
 *
 * @param {string} channelId - The ID of the channel to check.
 * @param {string} videoId - The ID of the video to check.
 * @return {Promise<boolean>} Whether the video exists for the given channel ID.
 */
export async function checkIfVideoExists(channelId: string, videoId: string): Promise<boolean> {
  const isExistingChannel = await checkIfChannelExists(channelId);

  if (!isExistingChannel)
    return false;

  try {
    const allVideos = await getAllVideos(channelId);
    return allVideos.some((video: YouTubeVideoItem) => video.id === videoId);
  } catch (error) {
    // Handle the error, you can log it or throw a custom error
    throw new Error(`Failed to check if video exists: ${error}`);
  }
}

/**
 * Retrieves all videos for a given channel ID from the database.
 *
 * @param {string} channelId - The ID of the channel to retrieve videos for.
 * @return {Promise<YouTubeVideoItem[]>} The array of YouTube video items for the channel.
 */
export async function getAllVideos(channelId: string): Promise<YouTubeVideoItem[]> {
  const db = (await mongoClient()).db('youtubers');

  try {
    const channel: YouTubeChannel = await db.collection('channels').findOne({ channelId });
    return channel.allVideos;
  } catch (error) {
    // Handle the error, you can log it or throw a custom error
    throw new Error(`Failed to retrieve all videos: ${error}`);
  }
}

export async function getVideosByCategory(channelId: string, category: string): Promise<YouTubeVideoItem[]> {
  const allVideos = await getAllVideos(channelId);
  return allVideos.filter((video: YouTubeVideoItem) => video.category === category);
}

/**
 * Retrieves a specific video based on the channelId and videoId provided.
 *
 * @param {string} channelId - The ID of the YouTube channel.
 * @param {string} videoId - The ID of the YouTube video.
 * @return {Promise<YouTubeVideoItem>} The YouTube video item if found.
 */
export async function getVideo(channelId: string, videoId: string): Promise<YouTubeVideoItem | null> {
  try {
    const allVideos = await getAllVideos(channelId);
    return allVideos.find((video: YouTubeVideoItem) => video.id === videoId);
  } catch (error) {
    // Handle the error, you can log it or throw a custom error
    throw new Error(`Failed to retrieve individual video: ${error}`);
  }
}

/**
 * Insert a video into the 'channels' collection for a specific channel.
 *
 * @param {string} channelId - The ID of the channel where the video will be inserted.
 * @param {YouTubeVideoItem} videoData - The data of the video to be inserted.
 * return nothing as this function just performs an action
 */
export async function insertOneVideo(channelId: string, videoData: YouTubeVideoItem) {
  const db = (await mongoClient()).db('youtubers');

  try {
    await db
      .collection('channels')
      .updateOne({ channelId }, { $push: { allVideos: videoData } });
  } catch (error) {
    // Handle the error, you can log it or throw a custom error
    throw new Error(`Failed to insert video: ${error}`);
  }
}

/**
 * Edit a video for a specific channel in the YouTube database.
 *
 * @param {string} channelId - The ID of the channel
 * @param {string} videoId - The ID of the video to be edited
 * @param {YouTubeVideoItem} newVideoData - The updated video data
 * return nothing as this function just performs an action
 */
export async function editVideo(channelId: string, videoId: string, newVideoData: YouTubeVideoItem) {
  const db = (await mongoClient()).db('youtubers');

  try {
    const allVideos = await getAllVideos(channelId);
    const allVideosExcept = allVideos.filter((video: YouTubeVideoItem) => video.id !== videoId);

    // from allVideos, only edit the entry that matches both the channelId and videoId, and replace it with newVideoData
    await db
      .collection('channels')
      .updateOne({ channelId }, { $set: { allVideos: [...allVideosExcept, newVideoData] } });
  } catch (error) {
    // Handle the error, you can log it or throw a custom error
    throw new Error(`Failed to edit video: ${error}`);
  }
}

// Misc functions to manipulate data

/**
 * Appends timestamps to the given video data.
 *
 * @param {YouTubeVideoItem} videoData - The video data to which timestamps will be added
 * @return {YouTubeVideoItem} The video data with appended timestamps
 */
export async function appendTimestamps(videoData: YouTubeVideoItem): Promise<YouTubeVideoItem> {
  return {
    ...videoData,
    timestamps: [
      {
        title: 'Start',
        seconds: 0,
      },
    ],
  };
}
