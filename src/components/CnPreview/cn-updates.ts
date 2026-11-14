import { text, type Entry } from '@/src/cms/schema';

// 공개 화면용 중국 서버 소식
export type CnUpdate = {
  id: string;
  slug: string;
  title: string;
  season: string;
  summary: string;
  body: string[];
  images: string[];
  krEta: string;
  publishedAt: string;
  sourceName: string;
  sourceUrl: string;
};

// CMS 항목을 게시일 최신순 소식으로 변환
export const toCnUpdates = (entries: Entry[]): CnUpdate[] =>
  entries
    .map((entry) => ({
      id: entry.id,
      slug: entry.slug,
      title: entry.title,
      season: text(entry, 'season'),
      summary: text(entry, 'summary'),
      body: text(entry, 'body')
        .split('\n')
        .map((line) => line.trim())
        .filter(Boolean),
      images: text(entry, 'images')
        .split('\n')
        .map((line) => line.trim())
        .filter((line) => line.startsWith('https://')),
      krEta: text(entry, 'krEta'),
      publishedAt: text(entry, 'publishedAt'),
      sourceName: text(entry, 'sourceName'),
      sourceUrl: text(entry, 'sourceUrl'),
    }))
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
