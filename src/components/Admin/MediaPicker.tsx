'use client';
import { useId, useRef, useState } from 'react';
import { ImagePlus, Upload } from 'lucide-react';
import { prepareUpload, completeUpload } from '@/app/admin/actions';
import type { Media } from '@/src/cms/schema';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

// R2 이미지 선택과 전송
export const MediaPicker = ({
  value,
  media,
  onChange,
  compact = false,
  inputId,
  label = '이미지',
  triggerLabel = '이미지 선택',
}: {
  value: string;
  media: Media[];
  onChange: (url: string, alt?: string) => void;
  compact?: boolean;
  inputId?: string;
  label?: string;
  triggerLabel?: string;
}) => {
  const id = useId();
  const fileInput = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState(media);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [alt, setAlt] = useState('');
  // 선택한 파일 전송과 이미지 주소 반영
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
      setOpen(false);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : '파일 전송 실패');
    } finally {
      setBusy(false);
      if (fileInput.current) fileInput.current.value = '';
    }
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <div className="min-w-0 space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          {!compact && (
            <Input
              id={inputId ?? id}
              className="cms-input min-w-0 basis-full tablet:flex-1 tablet:basis-0"
              aria-label={label + ' 주소'}
              value={value}
              onChange={(event) => onChange(event.target.value)}
            />
          )}
          <DialogTrigger asChild>
            <Button
              type="button"
              className="cms-button"
              aria-label={triggerLabel === '이미지 선택' ? label + ' 선택' : triggerLabel}
            >
              <ImagePlus size={16} />
              {triggerLabel}
            </Button>
          </DialogTrigger>
        </div>
        {value && <img src={value} alt="" className="max-h-28 max-w-full rounded object-contain" />}
      </div>
      <DialogContent
        aria-describedby={undefined}
        className="cms-dialog !w-[calc(100%-2rem)] !max-w-4xl [&>button]:rounded-md [&>button]:bg-[#666687] [&>button]:p-2 [&>button]:text-white [&>button]:opacity-100"
      >
        <DialogHeader className="pr-10">
          <DialogTitle>미디어 라이브러리</DialogTitle>
        </DialogHeader>
        <div className="flex flex-wrap items-end gap-4">
          <div className="min-w-0 flex-1 basis-56 space-y-2">
            <Label htmlFor={id + '-alt'}>이미지 대체 설명</Label>
            <Input
              id={id + '-alt'}
              className="cms-input"
              value={alt}
              onChange={(event) => setAlt(event.target.value)}
            />
          </div>
          <Button
            type="button"
            className="cms-button"
            disabled={busy}
            onClick={() => fileInput.current?.click()}
          >
            <Upload size={16} />
            {busy ? '전송 중…' : '이미지 올리기'}
          </Button>
          <Input
            ref={fileInput}
            type="file"
            className="hidden"
            aria-label="이미지 파일"
            tabIndex={-1}
            accept="image/png,image/jpeg,image/webp,image/gif,image/avif"
            disabled={busy}
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) void upload(file);
            }}
          />
        </div>
        {error && (
          <p role="alert" className="text-red-600 dark:text-red-400">
            {error}
          </p>
        )}
        {!items.length && (
          <p className="py-8 text-center text-muted-foreground">등록된 이미지가 없습니다.</p>
        )}
        <div className="grid min-w-0 grid-cols-2 gap-4 tablet:grid-cols-4">
          {items.map((item) => (
            <Button
              type="button"
              key={item.id}
              disabled={busy}
              aria-label={item.name + ' 선택'}
              aria-pressed={value === item.url}
              className="cms-button cms-secondary !h-auto min-w-0 !flex-col !items-stretch !gap-2 !p-2 text-left aria-pressed:ring-2 aria-pressed:ring-[#4945ff] aria-pressed:ring-offset-2"
              onClick={() => {
                onChange(item.url, alt || item.alt);
                setOpen(false);
              }}
            >
              <img src={item.url} alt="" className="aspect-square w-full rounded object-cover" />
              <span className="block truncate text-xs">{item.name}</span>
            </Button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};
