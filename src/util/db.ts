import { MongoClient, type MongoClientOptions } from 'mongodb';
import { env } from '@/env.mjs';

// development 환경 MongoClient 캐싱용 global 선언
declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

const url = env.MONGODB_URL;
const options: MongoClientOptions = {
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 5000,
  appName: 'krrpinfo',
};

// NextAuth MongoDBAdapter 및 일반 쿼리용 공유 Promise
export const clientPromise: Promise<MongoClient> =
  process.env.NODE_ENV === 'development'
    ? (global._mongoClientPromise ??= new MongoClient(url, options).connect())
    : new MongoClient(url, options).connect();

// 기존 호출부 호환용 (default export)
/** @deprecated Use named export `clientPromise` instead. Kept for back-compat with handleYTData. */
const mongoClient = async () => clientPromise;
export default mongoClient;
