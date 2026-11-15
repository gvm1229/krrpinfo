import MarkdownIt from 'markdown-it';
import sanitizeHtml from 'sanitize-html';
import { validateDocument, type CmsNode } from './blocks';

// 본문 문자 이스케이프
const escape = (value: string): string =>
  value.replace(
    /[&<>"']/g,
    (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]!,
  );
// 안전한 본문 HTML 정리
export const cleanHtml = (html: string) =>
  sanitizeHtml(html, {
    allowedTags: [
      ...sanitizeHtml.defaults.allowedTags,
      'img',
      'details',
      'summary',
      'iframe',
      'h1',
      'h2',
    ],
    allowedAttributes: {
      ...sanitizeHtml.defaults.allowedAttributes,
      '*': ['id', 'class'],
      span: ['style'],
      p: ['style'],
      h1: ['id', 'style'],
      h2: ['id', 'style'],
      h3: ['id', 'style'],
      img: ['src', 'alt', 'width', 'height', 'loading'],
      iframe: ['src', 'title', 'allowfullscreen', 'loading'],
      th: ['style'],
      td: ['style'],
    },
    allowedStyles: {
      '*': {
        color: [/^#[0-9a-f]{6}$/i],
        'background-color': [/^#[0-9a-f]{6}$/i],
        'text-align': [/^(left|center|right)$/],
      },
    },
    allowedIframeHostnames: ['www.youtube.com', 'www.youtube-nocookie.com'],
    allowedSchemes: ['http', 'https', 'mailto', 'tel'],
  });
// Strapi 문서 블록을 공개 HTML로 표시
export const renderBlocks = (value: unknown): string => {
  const nodes = validateDocument(value);
  let heading = 0;
  const render = (node: CmsNode): string => {
    if ('text' in node) {
      let content = escape(node.text);
      if (node.bold) content = '<strong>' + content + '</strong>';
      if (node.italic) content = '<em>' + content + '</em>';
      if (node.underline) content = '<u>' + content + '</u>';
      if (node.strikethrough) content = '<s>' + content + '</s>';
      if (node.code) content = '<code>' + content + '</code>';
      if (node.color || node.highlight)
        content =
          '<span style="' +
          (node.color ? 'color:' + node.color + ';' : '') +
          (node.highlight ? 'background-color:' + node.highlight + ';' : '') +
          '">' +
          content +
          '</span>';
      return content;
    }
    const content = node.children.map(render).join('');
    const alignment = node.align ? ' style="text-align:' + node.align + '"' : '';
    switch (node.type) {
      case 'heading': {
        const tag = 'h' + (node.level ?? 2);
        return (
          '<' +
          tag +
          ' id="heading-' +
          ++heading +
          '"' +
          alignment +
          '>' +
          content +
          '</' +
          tag +
          '>'
        );
      }
      case 'list': {
        const tag = node.format === 'ordered' ? 'ol' : 'ul';
        return '<' + tag + '>' + content + '</' + tag + '>';
      }
      case 'list-item':
        return '<li>' + content + '</li>';
      case 'quote':
        return '<blockquote>' + content + '</blockquote>';
      case 'code':
        return '<pre><code>' + content + '</code></pre>';
      case 'link':
        return (
          '<a href="' + escape(node.url ?? '') + '" rel="noopener noreferrer">' + content + '</a>'
        );
      case 'image':
        return (
          '<img loading="lazy" src="' +
          escape(node.image?.url ?? '') +
          '" alt="' +
          escape(node.image?.alternativeText ?? '') +
          '">'
        );
      case 'youtube':
        return (
          '<iframe loading="lazy" class="youtube-embed" src="https://www.youtube-nocookie.com/embed/' +
          node.videoId +
          '" title="YouTube" allowfullscreen></iframe>'
        );
      case 'table':
        return '<table><tbody>' + content + '</tbody></table>';
      case 'table-row':
        return '<tr>' + content + '</tr>';
      case 'table-cell': {
        const tag = node.header ? 'th' : 'td';
        return '<' + tag + '>' + content + '</' + tag + '>';
      }
      case 'details':
        return (
          '<details><summary>' + escape(node.summary ?? '') + '</summary>' + content + '</details>'
        );
      default:
        return '<p' + alignment + '>' + content + '</p>';
    }
  };
  return cleanHtml(nodes.map(render).join(''));
};
// Strapi 방식 Markdown 미리보기
export const renderMarkdown = (source: string): string => {
  let heading = 0;
  const md = new MarkdownIt({ html: false, breaks: true, linkify: true });
  md.renderer.rules.heading_open = (tokens, index) =>
    '<' + tokens[index].tag + ' id="heading-' + ++heading + '">';
  return cleanHtml(md.render(source));
};
