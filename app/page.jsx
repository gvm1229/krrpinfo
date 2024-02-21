import Image from 'next/image';
import Calendar1 from '@/src/components/Calendar/Calendar1';

export default async function Home() {
  return (
    <main className="container flex h-full flex-col items-center gap-16 p-8 md:p-24">
      <Image
        className="relative dark:drop-shadow-[0_0_0.3rem_#ffffff70] dark:invert"
        src="/icons/next.svg"
        alt="Next.js Logo"
        width={180}
        height={37}
        priority
      />
      <Calendar1 />
      <h1 className="text-2xl font-bold">Testing DEV...</h1>
    </main>
  );
}
