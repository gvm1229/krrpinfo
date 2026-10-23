'use client';
import { useMemo, useRef, useState } from 'react';
import {
  createEditor,
  Editor,
  Element,
  Transforms,
  Node,
  type BaseEditor,
  type Range,
} from 'slate';
import {
  Slate,
  Editable,
  withReact,
  ReactEditor,
  type RenderElementProps,
  type RenderLeafProps,
} from 'slate-react';
import { withHistory, type HistoryEditor } from 'slate-history';
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Undo,
  Redo,
  Link,
  Table,
  Play,
  List,
  ListOrdered,
  Quote,
  Code,
  ChevronsUpDown,
  AlignLeft,
  AlignCenter,
  AlignRight,
  ArrowUp,
  ArrowDown,
} from 'lucide-react';
import { withStrapiSchema } from '@/src/vendor/strapi/withStrapiSchema';
import { emptyDocument, type CmsBlock, type CmsText } from '@/src/cms/blocks';
import { safeUrl, type Media } from '@/src/cms/schema';
import { MediaPicker } from './MediaPicker';

declare module 'slate' {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor & HistoryEditor;
    Element: CmsBlock;
    Text: CmsText;
  }
}
type Mark = 'bold' | 'italic' | 'underline' | 'strikethrough' | 'code';
const leaf = (): CmsText => ({ type: 'text', text: '' });
const paragraph = (): CmsBlock => ({ type: 'paragraph', children: [leaf()] });
// 문서 블록 표시
const Block = ({ attributes, children, element }: RenderElementProps) => {
  const style = { textAlign: element.align };
  switch (element.type) {
    case 'heading': {
      const Tag = ('h' + (element.level ?? 2)) as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
      return (
        <Tag {...attributes} style={style}>
          {children}
        </Tag>
      );
    }
    case 'list':
      return element.format === 'ordered' ? (
        <ol {...attributes}>{children}</ol>
      ) : (
        <ul {...attributes}>{children}</ul>
      );
    case 'list-item':
      return <li {...attributes}>{children}</li>;
    case 'quote':
      return <blockquote {...attributes}>{children}</blockquote>;
    case 'code':
      return (
        <pre {...attributes}>
          <code>{children}</code>
        </pre>
      );
    case 'link':
      return (
        <a {...attributes} href={element.url} onClick={(event) => event.preventDefault()}>
          {children}
        </a>
      );
    case 'image':
      return (
        <div {...attributes}>
          {children}
          <img
            contentEditable={false}
            src={element.image?.url}
            alt={element.image?.alternativeText ?? ''}
            className="max-h-96 max-w-full"
          />
        </div>
      );
    case 'youtube':
      return (
        <div {...attributes}>
          {children}
          <iframe
            contentEditable={false}
            src={'https://www.youtube-nocookie.com/embed/' + element.videoId}
            title="YouTube"
            className="aspect-video w-full"
          />
        </div>
      );
    case 'table':
      return (
        <table {...attributes}>
          <tbody>{children}</tbody>
        </table>
      );
    case 'table-row':
      return <tr {...attributes}>{children}</tr>;
    case 'table-cell':
      return element.header ? (
        <th {...attributes}>{children}</th>
      ) : (
        <td {...attributes}>{children}</td>
      );
    case 'details':
      return (
        <div {...attributes} className="rounded border p-3">
          <div contentEditable={false} className="mb-2 font-semibold">
            {element.summary}
          </div>
          {children}
        </div>
      );
    default:
      return (
        <p {...attributes} style={style}>
          {children}
        </p>
      );
  }
};
// 본문 글자 서식 표시
const Leaf = ({ attributes, children, leaf: value }: RenderLeafProps) => {
  let result = children;
  if (value.bold) result = <strong>{result}</strong>;
  if (value.italic) result = <em>{result}</em>;
  if (value.underline) result = <u>{result}</u>;
  if (value.strikethrough) result = <s>{result}</s>;
  if (value.code) result = <code>{result}</code>;
  return (
    <span {...attributes} style={{ color: value.color, backgroundColor: value.highlight }}>
      {result}
    </span>
  );
};
// Strapi 기반 Slate 편집기와 필요한 추가 블록
export const BlocksEditor = ({
  initial,
  onChange,
  media,
}: {
  initial: CmsBlock[];
  onChange: (value: CmsBlock[]) => void;
  media: Media[];
}) => {
  const editor = useMemo(() => {
    const instance = withStrapiSchema(withHistory(withReact(createEditor())));
    const { isVoid, isInline } = instance;
    instance.isVoid = (element) => ['image', 'youtube'].includes(element.type) || isVoid(element);
    instance.isInline = (element) => element.type === 'link' || isInline(element);
    return instance;
  }, []);
  const savedSelection = useRef<Range | null>(null);
  const [panel, setPanel] = useState<'link' | 'youtube' | 'details' | null>(null);
  const [input, setInput] = useState('');
  const [error, setError] = useState('');
  const focus = () => {
    if (savedSelection.current) Transforms.select(editor, savedSelection.current);
    ReactEditor.focus(editor);
  };
  const insert = (node: CmsBlock) => {
    focus();
    const index = editor.selection ? editor.selection.anchor.path[0] + 1 : editor.children.length;
    Editor.withoutNormalizing(editor, () => {
      Transforms.insertNodes(editor, node, { at: [index] });
      Transforms.insertNodes(editor, paragraph(), { at: [index + 1] });
      Transforms.select(editor, Editor.start(editor, [index + 1]));
    });
  };
  const mark = (key: Mark) => {
    const active = Editor.marks(editor)?.[key];
    if (active) Editor.removeMark(editor, key);
    else Editor.addMark(editor, key, true);
  };
  const changeBlock = (type: CmsBlock['type'], level?: number) => {
    Transforms.unwrapNodes(editor, {
      match: (node) => Element.isElement(node) && node.type === 'list',
      split: true,
    });
    Transforms.setNodes(
      editor,
      { type, level },
      {
        match: (node) =>
          Element.isElement(node) &&
          Editor.isBlock(editor, node) &&
          !['table', 'table-row', 'table-cell'].includes(node.type),
      },
    );
  };
  const setList = (format: 'ordered' | 'unordered') => {
    changeBlock('list-item');
    Transforms.wrapNodes(
      editor,
      { type: 'list', format, children: [] },
      { match: (node) => Element.isElement(node) && node.type === 'list-item' },
    );
  };
  // 선택한 표의 행·열 편집
  const editTable = (operation: 'row' | 'column' | 'remove') => {
    const found = Editor.above(editor, {
      match: (node) => Element.isElement(node) && node.type === 'table',
    });
    if (!found || !Element.isElement(found[0])) return;
    const [table, path] = found;
    if (operation === 'remove') {
      Transforms.removeNodes(editor, { at: path });
      return;
    }
    const rows = table.children.filter(Element.isElement);
    if (operation === 'row') {
      const columns = rows[0]?.children.length ?? 1;
      Transforms.insertNodes(
        editor,
        {
          type: 'table-row',
          children: Array.from({ length: columns }, () => ({
            type: 'table-cell',
            children: [paragraph()],
          })),
        },
        { at: [...path, rows.length] },
      );
    } else {
      Editor.withoutNormalizing(editor, () =>
        rows.forEach((row, index) =>
          Transforms.insertNodes(
            editor,
            { type: 'table-cell', header: index === 0, children: [paragraph()] },
            { at: [...path, index, row.children.length] },
          ),
        ),
      );
    }
    ReactEditor.focus(editor);
  };
  // 선택한 최상위 블록의 순서 변경
  const moveBlock = (offset: number) => {
    if (!editor.selection) return;
    const from = editor.selection.anchor.path[0];
    const to = from + offset;
    if (to < 0 || to >= editor.children.length) return;
    Transforms.moveNodes(editor, { at: [from], to: [to] });
    ReactEditor.focus(editor);
  };
  const button = (label: string, icon: React.ReactNode, action: () => void) => (
    <button
      type="button"
      title={label}
      aria-label={label}
      className="cms-tool"
      onMouseDown={(event) => event.preventDefault()}
      onClick={action}
    >
      {icon}
    </button>
  );
  const open = (next: typeof panel) => {
    savedSelection.current = editor.selection;
    setPanel(next);
    setInput('');
    setError('');
  };
  const accept = () => {
    setError('');
    if (panel === 'link') {
      if (!safeUrl(input) || !input) {
        setError('주소를 확인해 주세요.');
        return;
      }
      focus();
      const label = editor.selection ? Editor.string(editor, editor.selection) : input;
      Transforms.insertNodes(editor, {
        type: 'link',
        url: input,
        children: [{ type: 'text', text: label || input }],
      });
    } else if (panel === 'youtube') {
      let id = '';
      try {
        const url = new URL(input);
        if (['youtube.com', 'www.youtube.com', 'youtu.be'].includes(url.hostname))
          id =
            url.hostname === 'youtu.be' ? url.pathname.slice(1) : (url.searchParams.get('v') ?? '');
      } catch {
        id = input;
      }
      if (!/^[a-zA-Z0-9_-]{11}$/.test(id)) {
        setError('YouTube 주소를 확인해 주세요.');
        return;
      }
      insert({ type: 'youtube', videoId: id, children: [leaf()] });
    } else if (panel === 'details')
      insert({ type: 'details', summary: input, children: [paragraph()] });
    setPanel(null);
  };
  return (
    <div className="cms-editor">
      <Slate
        editor={editor}
        initialValue={initial.length ? initial : emptyDocument()}
        onChange={(value) => {
          savedSelection.current = editor.selection;
          onChange(value as CmsBlock[]);
        }}
      >
        <div className="cms-toolbar" role="toolbar" aria-label="본문 서식">
          <select
            aria-label="본문 종류"
            className="cms-input max-w-36"
            onChange={(event) => {
              const value = event.target.value;
              changeBlock(
                value === 'paragraph' ? 'paragraph' : 'heading',
                Number(value.replace('h', '')) || undefined,
              );
            }}
            defaultValue="paragraph"
          >
            <option value="paragraph">본문</option>
            <option value="h1">제목 1</option>
            <option value="h2">제목 2</option>
            <option value="h3">제목 3</option>
            <option value="h4">제목 4</option>
            <option value="h5">제목 5</option>
            <option value="h6">제목 6</option>
          </select>
          {button('굵게', <Bold size={17} />, () => mark('bold'))}
          {button('기울임', <Italic size={17} />, () => mark('italic'))}
          {button('밑줄', <Underline size={17} />, () => mark('underline'))}
          {button('취소선', <Strikethrough size={17} />, () => mark('strikethrough'))}
          {button('글머리 목록', <List size={17} />, () => setList('unordered'))}
          {button('번호 목록', <ListOrdered size={17} />, () => setList('ordered'))}
          {button('인용', <Quote size={17} />, () => changeBlock('quote'))}
          {button('코드 블록', <Code size={17} />, () => changeBlock('code'))}
          {button('인라인 코드', <Code size={17} />, () => mark('code'))}
          {button('블록 위로', <ArrowUp size={17} />, () => moveBlock(-1))}
          {button('블록 아래로', <ArrowDown size={17} />, () => moveBlock(1))}
          {button('표 행 추가', <Table size={17} />, () => editTable('row'))}
          {button('표 열 추가', <Table size={17} />, () => editTable('column'))}
          {button('표 삭제', <Table size={17} />, () => editTable('remove'))}
          {button('링크', <Link size={17} />, () => open('link'))}
          {button('표 추가', <Table size={17} />, () =>
            insert({
              type: 'table',
              children: Array.from({ length: 3 }, (_, row) => ({
                type: 'table-row',
                children: Array.from({ length: 3 }, () => ({
                  type: 'table-cell',
                  header: row === 0,
                  children: [paragraph()],
                })),
              })),
            }),
          )}
          {button('YouTube', <Play size={17} />, () => open('youtube'))}
          {button('접기', <ChevronsUpDown size={17} />, () => open('details'))}
          {button('왼쪽 정렬', <AlignLeft size={17} />, () =>
            Transforms.setNodes(editor, { align: 'left' }, { match: Element.isElement }),
          )}
          {button('가운데 정렬', <AlignCenter size={17} />, () =>
            Transforms.setNodes(editor, { align: 'center' }, { match: Element.isElement }),
          )}
          {button('오른쪽 정렬', <AlignRight size={17} />, () =>
            Transforms.setNodes(editor, { align: 'right' }, { match: Element.isElement }),
          )}
          <label title="글자색" className="cms-tool">
            A
            <input
              type="color"
              aria-label="글자색"
              className="h-5 w-5"
              onChange={(event) => {
                focus();
                Editor.addMark(editor, 'color', event.target.value);
              }}
            />
          </label>
          <label title="강조색" className="cms-tool">
            가
            <input
              type="color"
              aria-label="강조색"
              className="h-5 w-5"
              onChange={(event) => {
                focus();
                Editor.addMark(editor, 'highlight', event.target.value);
              }}
            />
          </label>
          {button('실행 취소', <Undo size={17} />, () => editor.undo())}
          {button('다시 실행', <Redo size={17} />, () => editor.redo())}
        </div>
        {panel && (
          <div className="flex flex-wrap items-center gap-2 border-b p-3">
            <label className="flex-1">
              {panel === 'details' ? '접기 제목' : '연결 주소'}
              <input
                autoFocus
                className="cms-input"
                value={input}
                onChange={(event) => setInput(event.target.value)}
              />
            </label>
            <button type="button" className="cms-button" onClick={accept}>
              삽입
            </button>
            <button
              type="button"
              className="cms-button cms-secondary"
              onClick={() => setPanel(null)}
            >
              취소
            </button>
            {error && <p role="alert">{error}</p>}
          </div>
        )}
        <Editable
          aria-label="Blocks 본문"
          className="cms-document mdx"
          renderElement={Block}
          renderLeaf={Leaf}
          spellCheck
          onKeyDown={(event) => {
            if ((event.ctrlKey || event.metaKey) && ['b', 'i', 'u'].includes(event.key)) {
              event.preventDefault();
              mark(
                ({ b: 'bold', i: 'italic', u: 'underline' } as const)[event.key as 'b' | 'i' | 'u'],
              );
            }
          }}
        />
      </Slate>
      <div className="border-t p-3">
        <MediaPicker
          compact
          value=""
          media={media}
          onChange={(url, alt) => {
            if (url)
              insert({
                type: 'image',
                image: { url, alternativeText: alt ?? '' },
                children: [leaf()],
              });
          }}
        />
      </div>
    </div>
  );
};
