import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function Viewer({ content }) {
  return (
    <article className="prose dark:prose-invert">
      <Markdown remarkPlugins={[remarkGfm]}>{content}</Markdown>
    </article>
  );
}
