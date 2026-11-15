import type { TimelineGroup as TimelineGroupType } from '@/src/types/season';
import Dot from './Dot';
import TimelineItem from './TimelineItem';

type TimelineGroupProps = {
  group: TimelineGroupType;
};

const TimelineGroup = ({ group }: TimelineGroupProps) => (
  <div className="relative flex min-w-0 flex-col gap-4">
    <div className="flex items-center gap-3">
      <div className="absolute -left-[30px] flex items-center tablet:-left-[46px]">
        <Dot state={group.dotState} />
      </div>
      <time className="text-sm font-medium text-zinc-500 dark:text-zinc-400">{group.date}</time>
      {group.seasonChip && (
        <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs font-semibold text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
          {group.seasonChip}
        </span>
      )}
    </div>
    <div className="flex flex-col gap-6">
      {group.items.map((item) => (
        <TimelineItem key={item.id} item={item} />
      ))}
    </div>
  </div>
);

export default TimelineGroup;
