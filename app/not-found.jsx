'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useSelectedLayoutSegments } from 'next/navigation';

export default function Notfound() {
  const pathname = usePathname();
  const directoryName = useSelectedLayoutSegments()[0];

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
      <h1 className="text-3xl font-semibold text-red-500">
        404: Not Found
      </h1>
      <Link
        className="rounded-lg bg-green-500 px-3 py-1.5 text-center text-xl font-semibold text-white hover:cursor-pointer hover:bg-green-400"
        href="/"
      >
        Back to home
      </Link>
      <h1 className="text-2xl font-bold">
        Unmapped Directory:
        <span className="ml-2 text-3xl font-extrabold text-blue-500">
          {directoryName !== '__DEFAULT__' ? directoryName : pathname.split('/')[1]}
        </span>
      </h1>
    </main>
  );
}
