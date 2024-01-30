import { ObjectId } from 'mongodb';
import connectDB from '@/app/api/database';

export async function GET(request, context) {
  const db = (await connectDB()).db('blog');
  const data = await db.collection('post').findOne({ _id: new ObjectId(context.params.id) });

  return new Response(JSON.stringify(data), {
    status: 200,
  });
}
