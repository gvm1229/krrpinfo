'use server';
import { requireOwner } from '@/src/cms/repository';
import { renderMarkdown } from '@/src/cms/render';
import { renderBlocks, cleanHtml } from '@/src/cms/render';
import type { Json } from '@/src/cms/schema';

// 운영자 Markdown 미리보기
export const previewMarkdown = async (source: string): Promise<string> => {
  await requireOwner();
  if (source.length > 200000) throw new Error('본문 크기 초과');
  return renderMarkdown(source);
};

// 공개 본문과 같은 규칙으로 미리보기
export const previewPost = async (format: string, body: Json | undefined): Promise<string> => {
  await requireOwner();
  if (JSON.stringify(body ?? '').length > 500000) throw new Error('본문 크기 초과');
  if (format === 'blocks') return renderBlocks(body);
  if (format === 'markdown') return renderMarkdown(String(body ?? ''));
  if (format === 'legacy-html') return cleanHtml(String(body ?? ''));
  throw new Error('기존 본문은 원문 보존');
};
