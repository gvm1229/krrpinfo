import { describe, it, expect, vi } from 'vitest';
vi.mock('@/env.mjs', () => ({ env: { NEXT_PUBLIC_APP_URL: 'https://example.com' } }));
import { formatDate } from '@/src/util/utils';

describe('공개 날짜의 한국 시간 표시', () => {
  it('UTC 날짜 경계에서도 한국 날짜 유지', () => {
    expect(formatDate('2026-10-20T14:59:59.000Z')).toBe('2026-10-20');
    expect(formatDate('2026-10-20T15:00:00.000Z')).toBe('2026-10-21');
  });
  it('날짜 문자열·Date·숫자 입력 지원', () => {
    expect(formatDate('2026-10-21')).toBe('2026-10-21');
    expect(formatDate(new Date('2026-10-20T15:00:00.000Z'))).toBe('2026-10-21');
    expect(formatDate(Date.parse('2026-10-20T15:00:00.000Z'))).toBe('2026-10-21');
  });
});
