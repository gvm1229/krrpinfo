import Image from 'next/image';
import React from 'react';

async function getPost(id) {
  const response = await fetch(`http://localhost:3000/api/posts/${id}`, { cache: 'no-store' });
  return response.json();
}

export default async function Post(props) {
  const post = await getPost(props.params.id);

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
        {`${post.title}: ${post.content}`}
      </h1>
      <h1 className="text-2xl font-bold">Posts Directory</h1>
    </main>
  );
}
