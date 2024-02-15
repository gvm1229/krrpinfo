import { config } from 'dotenv';
import { MongoClient } from 'mongodb';

// Load environment variables from .env file
config();

const url = process.env.MONGODB_URL;

const mongoClient = async () => {
  if (process.env.NODE_ENV === 'development') {
    if (!global._mongo)
      global._mongo = await new MongoClient(url).connect();

    return global._mongo;
  }
  return new MongoClient(url).connect();
};

export default mongoClient;
