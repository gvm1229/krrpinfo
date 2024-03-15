import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { env } from '@/env.mjs';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function absoluteUrl(path) {
  return `${env.NEXT_PUBLIC_APP_URL}${path}`;
}

export function formatDate(input) {
  const date = new Date(input);
  return date.toLocaleDateString();
}

export function calcStdImageWidth(widthInput, heightInput) {
  const standardHeight = 1080;

  // 498 x 375 (before)
  // 1434 x 1080 (after)

  // return standardWidth
  return widthInput / (heightInput / standardHeight);
}
