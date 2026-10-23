import { z } from 'zod';
import { safeUrl } from './schema';

export type CmsText = {
  type: 'text';
  text: string;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  strikethrough?: boolean;
  code?: boolean;
  color?: string;
  highlight?: string;
};
export type CmsBlock = {
  type:
    | 'paragraph'
    | 'heading'
    | 'list'
    | 'list-item'
    | 'quote'
    | 'code'
    | 'image'
    | 'link'
    | 'table'
    | 'table-row'
    | 'table-cell'
    | 'youtube'
    | 'details';
  children: (CmsBlock | CmsText)[];
  level?: number;
  format?: 'ordered' | 'unordered';
  url?: string;
  image?: { url: string; alternativeText?: string };
  videoId?: string;
  summary?: string;
  align?: 'left' | 'center' | 'right';
  header?: boolean;
};
export type CmsNode = CmsBlock | CmsText;
const nodeSchema: z.ZodType<CmsNode> = z.lazy(() =>
  z.union([
    z
      .object({
        type: z.literal('text'),
        text: z.string().max(200000),
        bold: z.boolean().optional(),
        italic: z.boolean().optional(),
        underline: z.boolean().optional(),
        strikethrough: z.boolean().optional(),
        code: z.boolean().optional(),
        color: z
          .string()
          .regex(/^#[0-9a-fA-F]{6}$/)
          .optional(),
        highlight: z
          .string()
          .regex(/^#[0-9a-fA-F]{6}$/)
          .optional(),
      })
      .strict(),
    z
      .object({
        type: z.enum([
          'paragraph',
          'heading',
          'list',
          'list-item',
          'quote',
          'code',
          'image',
          'link',
          'table',
          'table-row',
          'table-cell',
          'youtube',
          'details',
        ]),
        children: z.array(nodeSchema).min(1).max(10000),
        level: z.number().int().min(1).max(6).optional(),
        format: z.enum(['ordered', 'unordered']).optional(),
        url: z.string().refine(safeUrl).optional(),
        image: z
          .object({
            url: z
              .string()
              .refine(
                (value) =>
                  safeUrl(value) && !value.startsWith('mailto:') && !value.startsWith('tel:'),
              ),
            alternativeText: z.string().optional(),
          })
          .optional(),
        videoId: z
          .string()
          .regex(/^[a-zA-Z0-9_-]{11}$/)
          .optional(),
        summary: z.string().max(500).optional(),
        align: z.enum(['left', 'center', 'right']).optional(),
        header: z.boolean().optional(),
      })
      .strict(),
  ]),
);
// 저장할 Slate 문서 검증
export const validateDocument = (value: unknown): CmsBlock[] => {
  const nodes = z.array(nodeSchema).min(1).max(10000).parse(value);
  if (nodes.some((node) => 'text' in node)) throw new Error('본문 최상위 블록 필요');
  return nodes as CmsBlock[];
};
// 빈 Strapi 형식 문서
export const emptyDocument = (): CmsBlock[] => [
  { type: 'paragraph', children: [{ type: 'text', text: '' }] },
];
