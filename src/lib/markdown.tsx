// MDX 런타임 렌더링 (PortareFolium 완전 이식, KaTeX 제외)
import { unstable_cache } from 'next/cache';
import { evaluate } from '@mdx-js/mdx';
import * as runtime from 'react/jsx-runtime';
import rehypeShiki from '@shikijs/rehype';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import remarkGfm from 'remark-gfm';
import React from 'react';
import { visit } from 'unist-util-visit';
import { directiveToJsx, transformOutsideCodeBlocks } from '@/src/lib/mdx-directive-converter';
import { unescapeJsxBrackets } from '@/src/lib/tiptap-markdown';
import MarkdownImage from '@/components/Markdown/MarkdownImage';

function YouTube({ id }: { id?: string }) {
  if (!id) return null;
  return (
    <div className="youtube-embed-wrapper">
      <iframe
        src={`https://www.youtube.com/embed/${id}`}
        title="YouTube video"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="youtube-embed"
      />
    </div>
  );
}

function ColoredTable({ columns, rows, columnHeadColors }: Record<string, unknown>) {
  function parseArr<T>(v: unknown): T[] {
    if (!v) return [];
    try {
      return typeof v === 'string' ? JSON.parse(v) : (v as T[]);
    } catch {
      return [];
    }
  }

  const headers = parseArr<string>(columns);
  const dataRows = parseArr<string[]>(rows);
  const headColors = columnHeadColors ? parseArr<string>(columnHeadColors) : undefined;
  const NOWRAP = 15;

  const resolvedColors = headers.map((_, i) => {
    const raw = headColors?.[i];
    return raw ? raw.replace(/-\d+$/, '') : null;
  });

  return (
    <div className="colored-table-wrapper">
      <table className="colored-table has-col-colors">
        <thead>
          <tr>
            {headers.map((h, i) => {
              const colorName = resolvedColors[i];
              const cls = ['pt-head-col', h.length <= NOWRAP ? 'ft-nowrap' : '']
                .filter(Boolean)
                .join(' ');
              return (
                <th key={i} className={cls || undefined} data-ct-color={colorName || undefined}>
                  {h}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {dataRows.map((row, rIdx) => (
            <tr key={rIdx}>
              {row.map((cell, i) => {
                const colorName = resolvedColors[i];
                const text = cell || '—';
                const cls = ['pt-body-col', text.length <= NOWRAP ? 'ft-nowrap' : '']
                  .filter(Boolean)
                  .join(' ');
                return (
                  <td key={i} className={cls || undefined} data-ct-color={colorName || undefined}>
                    {text}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Accordion({ title, children }: { title?: string; children?: React.ReactNode }) {
  return (
    <details className="accordion-block">
      <summary className="accordion-summary">
        <svg
          className="accordion-arrow"
          viewBox="0 0 24 24"
          width="16"
          height="16"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M9 6l6 6-6 6" />
        </svg>
        <span>{title || 'Accordion'}</span>
      </summary>
      <div className="accordion-body">{children}</div>
    </details>
  );
}

function Mermaid({ encoded }: { encoded: string }) {
  return <div className="mermaid-pending" data-mermaid-definition={encoded}></div>;
}

// 기존 콘텐츠 호환
function Callout({
  children,
  icon,
  type = 'default',
  ...props
}: {
  icon?: string;
  children?: React.ReactNode;
  type?: 'default' | 'warning' | 'danger';
}) {
  const borderClass =
    type === 'danger'
      ? 'border-red-900 bg-red-50'
      : type === 'warning'
        ? 'border-yellow-900 bg-yellow-50'
        : '';
  return (
    <div
      className={`my-6 flex items-start rounded-md border border-l-4 p-4 ${borderClass}`}
      {...props}
    >
      {icon && <span className="mr-4 text-2xl">{icon}</span>}
      <div>{children}</div>
    </div>
  );
}

// Mermaid 블록 우회 (shiki 호환)
function remarkMermaid() {
  return (tree: unknown) => {
    visit(tree as Parameters<typeof visit>[0], 'code', (node: Record<string, unknown>) => {
      if (node.lang === 'mermaid') {
        const encoded = Buffer.from((node.value as string) || '', 'utf-8').toString('base64');
        node.type = 'mdxJsxFlowElement';
        node.name = 'Mermaid';
        node.attributes = [{ type: 'mdxJsxAttribute', name: 'encoded', value: encoded }];
        node.children = [];
        delete node.lang;
        delete node.meta;
        delete node.value;
      }
    });
  };
}

const components = {
  YouTube,
  ColoredTable,
  FoliumTable: ColoredTable,
  Accordion,
  Mermaid,
  Callout,
  img: MarkdownImage,
  Image: MarkdownImage,
};

// 코드 블록 밖의 홀로 남은 { } 라인 단위 이스케이프
function escapeStrayCurlyBraces(chunk: string): string {
  return chunk
    .split('\n')
    .map((line) => {
      if (/<\w+[\s/>]/.test(line)) return line;
      return line.replace(/(?<!\{)\{(?!\{|\/\*|`)/g, '\\{').replace(/(?<!\})\}(?!\})/g, '\\}');
    })
    .join('\n');
}

const _renderCached = unstable_cache(
  async (_slug: string, content: string) => renderMarkdown(content),
  ['mdx-html'],
  { revalidate: false },
);

// slug + content를 key로 MDX 렌더링 결과 캐싱
export function getCachedMarkdown(slug: string, content: string): Promise<string> {
  return _renderCached(slug, content);
}

export async function renderMarkdown(content: string): Promise<string> {
  let mdx = unescapeJsxBrackets(content);
  mdx = directiveToJsx(mdx);
  mdx = transformOutsideCodeBlocks(mdx, escapeStrayCurlyBraces);
  try {
    mdx = mdx.replace(/^import\s+\S+\s+from\s+['"][^'"]+['"]\s*;?\s*$/gm, '');

    const { default: MDXContent } = await evaluate(mdx, {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ...(runtime as any),
      remarkPlugins: [remarkGfm, remarkMermaid],
      rehypePlugins: [
        [
          rehypeShiki,
          {
            themes: { light: 'github-light', dark: 'github-dark' },
            defaultColor: false,
          },
        ],
        rehypeSlug,
        [rehypeAutolinkHeadings, { behavior: 'wrap' }],
      ],
    });

    const { renderToString } = await import('react-dom/server');
    const html = renderToString(<MDXContent components={components} />);
    return html;
  } catch (e) {
    console.error('MDX Rendering Error:', e);
    const err = e as Record<string, unknown>;
    if (err?.line && err?.column != null) {
      const line = mdx.split('\n')[(err.line as number) - 1] ?? '';
      const col = Number(err.column);
      console.error(
        `[mdx-debug] line ${err.line} col ${col} ± 40:`,
        JSON.stringify(line.substring(Math.max(0, col - 40), col + 40)),
      );
    }
    const cause = err?.cause as Record<string, unknown> | undefined;
    if (cause?.pos != null) {
      const p = Number(cause.pos);
      console.error(
        `[mdx-debug] cause.pos ${p} ± 60:`,
        JSON.stringify(mdx.substring(Math.max(0, p - 60), p + 60)),
      );
    }
    return `<p class="text-red-500">MDX 렌더링 중 오류가 발생했습니다: ${(e as Error).message}</p>`;
  }
}
