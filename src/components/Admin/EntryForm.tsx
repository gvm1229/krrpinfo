'use client';
import dynamic from 'next/dynamic';
import { useState, useTransition, useEffect, useRef } from 'react';
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
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
} from '@/components/ui/alert-dialog';
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
  const formatTrigger = useRef<HTMLButtonElement>(null);
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
  const [showPreview, setShowPreview] = useState(false);
  const [nextFormat, setNextFormat] = useState<string | null>(null);
  const format = String(data.contentFormat ?? 'blocks');
  const legacy = format.startsWith('legacy-');
  // 콘텐츠 필드 값 변경
  const update = (key: string, value: Json) =>
    setData((previous) => ({ ...previous, [key]: value }));
  // 필드 형식별 조작 요소 구성
  const fieldInput = (field: Field) => {
    const value = data[field.key];
    const raw = typeof value === 'string' || typeof value === 'number' ? String(value) : '';
    const displayed =
      field.type === 'datetime-local' && raw.endsWith('Z')
        ? new Date(Date.parse(raw) + 9 * 3600000).toISOString().slice(0, 16)
        : raw;
    const id = 'entry-' + field.key;
    let options: { value: string; label: string }[] | undefined;
    if (field.type === 'palette' || field.type === 'component' || field.type === 'scope') {
      options = (
        field.type === 'palette'
          ? ['gold', 'green', 'blue', 'sky', 'red', 'yellow', 'purple', 'orange']
          : field.type === 'component'
            ? ['hero', 'countdown', 'links', 'posts', 'timeline']
            : ['video', 'server', 'timeline', 'post']
      ).map((option) => ({ value: option, label: option }));
    } else if (field.type === 'season' || field.type === 'category') {
      options = related
        .filter((entry) =>
          field.type === 'season'
            ? entry.kind === 'season'
            : entry.kind === 'category' &&
              text(entry, 'scope') === (kind === 'season' ? 'server' : kind),
        )
        .map((entry) => ({ value: entry.id, label: entry.title }));
    }
    if (options)
      return (
        <Select
          value={displayed || '_none'}
          onValueChange={(value) => update(field.key, value === '_none' ? '' : value)}
        >
          <SelectTrigger id={id} className="cms-input !flex">
            <SelectValue>
              {options.find((option) => option.value === displayed)?.label ?? '선택 안 함'}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="_none">선택 안 함</SelectItem>
            {options.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );
    if (field.type === 'media')
      return (
        <MediaPicker
          inputId={id}
          label={field.label}
          value={displayed}
          media={media}
          onChange={(url) => update(field.key, url)}
        />
      );
    if (field.type === 'checkbox')
      return (
        <Checkbox
          id={id}
          checked={value === true}
          onCheckedChange={(checked) => update(field.key, checked === true)}
        />
      );
    if (field.type === 'textarea')
      return (
        <Textarea
          id={id}
          className="cms-input min-h-28"
          value={displayed}
          onChange={(event) => update(field.key, event.target.value)}
        />
      );
    return (
      <Input
        id={id}
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
  // 입력 이름과 조작 요소 연결
  const renderField = (field: Field) => (
    <div
      key={field.key}
      className={
        field.type === 'checkbox' ? 'flex items-center justify-between gap-3' : 'space-y-2'
      }
    >
      <Label htmlFor={'entry-' + field.key}>{field.label}</Label>
      {fieldInput(field)}
    </div>
  );
  const contentFields =
    kind === 'post'
      ? fields[kind].filter((field) => ['description', 'thumbnail'].includes(field.key))
      : fields[kind];
  const detailFields =
    kind === 'post'
      ? fields[kind].filter((field) => !['description', 'thumbnail'].includes(field.key))
      : [];
  return (
    <form
      className="min-w-0 space-y-6"
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
      <div className="cms-panel sticky top-0 z-20 space-y-2 !py-3">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div className="space-y-1">
            <Label htmlFor="entry-status">공개 상태</Label>
            <Select
              value={published ? 'published' : 'draft'}
              onValueChange={(value) => setPublished(value === 'published')}
            >
              <SelectTrigger
                id="entry-status"
                aria-describedby="entry-status-help"
                className="cms-input !flex !w-36"
              >
                <SelectValue>{published ? 'Published' : 'Draft'}</SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="published">Published</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-wrap gap-2">
            {kind === 'post' && initial?.published && (
              <Button asChild className="cms-button cms-secondary">
                <a href={'/posts/' + initial.slug} target="_blank" rel="noreferrer">
                  <ExternalLink size={16} />
                  공개 글 보기
                </a>
              </Button>
            )}
            <Button type="submit" className="cms-button" disabled={pending}>
              <Save size={16} />
              {pending ? '저장 중…' : '저장'}
            </Button>
          </div>
        </div>
        <p id="entry-status-help" className="text-sm text-muted-foreground">
          {published
            ? '저장하면 공개 화면에 바로 반영됩니다.'
            : '저장한 내용은 방문자에게 보이지 않습니다.'}
        </p>
        {error && (
          <p role="alert" className="break-words text-sm text-red-600 dark:text-red-400">
            {error}
          </p>
        )}
      </div>
      <div className="cms-edit-layout">
        <div className="min-w-0 space-y-6">
          <section className="cms-panel space-y-5">
            <div className="space-y-2">
              <Label htmlFor="entry-title">제목</Label>
              <Input
                id="entry-title"
                className="cms-input"
                required
                value={title}
                onChange={(event) => setTitle(event.target.value)}
              />
            </div>
            {kind === 'video' && (
              <div className="space-y-2">
                <Label htmlFor="entry-video-url">YouTube 주소</Label>
                <Input
                  id="entry-video-url"
                  type="url"
                  className="cms-input"
                  value={videoUrl}
                  onChange={(event) => setVideoUrl(event.target.value)}
                />
                <Button
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
                </Button>
              </div>
            )}
            {contentFields.map(renderField)}
          </section>
          {kind === 'post' && (
            <section className="space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h2 className="text-lg font-semibold">본문</h2>
                {!initial && (
                  <Select value={format} onValueChange={setNextFormat}>
                    <SelectTrigger
                      ref={formatTrigger}
                      aria-label="본문 형식"
                      className="cms-input !flex !w-40"
                    >
                      <SelectValue>{format === 'blocks' ? 'Blocks' : 'Markdown'}</SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="blocks">Blocks</SelectItem>
                      <SelectItem value="markdown">Markdown</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              </div>
              {legacy ? (
                <div className="cms-panel">
                  <p>이전 본문은 원문을 보존합니다. 제목·날짜 등 다른 정보는 수정할 수 있습니다.</p>
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
                    Array.isArray(data.body)
                      ? (data.body as unknown as CmsBlock[])
                      : emptyDocument()
                  }
                  onChange={(value) => update('body', value as unknown as Json)}
                  media={media}
                />
              )}
              <Button
                type="button"
                className="cms-button cms-secondary"
                aria-expanded={showPreview}
                aria-controls="post-preview"
                onClick={() => setShowPreview(!showPreview)}
              >
                {showPreview ? '미리보기 닫기' : '공개 화면 미리보기'}
              </Button>
              {showPreview && (
                <div id="post-preview">
                  <PostPreview format={format} body={data.body} />
                </div>
              )}
            </section>
          )}
        </div>
        <aside className="cms-panel min-w-0 h-fit space-y-5">
          <h2 className="font-semibold">콘텐츠 정보</h2>
          <div className="space-y-2">
            <Label htmlFor="entry-slug">주소 식별자</Label>
            <Input
              id="entry-slug"
              className="cms-input"
              required
              value={slug}
              readOnly={['post', 'navigation', 'copy'].includes(kind) && Boolean(initial)}
              placeholder="lowercase-with-hyphens"
              onChange={(event) => setSlug(event.target.value)}
            />
          </div>
          {detailFields.map(renderField)}
          <div className="space-y-2">
            <Label htmlFor="entry-position">표시 순서</Label>
            <Input
              id="entry-position"
              type="number"
              min="0"
              className="cms-input"
              value={position}
              onChange={(event) => setPosition(Number(event.target.value))}
            />
          </div>
        </aside>
      </div>
      <AlertDialog
        open={nextFormat !== null}
        onOpenChange={(open) => {
          if (!open) setNextFormat(null);
        }}
      >
        <AlertDialogContent
          className="cms-panel"
          onCloseAutoFocus={(event) => {
            event.preventDefault();
            formatTrigger.current?.focus();
          }}
        >
          <AlertDialogTitle className="text-lg font-semibold">본문 형식 변경</AlertDialogTitle>
          <AlertDialogDescription>
            본문 형식을 바꾸면 입력한 본문이 지워집니다. 바꾸시겠어요?
          </AlertDialogDescription>
          <div className="flex justify-end gap-2">
            <AlertDialogCancel asChild>
              <Button type="button" className="cms-button cms-secondary">
                취소
              </Button>
            </AlertDialogCancel>
            <AlertDialogAction asChild>
              <Button
                type="button"
                className="cms-button cms-danger"
                onClick={() => {
                  if (nextFormat)
                    setData((previous) => ({
                      ...previous,
                      contentFormat: nextFormat,
                      body: nextFormat === 'blocks' ? (emptyDocument() as unknown as Json) : '',
                    }));
                }}
              >
                형식 변경
              </Button>
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
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
      <Button
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
      </Button>
      {message && <p role="alert">{message}</p>}
      <div className="mdx" dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  );
};
