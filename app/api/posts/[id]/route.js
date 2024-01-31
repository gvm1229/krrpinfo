import { ObjectId } from 'mongodb';
import mongoClient from '@/app/api/database';

export async function GET(request, context) {
  const db = (await mongoClient()).db('blog');
  const collection = db.collection('post');
  const data = await collection.findOne({ _id: new ObjectId(context.params.id) });

  return new Response(JSON.stringify(data), {
    status: 200,
  });
}
