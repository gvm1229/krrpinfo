'use client';
import { useTransition } from 'react';
import { togglePublished } from '@/app/admin/posts/actions';

type Props = {
  slug: string;
  initial: boolean;
};

// published 상태 토글 버튼
export const PublishedToggle = ({ slug, initial }: Props) => {
  const [pending, start] = useTransition();
  return (
    <button
      onClick={() => start(() => togglePublished(slug, !initial))}
      disabled={pending}
      className={`whitespace-nowrap rounded px-3 py-1 text-xs font-medium text-white ${
        initial ? 'bg-emerald-500 hover:bg-emerald-600' : 'bg-zinc-400 hover:bg-zinc-500'
      } disabled:opacity-50`}
    >
      {initial ? 'Published' : 'Draft'}
    </button>
  );
};
