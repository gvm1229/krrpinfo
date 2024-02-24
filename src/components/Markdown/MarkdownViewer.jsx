import Markdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';

export default function MarkdownViewer({ content }) {
  return (
    <article className="prose dark:prose-invert">
      <Markdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
      >
        {content}
      </Markdown>
    </article>
  );
}
