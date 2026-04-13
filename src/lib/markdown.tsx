// MDX 런타임 렌더링 (PortareFolium 패턴)
import { unstable_cache } from 'next/cache';
import { evaluate } from '@mdx-js/mdx';
import * as runtime from 'react/jsx-runtime';
import rehypeShiki from '@shikijs/rehype';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import remarkGfm from 'remark-gfm';
import React from 'react';

// renderToString에서 next/image 사용 불가 → 순수 <img> 사용
function MdxImage({ className, alt, src, width, height, ...props }: any) {
  return (
    <img
      className={`rounded-md border ${className ?? ''}`}
      alt={alt ?? ''}
      src={src}
      width={width}
      height={height}
      loading="lazy"
      {...props}
    />
  );
}

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

function Placeholder({ height }: { height: string }) {
  return (
    <div
      className={`mt-10 flex ${height} items-center justify-center bg-zinc-100 dark:bg-zinc-800`}
    >
      <span className="text-lg font-semibold">flex container with a height of {height}</span>
    </div>
  );
}

const components = {
  Image: MdxImage,
  img: MdxImage,
  Callout,
  Placeholder,
};

// slug + content를 key로 MDX 렌더링 결과 캐싱
const _renderCached = unstable_cache(
  async (_slug: string, content: string) => renderMarkdown(content),
  ['mdx-html'],
  { revalidate: false },
);

export function getCachedMarkdown(slug: string, content: string): Promise<string> {
  return _renderCached(slug, content);
}

export async function renderMarkdown(content: string): Promise<string> {
  try {
    // import 문 제거 (런타임에서 파일시스템 접근 불가)
    let mdx = content.replace(/^import\s+\S+\s+from\s+['"][^'"]+['"]\s*;?\s*$/gm, '');

    const { default: MDXContent } = await evaluate(mdx, {
      ...(runtime as any),
      remarkPlugins: [remarkGfm],
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
    return `<p class="text-red-500">MDX 렌더링 중 오류 발생: ${(e as Error).message}</p>`;
  }
}
