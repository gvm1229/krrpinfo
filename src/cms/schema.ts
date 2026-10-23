import { z } from 'zod';

export const kinds = [
  'post',
  'video',
  'season',
  'timeline',
  'countdown',
  'coupon',
  'navigation',
  'link',
  'category',
  'section',
  'copy',
] as const;
export type Kind = (typeof kinds)[number];
export type Json = string | number | boolean | null | Json[] | { [key: string]: Json };
export type Entry = {
  id: string;
  kind: Kind;
  slug: string;
  title: string;
  published: boolean;
  position: number;
  data: Record<string, Json>;
  created_at: string;
  updated_at: string;
};
export type Media = {
  id: string;
  object_key: string;
  url: string;
  name: string;
  alt: string;
  content_type: string;
  size: number;
  created_at: string;
};
export type SiteSettings = {
  name: string;
  description: string;
  logo: string;
  ogImage: string;
  keywords: string;
  author: string;
  authorUrl: string;
  footerLabel: string;
  contactLabel: string;
  contactUrl: string;
  copyright: string;
  qrImage: string;
  qrLabel: string;
  homeTitle: string;
  homeDescription: string;
  homeImage: string;
  homeLink: string;
  homeLinkLabel: string;
  googleVerification: string;
  naverVerification: string;
  redeemGuideUrl: string;
  redeemGuideImage: string;
  postsEnabled: string;
  videosEnabled: string;
  seasonsEnabled: string;
  redeemEnabled: string;
};
export type Field = {
  key: string;
  label: string;
  type?:
    | 'text'
    | 'textarea'
    | 'number'
    | 'date'
    | 'datetime-local'
    | 'url'
    | 'media'
    | 'checkbox'
    | 'category'
    | 'season'
    | 'palette'
    | 'component'
    | 'scope';
  required?: boolean;
};
export const kindLabels: Record<Kind, string> = {
  post: '글',
  video: '추천 영상',
  season: '시즌',
  timeline: '시즌 일정',
  countdown: '홈 카운트다운',
  coupon: '쿠폰',
  navigation: '메뉴',
  link: '유용한 링크',
  category: '분류',
  section: '홈 섹션',
  copy: '화면 문구',
};
export const settingFields: Field[] = [
  { key: 'postsEnabled', label: '글 페이지 사용', type: 'checkbox' },
  { key: 'videosEnabled', label: '추천 영상 페이지 사용', type: 'checkbox' },
  { key: 'seasonsEnabled', label: '시즌 페이지 사용', type: 'checkbox' },
  { key: 'redeemEnabled', label: '쿠폰 페이지 사용', type: 'checkbox' },
  { key: 'name', label: '사이트 이름' },
  { key: 'description', label: '사이트 설명', type: 'textarea' },
  { key: 'logo', label: '로고', type: 'media' },
  { key: 'ogImage', label: '공유 이미지', type: 'media' },
  { key: 'keywords', label: '검색 키워드 · 쉼표로 구분' },
  { key: 'author', label: '작성자' },
  { key: 'authorUrl', label: '작성자 주소', type: 'url' },
  { key: 'footerLabel', label: '푸터 안내' },
  { key: 'contactLabel', label: '연락처 이름' },
  { key: 'contactUrl', label: '연락처 주소', type: 'url' },
  { key: 'copyright', label: '저작권 문구' },
  { key: 'qrImage', label: 'QR 이미지', type: 'media' },
  { key: 'qrLabel', label: 'QR 안내' },
  { key: 'homeTitle', label: '홈 소개 제목' },
  { key: 'homeDescription', label: '홈 소개 내용', type: 'textarea' },
  { key: 'homeImage', label: '홈 대표 이미지', type: 'media' },
  { key: 'homeLink', label: '홈 소개 연결 주소' },
  { key: 'homeLinkLabel', label: '홈 소개 링크 문구' },
  { key: 'redeemGuideUrl', label: '쿠폰 사용 안내 주소', type: 'url' },
  { key: 'redeemGuideImage', label: '회원 번호 안내 이미지', type: 'media' },
  { key: 'googleVerification', label: 'Google 사이트 확인 값' },
  { key: 'naverVerification', label: 'Naver 사이트 확인 값' },
];
export const fields: Record<Kind, Field[]> = {
  post: [
    { key: 'description', label: '요약', type: 'textarea' },
    { key: 'thumbnail', label: '썸네일', type: 'media' },
    { key: 'pubDate', label: '표시 날짜', type: 'date', required: true },
    { key: 'tags', label: '태그 · 쉼표로 구분' },
    { key: 'keywords', label: '검색 키워드 · 쉼표로 구분' },
  ],
  video: [
    { key: 'videoId', label: 'YouTube 영상 ID', required: true },
    { key: 'channelTitle', label: '채널 이름' },
    { key: 'thumbnail', label: '썸네일 주소', type: 'media' },
    { key: 'pubDate', label: '영상 날짜', type: 'date' },
    { key: 'category', label: '분류', type: 'category' },
  ],
  season: [
    { key: 'server', label: '서버 구분', type: 'category' },
    { key: 'number', label: '시즌 번호', type: 'number' },
    { key: 'startDate', label: '시작일', type: 'date', required: true },
    { key: 'endDate', label: '종료일', type: 'date', required: true },
    { key: 'image', label: '배너', type: 'media' },
  ],
  timeline: [
    { key: 'seasonId', label: '시즌', type: 'season' },
    { key: 'date', label: '날짜', type: 'date', required: true },
    { key: 'group', label: '날짜 그룹 이름' },
    { key: 'kicker', label: '짧은 안내' },
    { key: 'image', label: '이미지', type: 'media' },
    { key: 'tags', label: '태그 · 쉼표로 구분' },
    { key: 'category', label: '분류', type: 'category' },
  ],
  countdown: [
    { key: 'group', label: '카드 그룹', required: true },
    { key: 'seasonId', label: '연결 시즌', type: 'season' },
    { key: 'date', label: '개별 이벤트 날짜 · 연결 시즌이 있으면 종료일 사용', type: 'date' },
    { key: 'description', label: '설명' },
    { key: 'image', label: '이미지', type: 'media' },
    { key: 'untilEnd', label: '종료까지 표시', type: 'checkbox' },
  ],
  coupon: [
    { key: 'code', label: '쿠폰 코드', required: true },
    { key: 'expiresAt', label: '만료 시각 · 한국 시간', type: 'datetime-local', required: true },
  ],
  navigation: [
    { key: 'href', label: '연결 주소', required: true },
    { key: 'parent', label: '상위 메뉴의 주소 식별자' },
    { key: 'badge', label: '표시 배지' },
  ],
  link: [
    { key: 'href', label: '연결 주소', required: true },
    { key: 'image', label: '이미지', type: 'media' },
    { key: 'tags', label: '태그 · 쉼표로 구분' },
  ],
  category: [
    { key: 'scope', label: '사용 영역', type: 'scope', required: true },
    { key: 'color', label: '태그 색상', type: 'palette' },
  ],
  section: [{ key: 'component', label: '섹션 종류', type: 'component', required: true }],
  copy: [{ key: 'value', label: '문구', type: 'textarea' }],
};

// 안전한 콘텐츠 주소 확인
export const safeUrl = (value: string): boolean => {
  if (!value) return true;
  if (value.startsWith('/')) return !value.startsWith('//') && !value.includes('\\');
  try {
    return ['https:', 'http:', 'mailto:', 'tel:'].includes(new URL(value).protocol);
  } catch {
    return value.startsWith('#');
  }
};
const jsonSchema: z.ZodType<Json> = z.lazy(() =>
  z.union([
    z.string(),
    z.number().finite(),
    z.boolean(),
    z.null(),
    z.array(jsonSchema),
    z.record(jsonSchema),
  ]),
);
export const entryInput = z
  .object({
    id: z.string().uuid().optional(),
    kind: z.enum(kinds),
    slug: z
      .string()
      .regex(/^[a-z0-9][a-z0-9._-]*$/)
      .max(180),
    title: z.string().trim().min(1).max(300),
    published: z.boolean(),
    position: z.number().int().min(0).max(100000),
    data: z.record(jsonSchema),
  })
  .superRefine((input, ctx) => {
    for (const field of fields[input.kind]) {
      const value = input.data[field.key];
      if (field.required && (typeof value !== 'string' || !value.trim()))
        ctx.addIssue({
          code: 'custom',
          path: ['data', field.key],
          message: field.label + ' 입력 필요',
        });
      if (
        typeof value === 'string' &&
        ['url', 'media'].includes(field.type ?? '') &&
        !safeUrl(value)
      )
        ctx.addIssue({ code: 'custom', path: ['data', field.key], message: '허용하지 않는 주소' });
      if (
        field.type === 'date' &&
        typeof value === 'string' &&
        value &&
        !/^\d{4}-\d{2}-\d{2}$/.test(value)
      )
        ctx.addIssue({ code: 'custom', message: '날짜 형식 확인 필요' });
      if (
        field.type === 'date' &&
        typeof value === 'string' &&
        /^\d{4}-\d{2}-\d{2}$/.test(value) &&
        (!Number.isFinite(Date.parse(value + 'T00:00:00Z')) ||
          new Date(value + 'T00:00:00Z').toISOString().slice(0, 10) !== value)
      )
        ctx.addIssue({ code: 'custom', message: '존재하지 않는 날짜' });
    }
    if (input.kind === 'navigation' || input.kind === 'link') {
      if (!safeUrl(String(input.data.href ?? '')) || String(input.data.href).startsWith('/admin'))
        ctx.addIssue({ code: 'custom', message: '공개 메뉴에 사용할 수 없는 주소' });
    }
    if (input.kind === 'video' && !/^[a-zA-Z0-9_-]{11}$/.test(String(input.data.videoId)))
      ctx.addIssue({ code: 'custom', message: 'YouTube 영상 ID 확인 필요' });
    if (input.kind === 'season' && String(input.data.startDate) > String(input.data.endDate))
      ctx.addIssue({ code: 'custom', message: '종료일은 시작일 이후로 지정' });
    if (
      input.kind === 'section' &&
      !['hero', 'countdown', 'links', 'posts', 'timeline'].includes(String(input.data.component))
    )
      ctx.addIssue({ code: 'custom', message: '지원하지 않는 섹션' });
    if (
      input.kind === 'coupon' &&
      !Number.isFinite(new Date(String(input.data.expiresAt)).getTime())
    )
      ctx.addIssue({ code: 'custom', message: '만료 시각 확인 필요' });
  });
export const settingsInput = z
  .object(Object.fromEntries(settingFields.map((field) => [field.key, z.string().max(4000)])))
  .superRefine((input, ctx) => {
    for (const field of settingFields.filter((field) => field.type === 'checkbox'))
      if (!['true', 'false'].includes(input[field.key]))
        ctx.addIssue({ code: 'custom', path: [field.key], message: '페이지 표시 설정 확인 필요' });
    for (const field of settingFields.filter(
      (field) => field.type === 'url' || field.type === 'media',
    )) {
      if (!safeUrl(input[field.key]))
        ctx.addIssue({ code: 'custom', path: [field.key], message: '허용하지 않는 주소' });
    }
  });
export const text = (entry: Entry, key: string): string =>
  typeof entry.data[key] === 'string' ? (entry.data[key] as string) : '';
export const list = (value: string): string[] =>
  value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);

// 공개 페이지의 운영 설정 확인
export const publicPathEnabled = (settings: SiteSettings, path: string): boolean => {
  if (path.startsWith('/admin') || path.startsWith('//')) return false;
  for (const [route, key] of Object.entries({
    posts: 'postsEnabled',
    videos: 'videosEnabled',
    seasons: 'seasonsEnabled',
    redeem: 'redeemEnabled',
  })) {
    if (path === '/' + route || path.startsWith('/' + route + '/'))
      return settings[key as keyof SiteSettings] === 'true';
  }
  return true;
};
