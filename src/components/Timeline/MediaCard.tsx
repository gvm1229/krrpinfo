import Image from 'next/image';
import type { TimelineCard, TagPillColor } from '@/src/types/season';
import TagPill from './TagPill';

type MediaCardProps = {
  card: TimelineCard;
  tags?: { color: TagPillColor; text: string }[];
};

const MediaCard = ({ card, tags }: MediaCardProps) => {
  if (card.variant === 'image' && card.imageUrl) {
    return (
      <div className="relative w-[320px] h-[180px] rounded-[12px] overflow-hidden shrink-0">
        <Image src={card.imageUrl} alt={card.alt ?? ''} fill className="object-cover" />
      </div>
    );
  }

  // unknown variant — 회색 플레이스홀더 + 태그 pill row
  return (
    <div className="flex w-[320px] h-[180px] shrink-0 flex-col items-center justify-center gap-3 rounded-[12px] bg-zinc-200 dark:bg-zinc-800">
      <span className="text-5xl font-bold text-zinc-400 dark:text-zinc-600 select-none">?</span>
      {tags && tags.length > 0 && (
        <div className="flex flex-wrap justify-center gap-1">
          {tags.map((tag, i) => (
            <TagPill key={i} color={tag.color} text={tag.text} />
          ))}
        </div>
      )}
    </div>
  );
};

export default MediaCard;
