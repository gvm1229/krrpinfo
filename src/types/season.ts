// 타임라인 태그 필 색상 vocab
export type TagPillColor =
  | 'gold'
  | 'green'
  | 'blue'
  | 'sky'
  | 'red'
  | 'yellow'
  | 'purple'
  | 'orange';

// 타임라인 dot 상태
export type DotState = 'active' | 'upcoming' | 'future';

// 미디어 카드 variant
export type MediaCardVariant = 'image' | 'unknown';

// 타임라인 카드 데이터
export type TimelineCard = {
  variant: MediaCardVariant;
  imageUrl?: string;
  alt?: string;
};

// 타임라인 단일 항목
export type TimelineItem = {
  id: string;
  kicker?: string;
  title: string;
  card?: TimelineCard;
  tags?: { color: TagPillColor; text: string }[];
};

// 타임라인 날짜 그룹
export type TimelineGroup = {
  id: string;
  date: string; // YYYY-MM-DD 형식
  seasonChip?: string; // 예: "S25"
  dotState: DotState;
  items: TimelineItem[];
};
