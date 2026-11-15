// TapTap 跑跑卡丁车官方竞速版 공식 공지 수집 상수
export const TAPTAP_LIST_URL = 'https://www.taptap.cn/app/84164/topic?type=official';
export const TAPTAP_OFFICIAL_USER = 'https://www.taptap.cn/user/27073530';
export const momentUrl = (id: string) => 'https://www.taptap.cn/moment/' + id;

export type TapTapMoment = {
  id: string;
  title: string;
  publishedAt: string;
  publishedIso: string;
  author: string;
  text: string;
  images: string[];
};

// HTML entity 복원
const decode = (value: string) =>
  value
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/&#(\d+);/g, (_match, code: string) => String.fromCodePoint(Number(code)))
    .replace(/&amp;/g, '&');

// 공식 공지 목록의 글 ID, 페이지 순서 유지
export const parseOfficialList = (html: string): string[] => [
  ...new Set(Array.from(html.matchAll(/\/moment\/(\d{6,25})/g), (match) => match[1])),
];

// 글 상세의 제목·날짜·작성자·본문·이미지 추출, 형식이 다르면 null
export const parseMoment = (id: string, html: string): TapTapMoment | null => {
  const article = Array.from(
    html.matchAll(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g),
    (match) => {
      try {
        return JSON.parse(match[1]) as Record<string, unknown>;
      } catch {
        return null;
      }
    },
  ).find((item) => item?.['@type'] === 'NewsArticle');
  if (!article) return null;
  const headline = typeof article.headline === 'string' ? article.headline : '';
  const publishedIso = typeof article.datePublished === 'string' ? article.datePublished : '';
  const author = (article.author as { url?: unknown } | undefined)?.url;
  if (!headline || !publishedIso || !Number.isFinite(Date.parse(publishedIso))) return null;
  const start = html.indexOf('<div class="tap-rich-content__wrapper');
  const end = start < 0 ? -1 : html.indexOf('reactions__tracker', start);
  const body = start < 0 ? '' : html.slice(start, end < 0 ? undefined : end);
  const text = Array.from(
    body.matchAll(/data-rich-content-index="\d+"[^>]*>([\s\S]*?)<\/div>/g),
    (match) => decode(match[1].replace(/<[^>]+>/g, '')).trim(),
  )
    .filter(Boolean)
    .join('\n');
  const images = [
    ...new Set(
      body.match(
        /https:\/\/img2-tc\.tapimg\.com\/moment\/etag\/[A-Za-z0-9_-]+\.(?:png|jpe?g|gif|webp)/g,
      ) ?? [],
    ),
  ];
  // 한국 시간 기준 게시일
  const publishedAt = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Seoul' }).format(
    new Date(publishedIso),
  );
  return {
    id,
    title: decode(headline.split(' - ')[0]).trim(),
    publishedAt,
    publishedIso,
    author: typeof author === 'string' ? author : '',
    text,
    images,
  };
};
