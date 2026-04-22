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

## 🔧 Version

- `package.json` `0.1.11` → `0.1.12`
- `docs/logs/20260422-design-and-owner-ui.md` 신규 작성

## 사용자 후속 작업

- `/admin/posts?edit=...` 의 실제 편집 UI (MDX editor) 는 후속 PR. 현재는 placeholder 링크
- PLAN_DESIGN_OVERHAUL Phase 4-6 (Cloudflare Images, season schema, PaletteExtractor, polish) 별도 PR — 본 브랜치 scope 외
- Vercel 환경변수 점검 — 신규 env 변경 없음
