import type { TagPillColor } from '@/src/types/season';

// 태그 색상별 Tailwind 클래스 매핑
const colorMap: Record<TagPillColor, string> = {
  gold: 'bg-tag-gold/15 text-tag-gold',
  green: 'bg-tag-green/15 text-tag-green',
  blue: 'bg-tag-blue/15 text-tag-blue',
  sky: 'bg-tag-sky/15 text-tag-sky',
  red: 'bg-tag-red/15 text-tag-red',
  yellow: 'bg-tag-yellow/15 text-tag-yellow',
  purple: 'bg-tag-purple/15 text-tag-purple',
  orange: 'bg-tag-orange/15 text-tag-orange',
};

type TagPillProps = {
  color: TagPillColor;
  text: string;
};

const TagPill = ({ color, text }: TagPillProps) => (
  <span className={`inline-block px-2 py-0.5 text-xs font-medium rounded-full ${colorMap[color]}`}>
    {text}
  </span>
);

export default TagPill;
