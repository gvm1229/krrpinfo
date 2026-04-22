import { MongoMemoryServer } from 'mongodb-memory-server';
import { MongoClient, type Db } from 'mongodb';

export type MongoTestContext = {
  server: MongoMemoryServer;
  client: MongoClient;
  db: Db;
  uri: string;
};

export async function startMongo(dbName = 'krrpinfo'): Promise<MongoTestContext> {
  const server = await MongoMemoryServer.create();
  const uri = server.getUri();
  const client = new MongoClient(uri);
  await client.connect();
  return { server, client, db: client.db(dbName), uri };
}

export async function stopMongo(ctx: MongoTestContext): Promise<void> {
  await ctx.client.close();
  await ctx.server.stop();
}
