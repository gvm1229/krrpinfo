import { createBlog, deleteBlogByTitle } from '@/app/actions/blog';

const Input1 = () => {
  async function handleSubmit(formData) {
    'use server';

    await createBlog(formData);
  }

  async function handleDelete(formData) {
    'use server';

    await deleteBlogByTitle(formData);
  }

  return (
    <div>
      <div className="flex flex-col gap-8 md:flex-row">
        <form
          action={handleSubmit}
          className="flex flex-col gap-2"
        >
          <label>
            Blog Title:
            <input
              type="text"
              name="postTitle"
              className="ml-4 bg-gray-200 dark:bg-gray-700 dark:text-white"
            />
          </label>
          <label>
            Blog Content:
            <input
              type="text"
              name="postContent"
              className="ml-4 bg-gray-200 dark:bg-gray-700 dark:text-white"
            />
          </label>
          <button
            type="submit"
            className="rounded-lg bg-green-500 px-3 py-1.5 text-center text-xl font-semibold text-white hover:cursor-pointer hover:bg-green-400"
          >
            Add Blog
          </button>
        </form>
        <form
          action={handleDelete}
          className="flex flex-col gap-2"
        >
          <label>
            Blog Title:
            <input
              type="text"
              name="postTitle"
              className="ml-4 bg-gray-200 dark:bg-gray-700 dark:text-white"
            />
          </label>
          <button
            type="submit"
            className="rounded-lg bg-red-500 px-3 py-1.5 text-center text-xl font-semibold text-white hover:cursor-pointer hover:bg-red-400"
          >
            Delete Blog
          </button>
        </form>
      </div>
    </div>
  );
};

export default Input1;
