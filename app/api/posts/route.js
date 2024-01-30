import connectDB from '@/app/api/database';

export async function GET() {
  const db = (await connectDB()).db('blog');
  const data = await db.collection('post').find().toArray();

  return new Response(JSON.stringify(data), {
    status: 200,
  });
}
