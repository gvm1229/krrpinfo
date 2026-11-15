# 2026-04-22 — Design tokens / Timeline / Owner admin UI

> version: 0.1.12

## ✨ feat(design)

- `src/styles/globals.css` + `tailwind.config.js` — 시즌 5색 (`--s-1..5`), 브랜드 블루 3종, 카카오 옐로, 태그 8색 (gold/green/blue/sky/red/yellow/purple/orange) vocab 추가
- 기존 zinc shadcn 토큰 무변경
- Tailwind utility: `bg-tag-gold`, `bg-season-1`, `text-brand-blue` 등

## ♻️ refactor(date)

- `src/util/utils.ts::formatDate` — `toLocaleDateString()` 제거, zero-pad YYYY-MM-DD 통일
- `src/components/Countdown/Countdown.tsx`, `src/components/Redeem/RedeemCard.tsx` — 자체 포맷 함수 삭제, util 호출
- `src/__tests__/util/utils.test.ts` — 4 tests

## ✨ feat(timeline)

- `src/types/season.ts` — `TagPillColor`, `DotState`, `MediaCardVariant`, `TimelineGroup` 등 strict types
- `src/data/timeline.ts` — `getTimeline(): Promise<TimelineGroup[]>` 정적 시드 (S24~S28, image/unknown 카드 혼합, 8색 태그 모두 사용)
- `src/components/Timeline/{Timeline,TimelineGroup,TimelineItem,MediaCard,TagPill,Dot}.tsx` — server component 6개. spine `left-[47px] w-px`, wrap `max-w-[1280px] pl-[120px]`. TagPill 은 Tailwind class map (no inline style)
- `app/page.tsx` — hero 직하 `<Timeline />` 마운트

## ✨ feat(auth) — isOwner() defense in depth

- `src/auth.ts` — `isOwner(session)` 헬퍼 named export. `session?.user?.email === env.AUTH_OWNER_EMAIL` 명시 비교
- `proxy.ts` — `/admin/*` gate 에서 `!isOwner(session)` 으로 강화 (signIn callback 변경 대비)

## ✨ feat(admin) — /admin/posts + Edit 링크 (0.1.12)

- `src/lib/queries.ts` — `getAllPostsForAdmin()` 추가 (published filter 없음, `updated_at` desc)
- `app/admin/posts/page.tsx` — server component, `isOwner` 방어 검증, 테이블 (Title/Slug/Date/Status/Edit)
- `app/admin/posts/actions.ts` — `togglePublished` server action:
  - `isOwner` 검증
  - `typeof slug === 'string'` + 정규식 가드, 위반 시 `[actions::togglePublished]` 형식 로그
  - `updateOne` + `revalidatePath` 4경로 (`/`, `/admin/posts`, `/posts`, `/posts/${slug}`)
- `src/components/Admin/PublishedToggle.tsx` — `useTransition` 기반 client toggle
- `app/posts/[slug]/page.tsx` — `isOwner(session)` 일치 시만 Edit 링크 노출 (제목 아래)
- `src/__tests__/actions/togglePublished.test.ts` — 4 tests (세션 없음, 비-owner, 잘못된 slug, owner happy path)

## 🛡 보안 검증 적용 (다중 reviewer 후속)

- security-reviewer FAIL 2건 → 모두 해소
  - `togglePublished` owner email 검증 누락 → `isOwner` 도입
  - public Edit 링크의 session 만 검사 → `isOwner` 적용
- code-reviewer HIGH 2건 → 해소
  - `String(slug)` 무의미 cast → `typeof` + 정규식 가드 + 에러 로그 형식 준수
  - test `as never` cast 제거, 정상 `Session` 타입 사용. updateOne 호출 인자/횟수 명시 assertion 추가
- architect 권고 1건 → 적용
  - `revalidatePath('/')` 추가 (home 의 `getAllPosts()` 캐시 무효화)

## 🔧 verification

- `pnpm test` — 39/39 pass (기존 35 + 신규 togglePublished 2 추가 + utils 4 신규는 합산 후 결과)
- `pnpm test:coverage` — statements/branches/functions/lines 모두 80/70 threshold 상회
- `pnpm build` — 통과 (`/admin`, `/admin/posts`, `/admin/login`, `/admin/auth-error`, `/api/auth/[...nextauth]` route 등록)
- `pnpm lint` — clean (수정 파일만 선별 prettier-write 후 lint pass)

## 후속 작업 (별도 PR)

- PLAN_DESIGN_OVERHAUL Phase 4 — Cloudflare Images + season schema (현 MongoDB+NextAuth 셋업 위에 재설계 필요)
- PLAN_DESIGN_OVERHAUL Phase 5 — PaletteExtractor, season admin, full admin shell
- PLAN_DESIGN_OVERHAUL Phase 6 — public 사이트 polish
- PLAN_OWNER_FEATURES 백로그 — MDX 편집기 (Tiptap or textarea), draft preview, 분석 dashboard, backup 트리거
- Edit 링크 placeholder 의 실제 편집 페이지 (`/admin/posts/[slug]/edit`) 구현
