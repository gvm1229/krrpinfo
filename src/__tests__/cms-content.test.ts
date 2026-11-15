import { describe, it, expect } from 'vitest';
import { renderBlocks, renderMarkdown, cleanHtml } from '@/src/cms/render';
import { entryInput } from '@/src/cms/schema';
describe('본문 저장 형식과 안전한 표시', () => {
  it('표·접기·YouTube·이미지 표시', () => {
    const p = { type: 'paragraph', children: [{ type: 'text', text: '내용' }] };
    const html = renderBlocks([
      {
        type: 'table',
        children: [{ type: 'table-row', children: [{ type: 'table-cell', children: [p] }] }],
      },
      { type: 'details', summary: '제목', children: [p] },
      { type: 'youtube', videoId: 'AbCdEf12345', children: [{ type: 'text', text: '' }] },
      {
        type: 'image',
        image: { url: 'https://media.example.com/a.png', alternativeText: '설명' },
        children: [{ type: 'text', text: '' }],
      },
    ]);
    expect(html).toContain('<table>');
    expect(html).toContain('<summary>제목</summary>');
    expect(html).toContain('youtube-nocookie.com/embed/AbCdEf12345');
    expect(html).toContain('alt="설명"');
  });
  it('Markdown 제목·목차 주소와 스크립트 제거', () => {
    expect(renderMarkdown('# 제목')).toContain('id="heading-1"');
    expect(cleanHtml('<script>alert(1)</script><p onclick="x">안전</p>')).toBe('<p>안전</p>');
    expect(() =>
      renderBlocks([
        {
          type: 'image',
          image: { url: 'javascript:alert(1)' },
          children: [{ type: 'text', text: '' }],
        },
      ]),
    ).toThrow();
  });
  it('메뉴의 실행 주소와 관리자 링크 거부', () => {
    for (const href of ['javascript:alert(1)', '//example.com', '/admin'])
      expect(
        entryInput.safeParse({
          kind: 'navigation',
          slug: 'nav',
          title: '메뉴',
          position: 0,
          published: true,
          data: { href },
        }).success,
      ).toBe(false);
  });
});

describe('날짜와 대상 데이터 참조', () => {
  it('존재하지 않는 날짜를 거부', () => {
    for (const pubDate of ['2026-02-30', '2026-99-99'])
      expect(
        entryInput.safeParse({
          kind: 'post',
          slug: 'date-check',
          title: '날짜',
          published: false,
          position: 0,
          data: { pubDate },
        }).success,
      ).toBe(false);
  });
});
