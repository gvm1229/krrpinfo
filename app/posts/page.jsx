import Image from 'next/image';

export default async function PostsPage() {
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
        <h1 className="flex w-full justify-center text-center">
          Empty posts
        </h1>
      </div>
      <h1 className="text-2xl font-bold">Testing DEV...</h1>
    </main>
  );
}
