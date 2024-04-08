import mongoClient from '@/src/util/db';

export async function getAllChannels() {
  const db = (await mongoClient()).db('youtubers');

  try {
    const result = await db.collection('channels').find().toArray();
    return result;
  } catch (error) {
    // Handle the error, you can log it or throw a custom error
    throw new Error(`Failed to retrieve all channels: ${error}`);
  }
}

export async function getChannel(id: string) {
  const db = (await mongoClient()).db('youtubers');

  try {
    const result = await db.collection('channels').findOne({ channelId: id });
    return result;
  } catch (error) {
    // Handle the error, you can log it or throw a custom error
    throw new Error(`Failed to retrieve individual channel: ${error}`);
  }
}
