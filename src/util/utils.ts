import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { env } from '@/env.mjs';
import type { ClassValue } from 'clsx';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function absoluteUrl(path: string): string {
  return `${env.NEXT_PUBLIC_APP_URL}${path}`;
}

export function formatDate(input: string | number | Date): string {
  const date = new Date(input);
  return date.toLocaleDateString();
}

export function calcStdImageWidth(
  widthInput: number,
  heightInput: number,
): number {
  const standardHeight = 1080;

  // 498 x 375 (before)
  // 1434 x 1080 (after)

  // return standardWidth
  return widthInput / (heightInput / standardHeight);
}
