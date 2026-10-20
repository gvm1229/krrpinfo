'use client';
import Link from 'next/link';
import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Search, Pencil, Trash2 } from 'lucide-react';
import { deleteEntry, setEntryPublished } from '@/app/admin/actions';
import { kindLabels, type Entry, type Kind } from '@/src/cms/schema';

// 콘텐츠 검색·공개 상태·목록 관리
export const ContentList = ({ kind, entries }: { kind: Kind; entries: Entry[] }) => {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [page, setPage] = useState(0);
  const [error, setError] = useState('');
  const [pending, start] = useTransition();
  const router = useRouter();
  const filtered = entries.filter(
    (entry) =>
      entry.title.toLowerCase().includes(search.toLowerCase()) &&
      (status === 'all' || entry.published === (status === 'published')),
  );
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
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold">{kindLabels[kind]}</h1>
          <p className="mt-2 text-sm text-muted-foreground">{filtered.length}개 항목</p>
        </div>
        <Link className="cms-button" href={'/admin/content/' + kind + '/new'}>
          <Plus size={16} />
          추가
        </Link>
      </header>
      <div className="cms-panel flex flex-wrap gap-3">
        <label className="flex min-w-48 flex-1 items-center gap-2">
          <Search size={18} />
          <input
            className="cms-input"
            placeholder="제목 검색"
            aria-label="제목 검색"
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setPage(0);
            }}
          />
        </label>
        <select
          className="cms-input max-w-40"
          aria-label="공개 상태 필터"
          value={status}
          onChange={(event) => {
            setStatus(event.target.value);
            setPage(0);
          }}
        >
          <option value="all">전체 상태</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
        </select>
      </div>
      {error && (
        <p role="alert" className="text-red-600">
          {error}
        </p>
      )}
      <div className="cms-panel overflow-x-auto !p-0">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b">
              <th className="px-5 py-4">제목</th>
              <th className="px-5 py-4">주소 식별자</th>
              <th className="px-5 py-4">상태</th>
              <th className="px-5 py-4">수정일</th>
              <th className="px-5 py-4">작업</th>
            </tr>
          </thead>
          <tbody>
            {filtered.slice(page * 20, (page + 1) * 20).map((entry) => (
              <tr key={entry.id} className="border-b last:border-0 hover:bg-muted/40">
                <td className="px-5 py-4 font-medium">
                  <Link href={'/admin/content/' + kind + '/' + entry.id}>{entry.title}</Link>
                </td>
                <td className="px-5 py-4 text-muted-foreground">{entry.slug}</td>
                <td className="px-5 py-4">
                  <button
                    type="button"
                    className="cms-button cms-secondary"
                    disabled={pending}
                    onClick={() => run(() => setEntryPublished(entry.id, !entry.published))}
                  >
                    {entry.published ? 'Published' : 'Draft'}
                  </button>
                </td>
                <td className="whitespace-nowrap px-5 py-4">
                  {new Intl.DateTimeFormat('ko-KR', {
                    timeZone: 'Asia/Seoul',
                    dateStyle: 'medium',
                  }).format(new Date(entry.updated_at))}
                </td>
                <td className="px-5 py-4">
                  <div className="flex gap-2">
                    <Link
                      className="cms-button cms-secondary"
                      aria-label={entry.title + ' 편집'}
                      href={'/admin/content/' + kind + '/' + entry.id}
                    >
                      <Pencil size={15} />
                    </Link>
                    <button
                      type="button"
                      className="cms-button cms-danger"
                      aria-label={entry.title + ' 삭제'}
                      disabled={pending}
                      onClick={() => {
                        if (confirm('이 콘텐츠를 삭제할까요?')) run(() => deleteEntry(entry.id));
                      }}
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!filtered.length && (
          <p className="p-12 text-center text-muted-foreground">
            항목이 없습니다. 추가 버튼으로 첫 콘텐츠를 작성할 수 있습니다.
          </p>
        )}
      </div>
      <div className="flex items-center justify-end gap-3">
        <button
          className="cms-button cms-secondary"
          disabled={page === 0}
          onClick={() => setPage(page - 1)}
        >
          이전
        </button>
        <span className="text-sm">
          {page + 1} / {Math.max(1, Math.ceil(filtered.length / 20))}
        </span>
        <button
          className="cms-button cms-secondary"
          disabled={(page + 1) * 20 >= filtered.length}
          onClick={() => setPage(page + 1)}
        >
          다음
        </button>
      </div>
    </div>
  );
};
