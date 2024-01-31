import { revalidatePath } from 'next/cache';
import React from 'react';
import { createPost, deletePostByTitle } from '@/app/actions/blog';

const Input1 = () => {
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
    <div>
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
    </div>
  );
};

export default Input1;