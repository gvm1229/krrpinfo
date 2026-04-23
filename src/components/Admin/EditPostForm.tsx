'use client';
import { useTransition } from 'react';
import { saveEdit } from '@/app/admin/(authenticated)/posts/[slug]/edit/actions';

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

export const EditPostForm = ({ initial }: { initial: Initial }) => {
  const [pending, start] = useTransition();

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
            content: String(formData.get('content') ?? ''),
            pubDate: String(formData.get('pubDate') ?? ''),
          }),
        );
      }}
      className="space-y-4"
    >
      <label className="block space-y-1">
        <span className={LABEL}>Title</span>
        <input name="title" defaultValue={initial.title} className={FIELD} required />
      </label>
      <label className="block space-y-1">
        <span className={LABEL}>Description</span>
        <input name="description" defaultValue={initial.description} className={FIELD} />
      </label>
      <div className="grid grid-cols-1 gap-4 tablet:grid-cols-2">
        <label className="block space-y-1">
          <span className={LABEL}>Tags (콤마 구분)</span>
          <input name="tags" defaultValue={initial.tags} className={FIELD} />
        </label>
        <label className="block space-y-1">
          <span className={LABEL}>Keywords (콤마 구분)</span>
          <input name="keywords" defaultValue={initial.keywords} className={FIELD} />
        </label>
      </div>
      <div className="grid grid-cols-1 gap-4 tablet:grid-cols-2">
        <label className="block space-y-1">
          <span className={LABEL}>Thumbnail URL</span>
          <input name="thumbnail" defaultValue={initial.thumbnail} className={FIELD} />
        </label>
        <label className="block space-y-1">
          <span className={LABEL}>Pub Date (YYYY-MM-DD)</span>
          <input name="pubDate" defaultValue={initial.pubDate} className={FIELD} required />
        </label>
      </div>
      <label className="block space-y-1">
        <span className={LABEL}>Content (MDX)</span>
        <textarea
          name="content"
          defaultValue={initial.content}
          rows={24}
          className={FIELD + ' font-mono text-xs'}
          required
        />
      </label>
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
