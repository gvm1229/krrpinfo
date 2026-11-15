'use client';
import { useEffect, useRef, useState } from 'react';
import type { EditorFromTextArea } from 'codemirror';
import 'codemirror5/lib/codemirror.css';

// Strapi 방식 CodeMirror 입력과 미리보기
export const MarkdownEditor = ({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) => {
  const textarea = useRef<HTMLTextAreaElement>(null);
  const current = useRef(onChange);
  const [preview, setPreview] = useState('');
  const [error, setError] = useState('');
  current.current = onChange;
  useEffect(() => {
    let editor: EditorFromTextArea | undefined;
    let disposed = false;
    void import('codemirror5').then(async (module) => {
      await import('codemirror5/mode/markdown/markdown');
      if (disposed || !textarea.current) return;
      editor = module.default.fromTextArea(textarea.current, {
        mode: 'markdown',
        screenReaderLabel: 'Markdown 본문',
        lineNumbers: false,
        lineWrapping: true,
        viewportMargin: Infinity,
      });
      editor.on('change', (instance) => current.current(instance.getValue()));
    });
    return () => {
      disposed = true;
      editor?.toTextArea();
    };
  }, []);
  return (
    <div className="cms-editor">
      <div className="cms-toolbar">
        <strong>Markdown</strong>
        <button
          type="button"
          className="cms-button"
          onClick={async () => {
            try {
              const { previewMarkdown } = await import('@/app/admin/preview');
              setPreview(await previewMarkdown(value));
              setError('');
            } catch {
              setError('미리보기 실패');
            }
          }}
        >
          미리보기
        </button>
      </div>
      <textarea
        ref={textarea}
        defaultValue={value}
        className="cms-input min-h-96"
        aria-label="Markdown 본문"
      />
      {error && <p role="alert">{error}</p>}
      {preview && (
        <div className="mdx border-t p-6" dangerouslySetInnerHTML={{ __html: preview }} />
      )}
    </div>
  );
};
