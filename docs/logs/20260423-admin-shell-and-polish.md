# 2026-04-23 — Admin shell separation + minimum site polish

> version: 0.1.13

## ✨ feat(admin) — admin UI 가 frontend chrome 와 완전 분리

PLAN_DESIGN_OVERHAUL Phase 5 — Next.js route group 으로 chrome 분리.

### 구조 변경

- `app/layout.tsx` — bare html/body/ThemeProvider/Analytics (chrome 제거)
- `app/(site)/layout.tsx` 신규 — SiteHeader + main + SiteFooter + ScrollToTopButton + ClientLayout. `getPostsForSearch` + `headers` userAgent 도 이쪽으로 이동
- `app/(site)/{page,posts,redeem,seasons,youtubers}/` — 모든 공개 페이지를 (site) group 으로 git mv (URL 영향 없음)
- `app/admin/(authenticated)/layout.tsx` 신규 — sidebar (Dashboard / Posts / Seasons / Config) + topbar (user email + Sign Out form). `isOwner` gate 단일 진입점
- `app/admin/(authenticated)/{page,posts,config,seasons}/` — 인증 요구 화면들. `login/`, `auth-error/` 는 group 밖 그대로 두어 admin shell 미상속

### 화면

- `/admin` Dashboard — 4 tile 통계 (전체 / 게시됨 / 드래프트 / 최근 업데이트). `getAllPostsForAdmin()` 기반
- `/admin/posts` — 기존 테이블, layout shell 안으로 정돈 (outer `<main>` wrapper 제거)
- `/admin/config` — placeholder 페이지. nav / footer / features / cache 예정 항목 list
- `/admin/seasons` — placeholder + Phase 4 prerequisite 안내 banner (Cloudflare account, env, DB 결정)

### 수반 변경

- `app/not-found.tsx` — server component 로 변환. `'use client'` + `metadata` export 충돌이 route group 재구조 후 prerender 단계 `$$typeof` 에러로 표면화. `useRouter` 대신 `<Link href='/'>` 사용
- `src/components/Admin/PublishedToggle.tsx` + `src/__tests__/actions/togglePublished.test.ts` — server action import path 갱신 (`admin/posts` → `admin/(authenticated)/posts`)

## 🎨 style(site) — Phase 6 minimum polish

- `src/components/Footer/SiteFooter.tsx` — KakaoTalk CTA `bg-yellow-300 hover:bg-yellow-200` → `bg-kakao-yellow hover:bg-kakao-yellow/80` (토큰 일관성)
- `app/(site)/page.tsx` — home hero (BlogFeatured + FeaturedBento) `<div>` → `<section>` 로 wrap, `bg-season-4/40` (light) / `dark:bg-season-4/5` tint 적용

### Plan 가정 vs 현실

- `text-title` utility — plan 은 "이미 정의됨" 가정했으나 실제 `tailwind.config.js` 에 없음. 기존 `text-2xl tablet:text-5xl` 유지. 별도 PR 에서 utility 신설 시 swap
- emoji 는 이미 BlogFeatured 의 📢 1개로 정리되어 추가 sweep 불필요

## 🔧 verification

- `pnpm build` — 통과 (`/admin`, `/admin/login`, `/admin/auth-error`, `/admin/posts`, `/admin/config`, `/admin/seasons` 모두 route 등록)
- `pnpm test` — 37/37 pass
- 헤더 nav 어디에도 admin 링크 노출 없음 — owner 가 직접 URL 입력

## 🚧 Phase 4 — BLOCKED

PLAN_DESIGN_OVERHAUL Phase 4 (Cloudflare Images CDN + season DB schema) 는 다음 외부 결정/계정/secret 모두 확보 필요. 모두 사용자 manual:

- Cloudflare account + Images 활성화
- env: `CLOUDFLARE_ACCOUNT_ID`, `CLOUDFLARE_IMAGES_TOKEN`, `NEXT_PUBLIC_CLOUDFLARE_IMAGES_HASH`
- DB 결정: 현재 MongoDB 위에 `seasons` collection 추가 vs plan 의 Supabase 재선정
- 자산 일괄 마이그레이션 스크립트 (`scripts/migrate-assets-to-cf.ts`)
- `next.config.js` `images.remotePatterns` 에 `imagedelivery.net` 추가

상세: `USER_TASKS.md` 의 '🚧 Phase 4 prerequisites — BLOCKED' 섹션.

## 후속 작업

- Phase 4 완료 후 `/admin/seasons` 의 PaletteExtractor + season CRUD 구현
- `/admin/posts/[slug]/edit` MDX 편집기 (현재 Edit 링크는 placeholder)
- `text-title` / `text-subtitle` utility 정의 후 post 상세 / hero 적용
