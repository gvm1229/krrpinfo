import { cn } from '@/src/util/utils';

export default function ViewCounter({
  view,
  className,
}: {
  view: number;
  className?: string;
}) {
  // Checking if view is negative
  const viewContent = view < 0 ? 'error' : `${view}회`;

  return (
    <p className={cn('text-base font-medium tablet:text-lg', className)}>
      {`전체 방문: ${viewContent}`}
    </p>
  );
}
