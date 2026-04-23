import { describe, expect, it, vi } from 'vitest';

// env.mjs 유효성 검사 우회
vi.mock('@/env.mjs', () => ({
  env: { NEXT_PUBLIC_APP_URL: 'http://localhost:3000' },
}));

import { formatDate } from '@/src/util/utils';

describe('formatDate', () => {
  it('ISO 문자열 입력 → YYYY-MM-DD 반환', () => {
    // UTC 기준 2024-04-29T00:00:00Z → 한국(KST+9) 로컬에서는 2024-04-29
    const result = formatDate('2024-04-29T00:00:00Z');
    expect(result).toBe('2024-04-29');
  });

  it('월/일 한 자리 → 0 패딩', () => {
    // new Date(2024, 3, 5) → 2024년 4월 5일 (로컬 기준)
    expect(formatDate(new Date(2024, 3, 5))).toBe('2024-04-05');
  });

  it('12월 31일 → 올바른 포맷', () => {
    expect(formatDate(new Date(2024, 11, 31))).toBe('2024-12-31');
  });

  it('epoch 0 → 로컬 timezone 기준 날짜 (1970-01-01 또는 1969-12-31 허용)', () => {
    const result = formatDate(0);
    expect(['1970-01-01', '1969-12-31']).toContain(result);
  });
});
