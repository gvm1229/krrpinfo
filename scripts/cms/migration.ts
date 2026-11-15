import { createHash } from 'node:crypto';
import { z } from 'zod';
import { entryInput, type Json } from '../../src/cms/schema';
type Imported = z.infer<typeof entryInput> & { created_at?: string; updated_at?: string };
// 기존 대상 항목의 식별자로 새 참조 연결
export const remapReferences = (
  entries: Imported[],
  current: { id: string; kind: string; slug: string }[],
): Imported[] => {
  const ids = new Map<string, string>();
  for (const entry of entries) {
    const existing = current.find((row) => row.kind === entry.kind && row.slug === entry.slug);
    if (entry.id && existing) ids.set(entry.id, existing.id);
  }
  return entries.map((entry) => ({
    ...entry,
    data: {
      ...entry.data,
      ...Object.fromEntries(
        ['category', 'seasonId', 'server']
          .filter(
            (key) => typeof entry.data[key] === 'string' && ids.has(entry.data[key] as string),
          )
          .map((key) => [key, ids.get(entry.data[key] as string)!]),
      ),
    },
  }));
};
// 이전 데이터의 안정적인 식별자 생성
export const stableId = (value: string): string => {
  const hash = createHash('sha256').update(value).digest('hex');
  return (
    hash.slice(0, 8) +
    '-' +
    hash.slice(8, 12) +
    '-4' +
    hash.slice(13, 16) +
    '-a' +
    hash.slice(17, 20) +
    '-' +
    hash.slice(20, 32)
  );
};
// 한국 날짜로 변환
export const koreanDate = (value: string) =>
  new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Seoul',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date(value));
const rowSchema = z.object({
  slug: z.string(),
  title: z.string(),
  id: z.union([z.string(), z.number()]).optional(),
  description: z.string().nullable().optional(),
  content: z.string(),
  published: z.boolean(),
  pub_date: z.string(),
  thumbnail: z.string().optional(),
  tags: z
    .union([z.string(), z.array(z.string())])
    .nullable()
    .optional(),
  keywords: z
    .union([z.string(), z.array(z.string())])
    .nullable()
    .optional(),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
});
const joined = (value: string | string[] | null | undefined) =>
  Array.isArray(value) ? value.join(', ') : (value ?? '');
// 글 원문·주소·공개 상태 보존
export const migratePost = (input: unknown): Imported => {
  const row = rowSchema.parse(input);
  const contentFormat = /<[A-Z]|^import\s|:::/m.test(row.content)
    ? 'legacy-mdx'
    : /<[a-z][\s\S]*>/i.test(row.content)
      ? 'legacy-html'
      : 'markdown';
  return {
    ...entryInput.parse({
      id: stableId('post:' + row.slug),
      kind: 'post',
      slug: row.slug,
      title: row.title,
      published: row.published,
      position: 0,
      data: {
        legacyId: String(row.id ?? ''),
        description: row.description ?? '',
        body: row.content,
        contentFormat,
        thumbnail: row.thumbnail ?? '',
        tags: joined(row.tags),
        keywords: joined(row.keywords),
        pubDate: koreanDate(row.pub_date),
        pubTimestamp: row.pub_date,
      },
    }),
    created_at: row.created_at,
    updated_at: row.updated_at,
  };
};
const snapshotSchema = z.object({
  posts: z.array(z.unknown()),
  channels: z.array(
    z.object({
      allVideos: z.array(
        z.object({
          id: z.string(),
          category: z.string().optional(),
          timestamps: z.unknown().optional(),
          snippet: z.object({
            title: z.string(),
            channelTitle: z.string(),
            publishedAt: z.string(),
            thumbnails: z.record(z.object({ url: z.string() })),
          }),
        }),
      ),
    }),
  ),
});
// 초기 콘텐츠와 기존 영상의 무손실 이전 계획
export const createMigration = (seed: unknown, snapshot: unknown) => {
  const initial = z
    .object({ settings: z.record(z.string()), entries: z.array(z.unknown()) })
    .parse(seed);
  const legacy = snapshotSchema.parse(snapshot);
  const entries: Imported[] = initial.entries.map((entry) => entryInput.parse(entry));
  for (const entry of entries)
    if (
      entry.kind === 'coupon' &&
      /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/.test(String(entry.data.expiresAt))
    )
      entry.data.expiresAt = new Date(String(entry.data.expiresAt) + '+09:00').toISOString();
  entries.push(...legacy.posts.map(migratePost));
  const videoIds = new Set<string>();
  let duplicates = 0;
  for (const channel of legacy.channels)
    for (const video of channel.allVideos) {
      if (videoIds.has(video.id)) {
        duplicates++;
        continue;
      }
      videoIds.add(video.id);
      const categoryTitle = video.category ?? '미분류';
      let category = entries.find(
        (entry) =>
          entry.kind === 'category' &&
          entry.title === categoryTitle &&
          entry.data.scope === 'video',
      );
      if (!category) {
        category = {
          id: stableId('category:' + categoryTitle),
          kind: 'category',
          slug: 'category-' + stableId(categoryTitle),
          title: categoryTitle,
          published: true,
          position: 0,
          data: { scope: 'video', color: 'blue' },
        };
        entries.push(category);
      }
      entries.push(
        entryInput.parse({
          id: stableId('video:' + video.id),
          kind: 'video',
          slug: 'video-' + video.id.toLowerCase(),
          title: video.snippet.title,
          published: true,
          position: 0,
          data: {
            videoId: video.id,
            channelTitle: video.snippet.channelTitle,
            thumbnail:
              video.snippet.thumbnails.maxres?.url ??
              video.snippet.thumbnails.high?.url ??
              video.snippet.thumbnails.default?.url ??
              '',
            pubDate: koreanDate(video.snippet.publishedAt),
            category: category.id!,
            legacyTimestamps: (video.timestamps ?? []) as Json,
          },
        }),
      );
    }
  const keys = new Set<string>();
  for (const entry of entries) {
    const key = entry.kind + ':' + entry.slug;
    if (keys.has(key)) throw new Error('중복된 콘텐츠 주소: ' + key);
    keys.add(key);
  }
  return {
    settings: initial.settings,
    entries,
    report: {
      posts: legacy.posts.length,
      sourceVideos: legacy.channels.reduce((count, channel) => count + channel.allVideos.length, 0),
      videos: videoIds.size,
      duplicates,
      entries: entries.length,
    },
  };
};
