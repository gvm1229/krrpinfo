'use client';
import { useState, useTransition } from 'react';
import dynamic from 'next/dynamic';
import { saveEdit } from '@/app/admin/(authenticated)/posts/[slug]/edit/actions';

// SSR 비활성 — window 객체 의존
const Editor = dynamic(() => import('@tinymce/tinymce-react').then((mod) => mod.Editor), {
  ssr: false,
  loading: () => <div className="h-96 animate-pulse rounded-md bg-zinc-100 dark:bg-zinc-800" />,
});

type Initial = {
  slug: string;
  title: string;
  description: string;
  tags: string;
  keywords: string;
  thumbnail: string;
  content: string;
  pubDate: string;
};

const FIELD =
  'block w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/40';
const LABEL = 'text-xs font-medium uppercase tracking-wider text-zinc-500';

// 단일 라인 텍스트 입력 필드
const TextField = ({
  name,
  label,
  defaultValue,
  required = false,
}: {
  name: string;
  label: string;
  defaultValue: string;
  required?: boolean;
}) => (
  <label className="block space-y-1">
    <span className={LABEL}>{label}</span>
    <input name={name} defaultValue={defaultValue} className={FIELD} required={required} />
  </label>
);

export const EditPostForm = ({ initial }: { initial: Initial }) => {
  const [pending, start] = useTransition();
  // TinyMCE content 상태 관리
  const [content, setContent] = useState(initial.content);

  return (
    <form
      action={(formData) => {
        start(() =>
          saveEdit({
            slug: initial.slug,
            title: String(formData.get('title') ?? ''),
            description: String(formData.get('description') ?? ''),
            tags: String(formData.get('tags') ?? ''),
            keywords: String(formData.get('keywords') ?? ''),
            thumbnail: String(formData.get('thumbnail') ?? ''),
            content,
            pubDate: String(formData.get('pubDate') ?? ''),
          }),
        );
      }}
      className="space-y-4"
    >
      <TextField name="title" label="Title" defaultValue={initial.title} required />
      <TextField name="description" label="Description" defaultValue={initial.description} />
      <div className="grid grid-cols-1 gap-4 tablet:grid-cols-2">
        <TextField name="tags" label="Tags (콤마 구분)" defaultValue={initial.tags} />
        <TextField name="keywords" label="Keywords (콤마 구분)" defaultValue={initial.keywords} />
      </div>
      <div className="grid grid-cols-1 gap-4 tablet:grid-cols-2">
        <TextField name="thumbnail" label="Thumbnail URL" defaultValue={initial.thumbnail} />
        <TextField
          name="pubDate"
          label="Pub Date (YYYY-MM-DD)"
          defaultValue={initial.pubDate}
          required
        />
      </div>
      <div className="space-y-1">
        <span className={LABEL}>Content (TinyMCE)</span>
        <Editor
          tinymceScriptSrc="/tinymce/tinymce.min.js"
          initialValue={initial.content}
          onEditorChange={(value: string) => setContent(value)}
          init={{
            height: 600,
            menubar: false,
            language: 'ko_KR',
            language_url: '/tinymce/langs/ko_KR.js',
            skin_url: '/tinymce/skins/lightgray',
            theme_url: '/tinymce/themes/modern/theme.min.js',
            plugins:
              'image link lists charmap code codesample emoticons fullscreen hr searchreplace table textcolor visualblocks wordcount',
            toolbar:
              'undo redo | bold italic underline strikethrough | forecolor backcolor | alignleft aligncenter alignright alignjustify | bullist numlist | link image hr | charmap emoticons codesample | removeformat | code fullscreen',
            branding: false,
            content_style: 'body { font-family: Pretendard, sans-serif; font-size: 14px; }',
            relative_urls: false,
            remove_script_host: true,
          }}
        />
      </div>
      <div className="flex justify-end gap-2">
        <a
          href="/admin/posts"
          className="rounded-md border px-4 py-2 text-sm hover:bg-zinc-50 dark:hover:bg-zinc-900"
        >
          Cancel
        </a>
        <button
          type="submit"
          disabled={pending}
          className="rounded-md bg-brand-blue px-4 py-2 text-sm font-medium text-white hover:bg-brand-blue-hover disabled:opacity-50"
        >
          {pending ? '저장 중…' : '저장'}
        </button>
      </div>
    </form>
  );
};
