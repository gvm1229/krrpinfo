'use client';
import Link from 'next/link';
import { useState, useTransition, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Search, Pencil, Trash2 } from 'lucide-react';
import { deleteEntry, setEntryPublished } from '@/app/admin/actions';
import { kindLabels, type Entry, type Kind } from '@/src/cms/schema';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
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

// 콘텐츠 검색·공개 상태·목록 관리
export const ContentList = ({ kind, entries }: { kind: Kind; entries: Entry[] }) => {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [page, setPage] = useState(0);
  const [error, setError] = useState('');
  const [deleting, setDeleting] = useState<Entry | null>(null);
  const [pending, start] = useTransition();
  const router = useRouter();
  const deleteTrigger = useRef<HTMLButtonElement>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const filtered = entries.filter(
    (entry) =>
      entry.title.toLowerCase().includes(search.toLowerCase()) &&
      (status === 'all' || entry.published === (status === 'published')),
  );
  const pageCount = Math.max(1, Math.ceil(filtered.length / 20));
  const currentPage = Math.min(page, pageCount - 1);
  // 변경 결과와 실패 안내 갱신
  const run = (action: () => Promise<unknown>) =>
    start(async () => {
      try {
        await action();
        setError('');
        router.refresh();
      } catch (caught) {
        setError(caught instanceof Error ? caught.message : '작업 실패');
      }
    });
  return (
    <div className="min-w-0 space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-baseline gap-3">
          <h1 ref={heading} tabIndex={-1} className="text-3xl font-semibold">
            {kindLabels[kind]}
          </h1>
          <span className="text-sm text-muted-foreground">{filtered.length}개</span>
        </div>
        <Button asChild className="cms-button">
          <Link href={'/admin/content/' + kind + '/new'}>
            <Plus size={16} />
            {kindLabels[kind]} 추가
          </Link>
        </Button>
      </header>
      <div className="flex flex-wrap gap-3">
        <div className="relative min-w-0 basis-full tablet:flex-1 tablet:basis-auto">
          <Search
            size={18}
            aria-hidden="true"
            className="pointer-events-none absolute left-3 top-3"
          />
          <Input
            className="cms-input !pl-10"
            placeholder="제목 검색"
            aria-label="제목 검색"
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setPage(0);
            }}
          />
        </div>
        <Select
          value={status}
          onValueChange={(value) => {
            setStatus(value);
            setPage(0);
          }}
        >
          <SelectTrigger aria-label="공개 상태 필터" className="cms-input !flex !w-40">
            <SelectValue>
              {status === 'all' ? '전체 상태' : status === 'published' ? 'Published' : 'Draft'}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">전체 상태</SelectItem>
            <SelectItem value="published">Published</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
          </SelectContent>
        </Select>
      </div>
      {error && !deleting && (
        <p role="alert" className="text-red-600 dark:text-red-400">
          {error}
        </p>
      )}
      <div className="cms-panel min-w-0 overflow-x-auto !p-0">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b">
              <th scope="col" className="px-5 py-4">
                제목
              </th>
              <th scope="col" className="px-5 py-4">
                상태
              </th>
              <th scope="col" className="px-5 py-4">
                수정일
              </th>
              <th scope="col" className="px-5 py-4">
                작업
              </th>
            </tr>
          </thead>
          <tbody>
            {filtered.slice(currentPage * 20, (currentPage + 1) * 20).map((entry) => (
              <tr key={entry.id} className="border-b last:border-0 hover:bg-muted/40">
                <td className="min-w-56 max-w-md px-5 py-4">
                  <Link
                    className="break-words font-semibold hover:underline"
                    href={'/admin/content/' + kind + '/' + entry.id}
                  >
                    {entry.title}
                  </Link>
                  <p className="mt-1 break-all text-xs text-muted-foreground">{entry.slug}</p>
                </td>
                <td className="px-5 py-4">
                  <Badge variant="secondary">{entry.published ? 'Published' : 'Draft'}</Badge>
                </td>
                <td className="whitespace-nowrap px-5 py-4">
                  {new Intl.DateTimeFormat('ko-KR', {
                    timeZone: 'Asia/Seoul',
                    dateStyle: 'medium',
                  }).format(new Date(entry.updated_at))}
                </td>
                <td className="px-5 py-4">
                  <div className="flex flex-wrap gap-2">
                    <Button asChild className="cms-button cms-secondary">
                      <Link
                        aria-label={entry.title + ' 편집'}
                        href={'/admin/content/' + kind + '/' + entry.id}
                      >
                        <Pencil size={15} />
                        편집
                      </Link>
                    </Button>
                    <Button
                      type="button"
                      className="cms-button cms-secondary"
                      disabled={pending}
                      onClick={() => run(() => setEntryPublished(entry.id, !entry.published))}
                    >
                      {entry.published ? 'Draft로 전환' : 'Published로 전환'}
                    </Button>
                    <Button
                      type="button"
                      className="cms-button cms-danger"
                      aria-label={entry.title + ' 삭제'}
                      disabled={pending}
                      onClick={(event) => {
                        deleteTrigger.current = event.currentTarget;
                        setError('');
                        setDeleting(entry);
                      }}
                    >
                      <Trash2 size={15} />
                      삭제
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!filtered.length && (
          <div className="space-y-4 p-8 text-center">
            <p className="text-muted-foreground">
              {entries.length ? '검색 결과가 없습니다.' : '등록된 항목이 없습니다.'}
            </p>
            {entries.length > 0 ? (
              <Button
                type="button"
                className="cms-button cms-secondary"
                onClick={() => {
                  setSearch('');
                  setStatus('all');
                  setPage(0);
                }}
              >
                검색 조건 지우기
              </Button>
            ) : (
              <Button asChild className="cms-button">
                <Link href={'/admin/content/' + kind + '/new'}>{kindLabels[kind]} 추가</Link>
              </Button>
            )}
          </div>
        )}
      </div>
      {pageCount > 1 && (
        <nav aria-label="목록 페이지" className="flex items-center justify-end gap-3">
          <Button
            type="button"
            className="cms-button cms-secondary"
            disabled={currentPage === 0}
            onClick={() => setPage(currentPage - 1)}
          >
            이전
          </Button>
          <span className="text-sm tabular-nums">
            {currentPage + 1} / {pageCount}
          </span>
          <Button
            type="button"
            className="cms-button cms-secondary"
            disabled={currentPage + 1 >= pageCount}
            onClick={() => setPage(currentPage + 1)}
          >
            다음
          </Button>
        </nav>
      )}
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
          <AlertDialogTitle className="text-lg font-semibold">콘텐츠 삭제</AlertDialogTitle>
          <AlertDialogDescription className="break-words">
            ‘{deleting?.title}’을 삭제할까요? 삭제한 콘텐츠는 복구할 수 없습니다.
          </AlertDialogDescription>
          {error && (
            <p role="alert" className="text-red-600 dark:text-red-400">
              {error}
            </p>
          )}
          <div className="flex justify-end gap-2">
            <AlertDialogCancel asChild>
              <Button className="cms-button cms-secondary" disabled={pending}>
                취소
              </Button>
            </AlertDialogCancel>
            <AlertDialogAction asChild>
              <Button
                className="cms-button cms-danger"
                disabled={pending}
                onClick={(event) => {
                  event.preventDefault();
                  if (deleting)
                    run(async () => {
                      await deleteEntry(deleting.id);
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
