'use client';
import { useRef, useState } from 'react';
import { ImagePlus, Upload, X } from 'lucide-react';
import { prepareUpload, completeUpload } from '@/app/admin/actions';
import type { Media } from '@/src/cms/schema';

// R2 이미지 선택과 전송
export const MediaPicker = ({
  value,
  media,
  onChange,
  compact = false,
}: {
  value: string;
  media: Media[];
  onChange: (url: string, alt?: string) => void;
  compact?: boolean;
}) => {
  const dialog = useRef<HTMLDialogElement>(null);
  const [items, setItems] = useState(media);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [alt, setAlt] = useState('');
  const upload = async (file: File) => {
    setBusy(true);
    setError('');
    try {
      const prepared = await prepareUpload({
        name: file.name,
        contentType: file.type,
        size: file.size,
      });
      const sent = await fetch(prepared.uploadUrl, {
        method: 'PUT',
        body: file,
        headers: { 'Content-Type': file.type },
      });
      if (!sent.ok) throw new Error('파일 전송 실패');
      const result = await completeUpload(prepared.ticket);
      setItems((current) => [result, ...current]);
      onChange(result.url, alt || result.alt);
      dialog.current?.close();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : '파일 전송 실패');
    } finally {
      setBusy(false);
    }
  };
  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        {!compact && (
          <input
            className="cms-input"
            aria-label="이미지 주소"
            value={value}
            onChange={(event) => onChange(event.target.value)}
          />
        )}
        <button type="button" className="cms-button" onClick={() => dialog.current?.showModal()}>
          <ImagePlus size={16} />
          선택
        </button>
      </div>
      {value && <img src={value} alt="" className="max-h-28 rounded object-contain" />}
      <dialog ref={dialog} className="cms-dialog">
        <header className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">미디어 라이브러리</h2>
          <button
            type="button"
            className="cms-button"
            aria-label="닫기"
            onClick={() => dialog.current?.close()}
          >
            <X size={16} />
          </button>
        </header>
        <label className="cms-label mt-5">
          본문 이미지 대체 설명
          <input
            className="cms-input"
            value={alt}
            onChange={(event) => setAlt(event.target.value)}
          />
        </label>
        <label className="cms-button my-5 w-fit cursor-pointer">
          <Upload size={16} />
          {busy ? '전송 중…' : '이미지 올리기'}
          <input
            type="file"
            className="sr-only"
            accept="image/png,image/jpeg,image/webp,image/gif,image/avif"
            disabled={busy}
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) void upload(file);
            }}
          />
        </label>
        {error && (
          <p role="alert" className="text-red-600">
            {error}
          </p>
        )}
        {!items.length && (
          <p className="py-8 text-muted-foreground">이미지를 올려 콘텐츠에 사용할 수 있습니다.</p>
        )}
        <div className="grid grid-cols-2 gap-4 tablet:grid-cols-4">
          {items.map((item) => (
            <button
              type="button"
              key={item.id}
              className="overflow-hidden rounded border p-2 text-left focus-visible:ring-2"
              onClick={() => {
                onChange(item.url, alt || item.alt);
                dialog.current?.close();
              }}
            >
              <img src={item.url} alt={item.alt} className="aspect-square w-full object-cover" />
              <span className="mt-2 block truncate text-xs">{item.name}</span>
            </button>
          ))}
        </div>
      </dialog>
    </div>
  );
};
