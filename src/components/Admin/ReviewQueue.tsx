'use client';
import Link from 'next/link';
import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Check, Trash2 } from 'lucide-react';
import { approveCouponReport, deleteEntry } from '@/app/admin/actions';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { kindLabels, type Entry } from '@/src/cms/schema';

// 대시보드 확인 대기 항목과 바로 처리 버튼
export const ReviewQueue = ({ reports, drafts }: { reports: Entry[]; drafts: Entry[] }) => {
  const [error, setError] = useState('');
  const [pending, start] = useTransition();
  const router = useRouter();
  // 처리 결과 반영
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
    <section className="cms-panel space-y-5" aria-labelledby="review-queue-title">
      <h2 id="review-queue-title" className="text-lg font-semibold">
        확인 대기
      </h2>
      {error && (
        <p role="alert" className="text-sm text-error-text">
          {error}
        </p>
      )}
      <div className="divide-y">
        {reports.map((report) => (
          <div
            key={report.id}
            className="flex flex-col gap-3 py-4 tablet:flex-row tablet:items-center tablet:justify-between"
          >
            <div className="min-w-0 space-y-1">
              <p className="flex flex-wrap items-center gap-2">
                <span className="break-all font-semibold">{String(report.data.code ?? '')}</span>
                <Badge variant="secondary">{kindLabels.coupon_report}</Badge>
                {report.data.verified === true && <Badge variant="secondary">Nexon 확인</Badge>}
              </p>
              <p className="text-sm text-muted-foreground">
                만료일 {String(report.data.expiresAt || '미입력 · 승인 시 14일 뒤')}
              </p>
            </div>
            <div className="flex shrink-0 gap-2">
              <Button
                type="button"
                className="cms-button"
                aria-label={String(report.data.code ?? '') + ' 제보 승인'}
                disabled={pending}
                onClick={() => run(() => approveCouponReport(report.id))}
              >
                <Check size={15} />
                승인
              </Button>
              <Button
                type="button"
                className="cms-button cms-danger"
                aria-label={String(report.data.code ?? '') + ' 제보 거절'}
                disabled={pending}
                onClick={() => run(() => deleteEntry(report.id))}
              >
                <Trash2 size={15} />
                거절
              </Button>
            </div>
          </div>
        ))}
        {drafts.map((entry) => (
          <Link
            key={entry.id}
            href={'/admin/content/' + entry.kind + '/' + entry.id}
            className="flex min-w-0 flex-col gap-1 py-4 hover:underline tablet:flex-row tablet:items-center tablet:justify-between"
          >
            <span className="min-w-0 break-words">{entry.title}</span>
            <span className="flex shrink-0 gap-2 text-sm text-muted-foreground">
              <span>{kindLabels[entry.kind]}</span>
              <span>Draft</span>
            </span>
          </Link>
        ))}
      </div>
      {!reports.length && !drafts.length && (
        <p className="text-muted-foreground">확인할 항목이 없습니다.</p>
      )}
    </section>
  );
};
