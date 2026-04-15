# 2026-04-16 — youtubers page feature flag gate

> version: 0.1.5

## ✨ feat(youtubers)

- `NEXT_PUBLIC_SHOW_YOUTUBERS` env flag 도입 — `'true'`일 때만 `/youtubers` 접근 허용, 그 외 (prod/dev 무관) 차단
- `middleware.ts` 신규 — `/youtubers`, `/youtubers/:path*` matcher, flag 미설정 시 404 response
- `config/navBar.ts` — flag 기반 조건부 nav item (추천 유튜버 목록 + 영상 별로 모아보기)
- `app/sitemap.ts` — flag 기반 조건부 sitemap entry (SEO 차단), 기존 `'${siteConfig.url}/youtubers` 오타 함께 제거

## 🔧 chore(env)

- `env.mjs` — `NEXT_PUBLIC_SHOW_YOUTUBERS` optional enum (`'true' | 'false'`) 추가 (client + server + runtimeEnv)
- `.env.example` — Feature Flags section + `NEXT_PUBLIC_SHOW_YOUTUBERS=false` 기본값 추가
