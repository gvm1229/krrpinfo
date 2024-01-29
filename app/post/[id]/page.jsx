import { ObjectId } from 'mongodb';
import Image from 'next/image';
import React from 'react';
import connectDB from '@/db/database';

export default async function Post(props) {
  const db = (await connectDB()).db('blog');
  const result = await db.collection('post').findOne({ _id: new ObjectId(props.params) });

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <Image
        className="relative dark:drop-shadow-[0_0_0.3rem_#ffffff70] dark:invert"
        src="/icons/next.svg"
        alt="Next.js Logo"
        width={180}
        height={37}
        priority
      />
      <h1 className="text-xl font-semibold text-blue-500">
        {`${result.title}: ${result.content}`}
      </h1>
      <h1 className="text-2xl font-bold">Posts Directory</h1>
    </main>
  );
}
