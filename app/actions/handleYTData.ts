'use server';

import mongoClient from '@/src/util/db';
import type { YouTubeVideoItem, YouTubeChannel } from './fetchYouTube';

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
