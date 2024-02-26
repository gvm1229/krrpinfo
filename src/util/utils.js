import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { env } from '@/env.mjs';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function formatDate(input) {
  const date = new Date(input);
  return date.toLocaleDateString();
}

export function absoluteUrl(path) {
  return `${env.NEXT_PUBLIC_APP_URL}${path}`;
}
