import type { Post } from '@/src/types/post';
import { renderBlocks, renderMarkdown, cleanHtml } from './render';
// 저장 형식별 공개 본문 표시
export const renderPostContent = async (post: Post): Promise<string> => {
  if (post.content_format === 'blocks') return renderBlocks(JSON.parse(post.content));
  if (post.content_format === 'markdown') return renderMarkdown(post.content);
  if (post.content_format === 'legacy-html') return cleanHtml(post.content);
  const { getCachedMarkdown } = await import('@/src/lib/markdown');
  return getCachedMarkdown(post.slug, post.content);
};
