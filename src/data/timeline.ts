import { publishedEntries } from '@/src/cms/repository';
import { text, list } from '@/src/cms/schema';
import type { TimelineGroup, TagPillColor } from '@/src/types/season';
// CMS 일정에서 타임라인 그룹 구성
export const getTimeline = async (): Promise<TimelineGroup[]> => {
  const [entries, seasons, categories] = await Promise.all([
    publishedEntries('timeline'),
    publishedEntries('season'),
    publishedEntries('category'),
  ]);
  const groups = new Map<string, TimelineGroup>();
  for (const entry of entries) {
    const season = seasons.find((item) => item.id === text(entry, 'seasonId'));
    const date = text(entry, 'date');
    const groupName = season?.title || text(entry, 'group');
    const key = date + ':' + groupName;
    if (!groups.has(key))
      groups.set(key, {
        id: key,
        date,
        seasonChip: groupName,
        dotState: new Date(date) > new Date() ? 'upcoming' : 'active',
        items: [],
      });
    const category = categories.find((item) => item.id === text(entry, 'category'));
    const color = (category ? text(category, 'color') : 'blue') as TagPillColor;
    groups.get(key)!.items.push({
      id: entry.id,
      title: entry.title,
      kicker: text(entry, 'kicker'),
      card: text(entry, 'image')
        ? { variant: 'image', imageUrl: text(entry, 'image'), alt: entry.title }
        : { variant: 'unknown' },
      tags: list(text(entry, 'tags')).map((tag) => ({
        color: ['gold', 'green', 'blue', 'sky', 'red', 'yellow', 'purple', 'orange'].includes(color)
          ? color
          : 'blue',
        text: tag,
      })),
    });
  }
  return [...groups.values()].sort((a, b) => a.date.localeCompare(b.date));
};
