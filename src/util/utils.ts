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

export function dynamicViewport(gridNums: number[]) {
  // if (mobile=1, tablet=2, desktop=3) return '(max-width: 720px) 100vw, (max-width: 1240px) 50vw, 33vw';
  // if (mobile=1, tablet=2, desktop=2) return '(max-width: 720px) 100vw, (max-width: 1240px) 50vw, 50vw';
  // if (mobile=1, tablet=1, desktop=1) return '100vw';

  const baseViewport = 90;
  const calcViewWidth = (viewport: number) => Math.round(baseViewport / viewport);

  return [
    `(max-width: 720px) ${calcViewWidth(gridNums[0])}vw`,
    `(max-width: 1240px) ${calcViewWidth(gridNums[1])}vw`,
    `${calcViewWidth(gridNums[2])}vw`,
  ].join(', ');
}
