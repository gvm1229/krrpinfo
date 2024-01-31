import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { getAllPosts } from '@/app/actions/blog';

export default async function Home() {
  const posts = await getAllPosts();

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
      <div className="flex flex-col gap-2">
        {posts.map((post) => (
          <Link
            href={`/posts/${post._id}`}
            key={post._id}
            prefetch={false}
          >
            <h1
              key={post._id}
              className="rounded-lg bg-blue-500 px-3 py-1.5 text-xl font-semibold text-white hover:cursor-pointer hover:bg-blue-400"
            >
              {`To ${post.title} 리디렉트`}
            </h1>
          </Link>
        ))}
      </div>
      <h1 className="text-2xl font-bold">Testing DEV...</h1>
    </main>
  );
}
