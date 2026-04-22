# 2026-04-16 — youtubers feature flag + markdown PortareFolium 이식

> version: 0.1.6

## ✨ feat(youtubers)

- `NEXT_PUBLIC_SHOW_YOUTUBERS` env flag 도입 — `'true'`일 때만 `/youtubers` 접근 허용, 그 외 (prod/dev 무관) 차단
- `middleware.ts` 신규 — `/youtubers`, `/youtubers/:path*` matcher, flag 미설정 시 404 response
- `config/navBar.ts` — flag 기반 조건부 nav item (추천 유튜버 목록 + 영상 별로 모아보기)
- `app/sitemap.ts` — flag 기반 조건부 sitemap entry (SEO 차단), 기존 `'${siteConfig.url}/youtubers` 오타 함께 제거

## 🔧 chore(env)

- `env.mjs` — `NEXT_PUBLIC_SHOW_YOUTUBERS` optional enum (`'true' | 'false'`) 추가 (client + server + runtimeEnv)
- `.env.example` — Feature Flags section + `NEXT_PUBLIC_SHOW_YOUTUBERS=false` 기본값 추가

## ♻️ refactor(markdown)

- `src/lib/markdown.tsx` — PortareFolium 완전 이식 (KaTeX 제외): YouTube, ColoredTable, Accordion, Mermaid 컴포넌트 + remarkMermaid + directive-converter + tiptap unescape + escapeStrayCurlyBraces + 상세 에러 디버깅
- `src/lib/mdx-directive-converter.ts` 신규 — JSX ↔ MDX directive 양방향 변환 (admin dashboard 이식 대비)
- `src/lib/tiptap-markdown.ts` 신규 — JSX 태그 내부 bracket 복원
- `src/components/Markdown/MarkdownImage.tsx` 신규 — renderToString 호환 img 대체
- `src/styles/mdx.css` — PortareFolium `.prose` 스타일 `.mdx`로 이식: heading/paragraph 간격 축소, Shiki line numbering, heading anchor 스타일, accordion/colored-table/youtube-embed/mermaid 스타일, dark mode 대응
- `unist-util-visit` 의존성 추가
