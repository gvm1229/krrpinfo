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

// utility function that converts the seconds into HH:MM:SS format
export function convertSecondsToTime(seconds: number, truncate: boolean = true) {
  const roundedSeconds = Math.round(seconds);

  // if 'truncate' is true, then the format should be only M:SS for seconds less than 10 minutes
  // if 'truncate' is true, then the format should be only MM:SS for seconds less than 1 hour.
  // if 'truncate' is true, then the format should be only H:MM:SS for seconds greater than 1 hour but less than 10 hours.
  // if 'truncate' is true, then the format should be only HH:MM:SS for seconds greater than 10 hours.
  if (truncate) {
    if (roundedSeconds < 3600) {
      const minutes = Math.floor(roundedSeconds / 60);
      const remainingSeconds = roundedSeconds % 60;
      return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    } if (roundedSeconds < 36000) {
      const hours = Math.floor(roundedSeconds / 3600);
      const minutes = Math.floor((roundedSeconds % 3600) / 60);
      const remainingSeconds = roundedSeconds % 60;
      return `${hours}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    }
  }

  const hours = Math.floor(roundedSeconds / 3600);
  const minutes = Math.floor((roundedSeconds % 3600) / 60);
  const remainingSeconds = roundedSeconds % 60;
  const formattedTime = `${hours}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  return formattedTime;
}

export function calcStdImageWidth(
  widthInput: number,
  heightInput: number,
  targetHeight: number = 1080,
): number {
  // 498 x 375 (before)
  // 1434 x 1080 (after)

  // return standardWidth
  return widthInput / (heightInput / targetHeight);
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

export function capitalizeFirstLetter(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
