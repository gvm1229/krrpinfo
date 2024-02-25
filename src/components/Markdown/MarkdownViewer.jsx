import Markdown from 'markdown-to-jsx';

export default function MarkdownViewer({ content }) {
  return (
    <article className="prose dark:prose-invert">
      <Markdown>{content}</Markdown>
    </article>
  );
}
