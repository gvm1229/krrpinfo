import 'server-only';
import { ingestCnUpdate, knownSourceUrls } from './cn-ingest';
import {
  TAPTAP_LIST_URL,
  TAPTAP_OFFICIAL_USER,
  momentUrl,
  parseMoment,
  parseOfficialList,
} from './taptap';

const headers = {
  'User-Agent': 'Mozilla/5.0 (compatible; krrpinfo-collector/1.0; +https://krrpinfo.vercel.app)',
  'Accept-Language': 'zh-CN,zh;q=0.9',
};

// 한 페이지 HTML 요청, 실패 시 null
const page = async (url: string) => {
  try {
    const response = await fetch(url, { headers, signal: AbortSignal.timeout(15000) });
    if (!response.ok) {
      console.error(`[taptap-collect::page] ${response.status} ${url}`);
      return null;
    }
    return await response.text();
  } catch (error) {
    console.error(`[taptap-collect::page] ${error}`);
    return null;
  }
};

export type CollectReport = {
  listed: number;
  saved: string[];
  skipped: { id: string; reason: string }[];
  listFailed?: boolean;
};

// 공식 공지 1페이지에서 새 글만 원문·이미지 Draft로 저장, 번역은 cloud session
export const collectTapTap = async ({ maxAgeDays = 7, maxPosts = 10 } = {}) => {
  const report: CollectReport = { listed: 0, saved: [], skipped: [] };
  const list = await page(TAPTAP_LIST_URL);
  if (!list) return { ...report, listFailed: true };
  const ids = parseOfficialList(list);
  report.listed = ids.length;
  const known = await knownSourceUrls();
  const cutoff = Date.now() - maxAgeDays * 86400000;
  for (const id of ids.filter((value) => !known.has(momentUrl(value))).slice(0, maxPosts)) {
    // 요청 간격 1초
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const html = await page(momentUrl(id));
    const moment = html ? parseMoment(id, html) : null;
    if (!moment) {
      report.skipped.push({ id, reason: 'parse' });
      continue;
    }
    if (moment.author !== TAPTAP_OFFICIAL_USER) {
      report.skipped.push({ id, reason: 'author' });
      continue;
    }
    if (Date.parse(moment.publishedIso) < cutoff) {
      report.skipped.push({ id, reason: 'old' });
      continue;
    }
    const result = await ingestCnUpdate({
      sourceUrl: momentUrl(id),
      sourceName: 'TapTap 공식 공지',
      publishedAt: moment.publishedAt,
      title: moment.title.slice(0, 200),
      season: '',
      summary: '',
      body: '',
      originalText: moment.text.slice(0, 20000),
      images: moment.images.slice(0, 20),
      krEta: '',
    });
    if (result.duplicate) report.skipped.push({ id, reason: 'duplicate' });
    else report.saved.push(id);
  }
  return report;
};
