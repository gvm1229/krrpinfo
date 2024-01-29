import Image from 'next/image';
import React from 'react';
// eslint-disable-next-line import/extensions
import connectDB from '@/app/db/database';

export default async function Home() {
  const client = await connectDB();
  const db = client.db('blog');
  const result = await db.collection('post').find().toArray();

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <Image
        className="relative dark:drop-shadow-[0_0_0.3rem_#ffffff70] dark:invert"
        src="/next.svg"
        alt="Next.js Logo"
        width={180}
        height={37}
        priority
      />
      <div className="flex flex-col gap-2">
        {result.map((post) => (
          <h1
            key={post._id}
            className="text-xl font-semibold text-blue-500"
          >
            {`${post.title}: ${post.content}`}
          </h1>
        ))}
      </div>
      <h1 className="text-2xl font-bold">Testing DEV...</h1>
    </main>
  );
}
