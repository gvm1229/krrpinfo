# PR: feat/owner-ui-overhaul branch

## Summary

- `develop` 대비 PLAN_DESIGN_OVERHAUL Phase 1+2+3 (디자인 토큰, 날짜 포맷 통일, Timeline 컴포넌트) 구현
- PLAN_OWNER_FEATURES 백로그의 `/admin/posts` 목록 / published toggle / Edit 링크 owner-only 추가
- 모든 admin 인증 boundary 에 `isOwner()` 명시 검증 도입 (defense in depth)

## Changes

## ✨ Design tokens (P1)

- `src/styles/globals.css` 와 `tailwind.config.js` 에 시즌 5색 (`--s-1..5`), 브랜드 블루 3종, 카카오 옐로, 태그 8색 vocab 추가
- 기존 zinc shadcn 토큰은 무변경
- Tailwind utility: `bg-tag-gold`, `bg-season-1`, `text-brand-blue` 등 사용 가능

## ♻️ Date format sweep (P2)

- `src/util/utils.ts::formatDate` — `toLocaleDateString()` locale 의존성 제거. zero-pad YYYY-MM-DD 단일 출력
- `src/components/Countdown/Countdown.tsx`, `src/components/Redeem/RedeemCard.tsx` — 자체 포맷 함수 삭제, util 호출로 통일
- `src/__tests__/util/utils.test.ts` — 4 tests (zero-pad / ISO / epoch / 12월 경계)

## ✨ Timeline (P3)

- `src/types/season.ts` — `TagPillColor`, `DotState`, `TimelineGroup` 등 strict union/interface
- `src/data/timeline.ts` — `getTimeline(): Promise<TimelineGroup[]>` 정적 시드 (S24~S28). 추후 DB 연동 시 본 함수 시그니처 유지하고 내부만 교체
- `src/components/Timeline/{Timeline,TimelineGroup,TimelineItem,MediaCard,TagPill,Dot}.tsx` — server component 6개. spine + group header + media card + tag pill + dot variant
- `app/page.tsx` — hero 직하 `<Timeline />` 마운트

## ✨ isOwner() helper

- `src/auth.ts` — `isOwner(session)` named export. owner 이메일 명시 검증
- `proxy.ts` — `/admin/*` gate 에서 `!isOwner(session)` 사용
- 모든 admin gate (page.tsx, action, Edit 링크) 에서 통일

## ✨ /admin/posts (owner 전용 백로그 #1, #2, #4)

- `src/lib/queries.ts` — `getAllPostsForAdmin()` 추가 (published filter 없음, `updated_at` desc)
- `app/admin/posts/page.tsx` — server component, `isOwner` 방어 검증 후 테이블 렌더링 (Title/Slug/Date/Status/Edit)
- `app/admin/posts/actions.ts` — `togglePublished(slug, next)` server action:
  - `isOwner` 검증
  - `typeof slug === 'string'` + `^[a-z0-9-]+$` 정규식 가드, 위반 시 `[actions::togglePublished]` 형식 error log
  - MongoDB `updateOne({ slug }, { $set: { published, updated_at } })`
  - `revalidatePath('/')`, `/admin/posts`, `/posts`, `/posts/${slug}` 4회
- `src/components/Admin/PublishedToggle.tsx` — `useTransition` 기반 client component
- `app/posts/[slug]/page.tsx` — owner-only Edit 링크 (제목 아래)
- `src/__tests__/actions/togglePublished.test.ts` — 4 tests:
  - 세션 없음 → Unauthorized
  - 비-owner 세션 → Unauthorized (방어 검증)
  - 잘못된 slug → Invalid slug
  - owner → updateOne 정확한 인자 + revalidatePath 4회

## 🚀 Admin shell + dashboard tiles (Phase 5)

- Next.js route group 으로 frontend chrome 와 admin shell 완전 분리:
  - `app/(site)/layout.tsx` — SiteHeader / SiteFooter / ScrollToTop
  - `app/admin/(authenticated)/layout.tsx` — admin sidebar + topbar (Sign Out)
  - `/admin/login`, `/admin/auth-error` 는 group 밖 — 두 chrome 모두 미상속
- `/admin` Dashboard — 4 tile (전체 포스트 / 게시됨 / 드래프트 / 최근 업데이트)
- `/admin/posts` — 기존 테이블 layout shell 안으로 정돈
- `/admin/config` — placeholder (nav/footer/features/cache 예정 항목)
- `/admin/seasons` — placeholder + Phase 4 prerequisite 안내 banner
- `app/not-found.tsx` — server component 로 변환 ('use client' + metadata 충돌 해소)

## 🎨 Phase 6 minimum polish

- Footer KakaoTalk CTA → `bg-kakao-yellow` 토큰
- Home hero `<section>` → `bg-season-4/40` (light) / `dark:bg-season-4/5`
- 포스트 상세 h1 → `tablet:text-title` (2.5rem, tailwind fontSize 토큰)

## ✨ MDX post editor (0.1.14)

- `/admin/posts/[slug]/edit` 신규 — owner 전용 textarea 기반 MDX 편집기
- `saveEdit` server action — `isOwner` gate, slug `^[a-z0-9-]+$` 정규식, 필드 길이 / 태그 개수 가드, KST timezone 명시 pubDate, `updateOne` matchedCount 검증, revalidatePath 4경로 + redirect
- `EditPostForm` client component — `useTransition` 기반
- `getPostByAnySlug` 신규 query — published 필터 없이 draft 포함 조회 (editor 전용)
- 모든 Edit 링크 → 실제 라우트로 wire-up
- 10 tests (allow/reject/missing/profile-fallback/대문자 slug/필드 초과/태그 초과/matchedCount=0/빈 keywords/happy path)

## 🔧 Version

- `package.json` `0.1.11` → `0.1.12` → `0.1.13`
- `docs/logs/20260422-design-and-owner-ui.md`
- `docs/logs/20260423-admin-shell-and-polish.md`

## 사용자 후속 작업

- `/admin/posts?edit=...` 의 실제 편집 UI (MDX editor) 는 후속 PR. 현재는 placeholder 링크
- PLAN_DESIGN_OVERHAUL Phase 4-6 (Cloudflare Images, season schema, PaletteExtractor, polish) 별도 PR — 본 브랜치 scope 외
- Vercel 환경변수 점검 — 신규 env 변경 없음
