import { MongoClient } from 'mongodb';
import { env } from '@/env.mjs';

const url = env.MONGODB_URL;

const mongoClient = async () => {
  if (process.env.NODE_ENV === 'development') {
    if (!global._mongo)
      global._mongo = await new MongoClient(url).connect();

    return global._mongo;
  }
  return new MongoClient(url).connect();
};

export default mongoClient;
