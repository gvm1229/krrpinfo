import mongoClient from '@/app/api/database';

export async function GET() {
  const db = (await mongoClient()).db('blog');
  const collection = db.collection('post');
  const data = await collection.find().toArray();

  return new Response(JSON.stringify(data), {
    status: 200,
  });
}
