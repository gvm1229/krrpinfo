import { describe, it, expect } from 'vitest';
import { toCnUpdates } from '@/components/CnPreview/cn-updates';
import type { Entry } from '@/src/cms/schema';
// 시험용 CMS 항목 생성
const entry = (slug: string, data: Entry['data']): Entry => ({
  id: slug,
  kind: 'cn_update',
  slug,
  title: slug,
  published: true,
  position: 0,
  data,
  created_at: '',
  updated_at: '',
});
describe('중국 서버 소식 변환', () => {
  it('게시일 최신순 정렬과 줄 단위 본문·https 이미지만 사용', () => {
    const [first, second] = toCnUpdates([
      entry('old', { publishedAt: '2026-10-01', body: '', images: '' }),
      entry('new', {
        publishedAt: '2026-11-01',
        body: '첫 줄\n\n 둘째 줄 ',
        images: 'https://a.example/1.png\nhttp://b.example/2.png\njavascript:alert(1)',
      }),
    ]);
    expect(first.slug).toBe('new');
    expect(first.body).toEqual(['첫 줄', '둘째 줄']);
    expect(first.images).toEqual(['https://a.example/1.png']);
    expect(second.slug).toBe('old');
  });
});
