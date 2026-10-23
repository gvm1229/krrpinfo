'use client';
import { useCopy } from '@/components/Text/PublicSite';
import { cn } from '@/src/util/utils';
type Season = {
  targetEndDate: string;
  countdownUntilEnd: boolean;
  seasonNum?: number;
  src?: string;
  alt?: string;
  title?: string;
  description?: string;
  bgFromColor: string;
  bgToColor: string;
};
// 한국 날짜를 기준으로 일정 카드 표시
const Countdown = ({ seasons, className }: { seasons: Season[]; className?: string }) => {
  const t = useCopy();
  const today = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Seoul' }).format(new Date());
  const current = seasons.find((season) => season.targetEndDate >= today) ?? seasons.at(-1);
  if (!current) return null;
  const days = Math.max(
    0,
    Math.round(
      (Date.parse(current.targetEndDate + 'T00:00:00+09:00') -
        Date.parse(today + 'T00:00:00+09:00')) /
        86400000,
    ),
  );
  return (
    <div
      className={cn(
        'flex min-h-56 flex-col justify-between rounded-lg bg-brand-blue p-4 text-white',
        className,
      )}
    >
      <div>
        {current.src ? (
          <img
            src={current.src}
            alt={current.alt ?? current.title ?? ''}
            className="max-h-28 w-full object-contain"
          />
        ) : (
          <h3 className="text-base font-bold">{current.title ?? current.alt}</h3>
        )}
        {current.description &&
          (current.src ||
            current.description.trim() !== (current.title ?? current.alt ?? '').trim()) && (
            <p className="mt-2 text-sm">{current.description}</p>
          )}
      </div>
      <div className="mt-5 space-y-1">
        <p className="text-sm">
          {t(current.countdownUntilEnd ? 'countdown.end' : 'countdown.start')}
        </p>
        <p className="text-2xl font-bold tabular-nums">
          {days ? t('countdown.days', { days }) : t('countdown.today')}
        </p>
        <p className="text-sm">({current.targetEndDate})</p>
      </div>
    </div>
  );
};
export default Countdown;
