import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getBlog } from '@/app/actions/blog';

export const revalidate = 10;

export default async function Blog(props) {
  const blog = await getBlog(props.params.id);

  if (!blog)
    notFound();

  return (
    <main className="container flex flex-col items-center justify-between gap-20 p-8 md:p-24">
      <Image
        className="relative dark:drop-shadow-[0_0_0.3rem_#ffffff70] dark:invert"
        src="/icons/next.svg"
        alt="Next.js Logo"
        width={180}
        height={37}
        priority
      />
      <h1 className="text-xl font-semibold text-blue-500">
        {`${blog.title}: ${blog.content}`}
      </h1>
      <h1 className="text-2xl font-bold">Blogs Directory</h1>
    </main>
  );
}