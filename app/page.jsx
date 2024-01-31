import { revalidatePath } from 'next/cache';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { createPost, deletePostByTitle, getAllPosts } from '@/app/actions/blog';

export default async function Home() {
  const posts = await getAllPosts();

  async function handleSubmit(formData) {
    'use server';

    await createPost(formData);
    revalidatePath('/');
  }

  async function handleDelete(formData) {
    'use server';

    await deletePostByTitle(formData);
    revalidatePath('/');
  }

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
      <div className="grid grid-cols-2 gap-4">
        {posts.map((post) => (
          <Link
            href={`/posts/${post._id}`}
            key={post._id}
            prefetch={false}
          >
            <h1
              key={post._id}
              className="rounded-lg bg-blue-500 px-3 py-1.5 text-center text-xl font-semibold text-white hover:cursor-pointer hover:bg-blue-400"
            >
              {`To ${post.title} 리디렉트`}
            </h1>
          </Link>
        ))}
      </div>
      <div className="flex gap-10">
        <form
          action={handleSubmit}
          className="flex flex-col gap-2"
        >
          <label>
            Post Title:
            <input
              type="text"
              name="postTitle"
              className="ml-4 text-black"
            />
          </label>
          <label>
            Post Content:
            <input
              type="text"
              name="postContent"
              className="ml-4 text-black"
            />
          </label>
          <button
            type="submit"
            className="rounded-lg bg-green-500 px-3 py-1.5 text-center text-xl font-semibold text-white hover:cursor-pointer hover:bg-green-400"
          >
            Add Post
          </button>
        </form>
        <form
          action={handleDelete}
          className="flex flex-col gap-2"
        >
          <label>
            Post Title:
            <input
              type="text"
              name="postTitle"
              className="ml-4 text-black"
            />
          </label>
          <button
            type="submit"
            className="rounded-lg bg-red-500 px-3 py-1.5 text-center text-xl font-semibold text-white hover:cursor-pointer hover:bg-red-400"
          >
            Delete Post
          </button>
        </form>
      </div>
      <h1 className="text-2xl font-bold">Testing DEV...</h1>
    </main>
  );
}
