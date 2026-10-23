import type { TimelineItem as TimelineItemType } from '@/src/types/season';
import MediaCard from './MediaCard';
import TagPill from './TagPill';

type TimelineItemProps = {
  item: TimelineItemType;
};

const TimelineItem = ({ item }: TimelineItemProps) => (
  <div className="flex flex-col gap-2">
    {item.kicker && item.kicker.trim() !== item.title.trim() && (
      <p className="text-sm text-muted-foreground">{item.kicker}</p>
    )}
    <p className="text-sm font-semibold text-zinc-800 dark:text-zinc-100">{item.title}</p>
    {item.card && (
      <MediaCard card={item.card} tags={item.card.variant === 'unknown' ? item.tags : undefined} />
    )}
    {item.card?.variant !== 'unknown' && item.tags && item.tags.length > 0 && (
      // image variant 에서는 카드 아래 pill row 표시
      <div className="flex flex-wrap gap-1">
        {item.tags.map((tag, i) => (
          <TagPill key={i} color={tag.color} text={tag.text} />
        ))}
      </div>
    )}
  </div>
);

export default TimelineItem;
