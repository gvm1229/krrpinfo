import { cn } from '@/src/util/utils';

export default function ViewCounter({
  view,
  className,
}: {
  view: number;
  className?: string;
}) {
  return (
    <p className={cn('text-base font-medium tablet:text-lg', className)}>
      {`전체 방문: ${view}회`}
    </p>
  );
}
