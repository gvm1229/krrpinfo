'use client';
import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { deleteMedia, saveMediaAlt } from '@/app/admin/actions';
import type { Media } from '@/src/cms/schema';
import { MediaPicker } from './MediaPicker';

// 미디어 사용과 대체 설명 관리
export const MediaManager = ({ items }: { items: Media[] }) => {
  const [message, setMessage] = useState('');
  const [pending, start] = useTransition();
  const router = useRouter();
  const run = (action: () => Promise<unknown>) =>
    start(async () => {
      try {
        await action();
        setMessage('변경했습니다.');
        router.refresh();
      } catch (caught) {
        setMessage(caught instanceof Error ? caught.message : '변경 실패');
      }
    });
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-semibold">미디어 라이브러리</h1>
      <MediaPicker compact value="" media={items} onChange={() => router.refresh()} />
      {message && <p role="status">{message}</p>}
      <div className="grid gap-5 tablet:grid-cols-3 laptop:grid-cols-4">
        {items.map((item) => (
          <form
            key={item.id}
            className="cms-panel space-y-3"
            onSubmit={(event) => {
              event.preventDefault();
              const form = new FormData(event.currentTarget);
              run(() => saveMediaAlt(item.id, String(form.get('alt') ?? '')));
            }}
          >
            <img
              src={item.url}
              alt={item.alt}
              className="aspect-square w-full rounded object-cover"
            />
            <p className="truncate font-medium">{item.name}</p>
            <label className="cms-label">
              대체 설명
              <input name="alt" defaultValue={item.alt} className="cms-input" />
            </label>
            <p className="text-xs text-muted-foreground">{Math.ceil(item.size / 1024)} KB</p>
            <div className="flex gap-2">
              <button className="cms-button" disabled={pending}>
                저장
              </button>
              <button
                type="button"
                className="cms-button cms-danger"
                disabled={pending}
                onClick={() => {
                  if (confirm('파일을 삭제할까요? 사용 중인 파일은 삭제할 수 없습니다.'))
                    run(() => deleteMedia(item.id));
                }}
              >
                삭제
              </button>
            </div>
          </form>
        ))}
      </div>
    </div>
  );
};
