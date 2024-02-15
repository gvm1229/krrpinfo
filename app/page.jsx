import Image from 'next/image';
import Link from 'next/link';
import { getAllPosts } from '@/app/actions/blog';
import Input1 from '@/src/components/Input1';

export const revalidate = 10;

export default async function Home() {
  const posts = await getAllPosts();

  return (
    <main className="container flex h-full flex-col items-center justify-between gap-16 p-8 md:p-24">
      <Image
        className="relative dark:drop-shadow-[0_0_0.3rem_#ffffff70] dark:invert"
        src="/icons/next.svg"
        alt="Next.js Logo"
        width={180}
        height={37}
        priority
      />
      <div className="grid gap-4 md:grid-cols-2">
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
      <Input1 />
      <h1 className="text-2xl font-bold">Testing DEV...</h1>
    </main>
  );
}
