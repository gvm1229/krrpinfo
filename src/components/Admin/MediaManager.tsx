'use client';
import { useState, useTransition, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { deleteMedia, saveMediaAlt } from '@/app/admin/actions';
import type { Media } from '@/src/cms/schema';
import { MediaPicker } from './MediaPicker';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
} from '@/components/ui/alert-dialog';

// 미디어 사용과 대체 설명 관리
export const MediaManager = ({ items }: { items: Media[] }) => {
  const [message, setMessage] = useState('');
  const [pending, start] = useTransition();
  const [deleting, setDeleting] = useState<Media | null>(null);
  const router = useRouter();
  const deleteTrigger = useRef<HTMLButtonElement>(null);
  const heading = useRef<HTMLHeadingElement>(null);
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
      <h1 ref={heading} tabIndex={-1} className="text-3xl font-semibold">
        미디어 라이브러리
      </h1>
      <MediaPicker
        compact
        triggerLabel="미디어 추가"
        value=""
        media={items}
        onChange={() => router.refresh()}
      />
      {message && <p role="status">{message}</p>}
      <div className="grid grid-cols-1 gap-5 tablet:grid-cols-2 laptop:grid-cols-3">
        {items.map((item) => (
          <form
            key={item.id}
            className="cms-panel min-w-0 space-y-3"
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
              <Input name="alt" defaultValue={item.alt} className="cms-input" />
            </label>
            <p className="text-xs text-muted-foreground">{Math.ceil(item.size / 1024)} KB</p>
            <div className="flex gap-2">
              <Button type="submit" className="cms-button" disabled={pending}>
                저장
              </Button>
              <Button
                type="button"
                className="cms-button cms-danger"
                disabled={pending}
                onClick={(event) => {
                  deleteTrigger.current = event.currentTarget;
                  setMessage('');
                  setDeleting(item);
                }}
              >
                삭제
              </Button>
            </div>
          </form>
        ))}
      </div>
      <AlertDialog
        open={Boolean(deleting)}
        onOpenChange={(open) => {
          if (!open && !pending) setDeleting(null);
        }}
      >
        <AlertDialogContent
          className="cms-panel"
          onCloseAutoFocus={(event) => {
            event.preventDefault();
            (deleteTrigger.current?.isConnected ? deleteTrigger.current : heading.current)?.focus();
          }}
        >
          <AlertDialogTitle className="text-lg font-semibold">이미지 삭제</AlertDialogTitle>
          <AlertDialogDescription className="break-words">
            ‘{deleting?.name}’을 삭제할까요? 사용 중인 파일은 삭제할 수 없으며, 삭제한 파일은 복구할
            수 없습니다.
          </AlertDialogDescription>
          {message && <p role="alert">{message}</p>}
          <div className="flex justify-end gap-2">
            <AlertDialogCancel asChild>
              <Button type="button" className="cms-button cms-secondary" disabled={pending}>
                취소
              </Button>
            </AlertDialogCancel>
            <AlertDialogAction asChild>
              <Button
                type="button"
                className="cms-button cms-danger"
                disabled={pending}
                onClick={(event) => {
                  event.preventDefault();
                  if (deleting)
                    run(async () => {
                      await deleteMedia(deleting.id);
                      setDeleting(null);
                    });
                }}
              >
                {pending ? '삭제 중…' : '삭제'}
              </Button>
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
