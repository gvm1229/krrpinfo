import type { TimelineGroup as TimelineGroupType } from '@/src/types/season';
import Dot from './Dot';
import TimelineItem from './TimelineItem';

type TimelineGroupProps = {
  group: TimelineGroupType;
};

const TimelineGroup = ({ group }: TimelineGroupProps) => (
  <div className="relative flex flex-col gap-4">
    {/* 그룹 헤더 — dot + 날짜 + 시즌 chip */}
    <div className="flex items-center gap-3">
      {/* dot 위치 — spine 과 정렬되도록 왼쪽 오프셋 맞춤 */}
      <div className="absolute -left-[76px] flex items-center">
        <Dot state={group.dotState} />
      </div>
      <time className="text-sm font-medium text-zinc-500 dark:text-zinc-400">{group.date}</time>
      {group.seasonChip && (
        <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs font-semibold text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
          {group.seasonChip}
        </span>
      )}
    </div>
    {/* 그룹 items */}
    <div className="flex flex-col gap-6">
      {group.items.map((item) => (
        <TimelineItem key={item.id} item={item} />
      ))}
    </div>
  </div>
);

export default TimelineGroup;
