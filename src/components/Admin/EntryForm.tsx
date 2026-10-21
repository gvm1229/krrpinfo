'use client';
import dynamic from 'next/dynamic';
import { useState, useTransition, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Save, ExternalLink } from 'lucide-react';
import { saveEntry, fetchVideoInfo } from '@/app/admin/actions';
import {
  fields,
  text,
  type Entry,
  type Kind,
  type Json,
  type Media,
  type Field,
} from '@/src/cms/schema';
import { emptyDocument, type CmsBlock } from '@/src/cms/blocks';
import { MediaPicker } from './MediaPicker';
const BlocksEditor = dynamic(() => import('./BlocksEditor').then((module) => module.BlocksEditor), {
  ssr: false,
});
const MarkdownEditor = dynamic(
  () => import('./MarkdownEditor').then((module) => module.MarkdownEditor),
  { ssr: false },
);

// 형식이 있는 콘텐츠 입력 화면
export const EntryForm = ({
  kind,
  initial,
  related,
  media,
}: {
  kind: Kind;
  initial: Entry | null;
  related: Entry[];
  media: Media[];
}) => {
  const router = useRouter();
  const [title, setTitle] = useState(initial?.title ?? '');
  const [slug, setSlug] = useState(initial?.slug ?? '');
  const [published, setPublished] = useState(initial?.published ?? false);
  const [position, setPosition] = useState(initial?.position ?? 0);
  const [data, setData] = useState<Record<string, Json>>(
    initial?.data ?? {
      contentFormat: 'blocks',
      body: emptyDocument() as unknown as Json,
      pubDate: new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Seoul' }).format(new Date()),
    },
  );
  const [error, setError] = useState('');
  const [pending, start] = useTransition();
  const [videoUrl, setVideoUrl] = useState('');
  const update = (key: string, value: Json) =>
    setData((previous) => ({ ...previous, [key]: value }));
  const format = String(data.contentFormat ?? 'blocks');
  const legacy = format.startsWith('legacy-');
  const [showPreview, setShowPreview] = useState(false);
  const fieldInput = (field: Field) => {
    const value = data[field.key];
    const raw = typeof value === 'string' || typeof value === 'number' ? String(value) : '';
    const displayed =
      field.type === 'datetime-local' && raw.endsWith('Z')
        ? new Date(Date.parse(raw) + 9 * 3600000).toISOString().slice(0, 16)
        : raw;
    if (field.type === 'palette' || field.type === 'component' || field.type === 'scope') {
      const options =
        field.type === 'palette'
          ? ['gold', 'green', 'blue', 'sky', 'red', 'yellow', 'purple', 'orange']
          : field.type === 'component'
            ? ['hero', 'countdown', 'links', 'posts', 'timeline']
            : ['video', 'server', 'timeline', 'post'];
      return (
        <select
          aria-label={field.label}
          className="cms-input"
          value={displayed}
          onChange={(event) => update(field.key, event.target.value)}
        >
          <option value="">선택 안 함</option>
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      );
    }
    if (field.type === 'media')
      return (
        <MediaPicker value={displayed} media={media} onChange={(url) => update(field.key, url)} />
      );
    if (field.type === 'checkbox')
      return (
        <input
          aria-label={field.label}
          type="checkbox"
          checked={value === true}
          onChange={(event) => update(field.key, event.target.checked)}
        />
      );
    if (field.type === 'season' || field.type === 'category') {
      const options = related.filter((entry) =>
        field.type === 'season'
          ? entry.kind === 'season'
          : entry.kind === 'category' &&
            text(entry, 'scope') === (kind === 'season' ? 'server' : kind),
      );
      return (
        <select
          aria-label={field.label}
          className="cms-input"
          value={displayed}
          onChange={(event) => update(field.key, event.target.value)}
        >
          <option value="">선택 안 함</option>
          {options.map((option) => (
            <option key={option.id} value={option.id}>
              {option.title}
            </option>
          ))}
        </select>
      );
    }
    if (field.type === 'textarea')
      return (
        <textarea
          aria-label={field.label}
          className="cms-input min-h-28"
          value={displayed}
          onChange={(event) => update(field.key, event.target.value)}
        />
      );
    return (
      <input
        aria-label={field.label}
        className="cms-input"
        required={field.required}
        type={field.type === 'url' ? 'text' : (field.type ?? 'text')}
        value={displayed}
        onChange={(event) =>
          update(
            field.key,
            field.type === 'number' ? Number(event.target.value) : event.target.value,
          )
        }
      />
    );
  };
  return (
    <form
      className="cms-edit-layout"
      onSubmit={(event) => {
        event.preventDefault();
        setError('');
        start(async () => {
          try {
            const id = await saveEntry({
              id: initial?.id,
              kind,
              title,
              slug,
              published,
              position,
              data,
            });
            router.replace('/admin/content/' + kind + '/' + id);
            router.refresh();
          } catch (caught) {
            setError(caught instanceof Error ? caught.message : '저장 실패');
          }
        });
      }}
    >
      <div className="space-y-6">
        <section className="cms-panel space-y-5">
          <label className="cms-label">
            제목
            <input
              className="cms-input"
              required
              value={title}
              onChange={(event) => setTitle(event.target.value)}
            />
          </label>
          <label className="cms-label">
            주소 식별자
            <input
              className="cms-input"
              required
              value={slug}
              readOnly={['post', 'navigation', 'copy'].includes(kind) && Boolean(initial)}
              placeholder="lowercase-with-hyphens"
              onChange={(event) => setSlug(event.target.value)}
            />
          </label>
          {kind === 'video' && (
            <div className="space-y-2">
              <label className="cms-label">
                YouTube 주소
                <input
                  type="url"
                  className="cms-input"
                  value={videoUrl}
                  onChange={(event) => setVideoUrl(event.target.value)}
                />
              </label>
              <button
                type="button"
                className="cms-button"
                disabled={pending || !videoUrl}
                onClick={() =>
                  start(async () => {
                    try {
                      const video = await fetchVideoInfo(videoUrl);
                      setTitle(video.title);
                      setSlug('video-' + video.videoId.toLowerCase());
                      setData((previous) => ({ ...previous, ...video }));
                      setError('');
                    } catch (caught) {
                      setError(caught instanceof Error ? caught.message : '영상 조회 실패');
                    }
                  })
                }
              >
                영상 정보 불러오기
              </button>
            </div>
          )}
          {fields[kind].map((field) => (
            <div key={field.key} className="cms-label">
              {field.label}
              {fieldInput(field)}
            </div>
          ))}
        </section>
        {kind === 'post' && (
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">본문</h2>
              {!initial && (
                <select
                  aria-label="본문 형식"
                  className="cms-input max-w-40"
                  value={format}
                  onChange={(event) => {
                    const nextFormat = event.currentTarget.value;
                    if (
                      !window.confirm('본문 형식을 바꾸면 입력한 본문이 지워집니다. 바꾸시겠어요?')
                    )
                      return;
                    setData((previous) => ({
                      ...previous,
                      contentFormat: nextFormat,
                      body: nextFormat === 'blocks' ? (emptyDocument() as unknown as Json) : '',
                    }));
                  }}
                >
                  <option value="blocks">Blocks</option>
                  <option value="markdown">Markdown</option>
                </select>
              )}
            </div>
            {legacy ? (
              <div className="cms-panel">
                <p>이전 본문은 원문을 보존합니다. 제목·날짜 등 위 정보는 수정할 수 있습니다.</p>
                <pre className="mt-4 max-h-96 overflow-auto whitespace-pre-wrap text-sm">
                  {String(data.body ?? '')}
                </pre>
              </div>
            ) : format === 'markdown' ? (
              <MarkdownEditor
                value={String(data.body ?? '')}
                onChange={(value) => update('body', value)}
              />
            ) : (
              <BlocksEditor
                initial={
                  Array.isArray(data.body) ? (data.body as unknown as CmsBlock[]) : emptyDocument()
                }
                onChange={(value) => update('body', value as unknown as Json)}
                media={media}
              />
            )}
            <button
              type="button"
              className="cms-button cms-secondary"
              onClick={() => setShowPreview(!showPreview)}
            >
              공개 화면 미리보기
            </button>
            {showPreview && <PostPreview format={format} body={data.body} />}
          </section>
        )}
      </div>
      <aside className="cms-panel h-fit space-y-5 tablet:sticky tablet:top-6">
        <h2 className="font-semibold">콘텐츠 상태</h2>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={published}
            onChange={(event) => setPublished(event.target.checked)}
          />
          {published ? 'Published' : 'Draft'}
        </label>
        <p className="text-sm text-muted-foreground">
          {published
            ? '저장하면 공개 화면에 바로 반영됩니다.'
            : '저장한 내용은 방문자에게 보이지 않습니다.'}
        </p>
        <label className="cms-label">
          표시 순서
          <input
            type="number"
            min="0"
            className="cms-input"
            value={position}
            onChange={(event) => setPosition(Number(event.target.value))}
          />
        </label>
        <button type="submit" className="cms-button w-full" disabled={pending}>
          <Save size={16} />
          {pending ? '저장 중…' : '저장'}
        </button>
        {kind === 'post' && initial?.published && (
          <a
            href={'/posts/' + initial.slug}
            target="_blank"
            rel="noreferrer"
            className="cms-button cms-secondary w-full"
          >
            <ExternalLink size={16} />
            공개 글 보기
          </a>
        )}
        {error && (
          <p role="alert" className="break-words text-sm text-red-600">
            {error}
          </p>
        )}
      </aside>
    </form>
  );
};
// 서버와 같은 규칙으로 본문 미리보기
const PostPreview = ({ format, body }: { format: string; body: Json | undefined }) => {
  const [html, setHtml] = useState('');
  const [message, setMessage] = useState('');
  useEffect(() => {
    let active = true;
    const timer = setTimeout(() => {
      void import('@/app/admin/preview')
        .then((module) => module.previewPost(format, body))
        .then((result) => {
          if (active) setHtml(result);
        })
        .catch(() => {
          if (active) setMessage('미리보기를 불러올 수 없습니다.');
        });
    }, 300);
    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [format, body]);
  return (
    <div className="cms-panel">
      <button
        type="button"
        className="cms-button mb-5"
        onClick={async () => {
          try {
            const { previewPost } = await import('@/app/admin/preview');
            setHtml(await previewPost(format, body));
            setMessage('');
          } catch {
            setMessage('이 본문의 미리보기를 불러올 수 없습니다.');
          }
        }}
      >
        미리보기 갱신
      </button>
      {message && <p role="alert">{message}</p>}
      <div className="mdx" dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  );
};
