'use server';

import mongoClient from '@/src/util/db';
import type { YouTubeVideoItem, YouTubeChannel, TimeStamp } from './fetchYouTube';

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
    return !!result;
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
    const result = await db.collection('channels').find().toArray();
    return result;
  } catch (error) {
    // Handle the error, you can log it or throw a custom error
    throw new Error(`Failed to retrieve all channels: ${error}`);
  }
}

/**
 * Retrieves a YouTube channel from the 'channels' collection in the 'youtubers' database based on the provided channel ID.
 *
 * @param {string} id - The unique identifier of the YouTube channel to retrieve.
 * @return {Promise<YouTubeChannel | null>} The retrieved YouTube channel or null if not found.
 */
export async function getChannel(id: string): Promise<YouTubeChannel | null> {
  const db = (await mongoClient()).db('youtubers');

  try {
    const result = await db.collection('channels').findOne({ channelId: id });
    return result;
  } catch (error) {
    // Handle the error, you can log it or throw a custom error
    throw new Error(`Failed to retrieve individual channel: ${error}`);
  }
}

/**
 * Insert data into the channels collection in the 'youtubers' database.
 *
 * @param {YouTubeChannel} data - the data to be inserted into the collection
 * @return {Promise<void>} a Promise that resolves once the data is inserted
 */
export async function insertToChannels(data: YouTubeChannel) {
  const db = (await mongoClient()).db('youtubers');

  try {
    await db.collection('channels').insertOne(data);
  } catch (error) {
    // Handle the error, you can log it or throw a custom error
    throw new Error(`Failed to insert channel: ${error}`);
  }
}

/**
 * Edit a YouTube channel in the 'channels' collection of the 'youtubers' database.
 *
 * @param {string} id - The ID (YouTube ID, not MongoDB ObjectId) of the channel to be edited
 * @param {YouTubeChannel} data - The updated data for the channel
 * return nothing as this function just performs an action
 */
export async function editChannel(id: string, data: YouTubeChannel) {
  const db = (await mongoClient()).db('youtubers');

  try {
    await db
      .collection('channels')
      .updateOne({ channelId: id }, { $set: data });
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
  const db = (await mongoClient()).db('youtubers');

  try {
    const channel: YouTubeChannel = await db.collection('channels').findOne({ channelId });
    return channel.allVideos.some((video: YouTubeVideoItem) => video.id === videoId);
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

/**
 * Retrieves a specific video based on the channelId and videoId provided.
 *
 * @param {string} channelId - The ID of the YouTube channel
 * @param {string} videoId - The ID of the YouTube video
 * @return {Promise<YouTubeVideoItem | null>} The YouTube video item if found, otherwise null
 */
export async function getVideo(channelId: string, videoId: string): Promise<YouTubeVideoItem | null> {
  const db = (await mongoClient()).db('youtubers');

  try {
    const channel: YouTubeChannel = await db.collection('channels').findOne({ channelId });
    return channel.allVideos.find((video: YouTubeVideoItem) => video.id === videoId);
  } catch (error) {
    // Handle the error, you can log it or throw a custom error
    throw new Error(`Failed to retrieve individual video: ${error}`);
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
  const timestamps: TimeStamp[] = [
    {
      title: 'Start',
      seconds: 0,
    },
  ];

  videoData.timestamps = timestamps;

  return videoData;
}
