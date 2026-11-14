import 'server-only';
import { createHash } from 'node:crypto';
import { headers } from 'next/headers';
import { database } from '@/src/cms/client';

// 요청 IP 기준 공개 기능 호출 횟수 제한
export const allowRequest = async (scope: string, max: number, windowSeconds: number) => {
  const requestHeaders = await headers();
  const address =
    requestHeaders.get('x-real-ip') ??
    requestHeaders.get('x-forwarded-for')?.split(',').at(-1)?.trim() ??
    'unknown';
  const key = scope + ':' + createHash('sha256').update(address).digest('hex');
  const { data, error } = await database().rpc('cms_rate_limit', {
    limit_key: key,
    max_attempts: max,
    window_seconds: windowSeconds,
  });
  if (error) {
    console.error('[rate-limit::allowRequest] ' + error.message);
    return false;
  }
  return data === true;
};
