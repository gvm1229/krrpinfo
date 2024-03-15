'use server';

import { revalidateTag } from 'next/cache';

export default async function revalidate(path: string) {
  revalidateTag(path);
}
