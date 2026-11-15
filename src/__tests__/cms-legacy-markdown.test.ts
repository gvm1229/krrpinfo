import { describe, it, expect, vi } from 'vitest';
const { highlighterLoaded } = vi.hoisted(() => ({ highlighterLoaded: vi.fn() }));
vi.mock('@shikijs/rehype', async (importOriginal) => {
  highlighterLoaded();
  return importOriginal<typeof import('@shikijs/rehype')>();
});
import { renderMarkdown } from '@/src/lib/markdown';

describe('기존 MDX의 본문과 코드 색상 보존', () => {
  it('코드 없는 본문에서 색칠기 로딩 없이 제목·서식·이미지 보존', async () => {
    const html = await renderMarkdown(
      '## 보존 확인\n\n한글 **강조**\n\n![이미지](https://media.example.com/a.webp)',
    );
    expect(html).toContain('보존 확인');
    expect(html).toContain('<strong>강조</strong>');
    expect(html).toContain('src="https://media.example.com/a.webp"');
    expect(html).not.toContain('MDX 렌더링 중 오류');
    expect(highlighterLoaded).not.toHaveBeenCalled();
  });
  it('코드 블록에서 기존 색칠기와 밝은/어두운 색상 유지', async () => {
    const html = await renderMarkdown('```js\nconst value = 1\n```');
    expect(highlighterLoaded).toHaveBeenCalledOnce();
    expect(html).toContain('shiki');
    expect(html).toContain('--shiki-dark');
    expect(html).toContain('value');
    expect(html).not.toContain('MDX 렌더링 중 오류');
  });
});
