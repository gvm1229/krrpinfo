import { MongoClient } from 'mongodb';
import { env } from '@/env.mjs';

// development 환경 MongoClient 캐싱용 global 선언
declare global {
  // eslint-disable-next-line no-var
  var _mongo: MongoClient | undefined;
}

const url = env.MONGODB_URL;

const mongoClient = async () => {
  if (process.env.NODE_ENV === 'development') {
    if (!global._mongo) global._mongo = await new MongoClient(url).connect();

    return global._mongo;
  }
  return new MongoClient(url).connect();
};

export default mongoClient;
