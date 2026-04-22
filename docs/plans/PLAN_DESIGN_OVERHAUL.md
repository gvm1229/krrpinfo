# PLAN_DESIGN_OVERHAUL

> 디자인 핸드오프 (`../krrpinfo_design_handoff/`) 를 본 레포 (Next.js 16 + React 19 + Tailwind v4 + shadcn) 위에 단계별로 구현하기 위한 작업 plan. 한 단계가 끝날 때마다 사용자 확인 후 다음 단계로 진행.

---

## 0. 컨텍스트 정리

**Source of truth**

- 디자인 reference: `C:\Users\hojin\Documents\krrpinfo_design_handoff\`
  - `README.md` — 사양 (이게 우선)
  - `colors_and_type.css` — 토큰
  - `ui_kits/website/*` — 공개 사이트 prototype (Babel + inline JSX, production code 아님)
  - `ui_kits/admin/*` — admin dashboard prototype (net-new)
- 본 레포 현재 상태:
  - `src/styles/globals.css` — shadcn zinc tokens 만 존재. `--s-1..--s-5` 시즌 토큰, brand blue, kakao, timeline tag-pill 색 vocab 모두 부재.
  - `tailwind.config.js` — `text-title`, `text-subtitle`, `max-w-10xl`, `scale-103` 등 핸드오프가 가정한 utility는 이미 존재. 추가 작업 거의 불필요.
  - `src/util/utils.ts::formatDate` — `toLocaleDateString()` 호출. locale에 따라 결과가 `2024. 4. 18.` / `4/18/2024` 등으로 갈림 → 사양상 `YYYY-MM-DD` 위반.
  - `src/components/Redeem/RedeemCard.tsx:47` — 수동 `${y}/${m+1}/${d}` (zero-pad 없음, 슬래시).
  - `src/components/Countdown/Countdown.tsx:36-37` — 자체 `formatDate` (MM/DD/YYYY → YYYY/MM/DD).
  - `app/posts/[slug]/page.tsx:101` — `formatDate(post.pub_date)`.
  - `src/components/Blog/Blog.tsx:141`, `BlogFeatured.tsx:34`, `Video/YouTubeModal.tsx:42` — 동일 util 경유.
- DB: 현재 `@supabase/supabase-js` 와 `mongodb` 양쪽 dependency 존재 (`package.json`). `src/lib/supabase.ts` 만 server client 정의. **단일 source of truth가 아직 정해지지 않음** → Phase 4에서 결정 + 통합.
- Image hosting: 현재 `public/assets/images/<S##>/` 정적 자산. CDN 분리 안 됨.

**원칙**

- 디자인 prototype 의 inline `kit.css` / Babel JSX 는 **그대로 옮기지 않음**. shadcn primitives + Tailwind utility + HSL CSS variable 패턴으로 재작성.
- 기존 component 가 있으면 **수정**, 진짜로 net-new 일 때만 새 파일 (Timeline, admin 전 화면).
- AGENTS.md 규칙 준수: 한국어 주석 (단일 `//`, noun-ending, 마침표 없음), `const` 함수형 컴포넌트, server component 기본.
- Strict mode 진행 중이므로 (`PLAN_STRICT.md`) 신규 코드 모두 strict-clean.

---

## Phase 1 — Design tokens diff & merge

**Goal:** `src/styles/globals.css` 와 `tailwind.config.js` 가 핸드오프 사양을 표현 가능하게 만듦. **이 단계는 후속 모든 단계의 전제조건.**

### Step 1.1 — `globals.css` 토큰 확장

- `:root` / `.dark` 양쪽에 추가:
  - `--s-1` (accent), `--s-2` (support), `--s-3` (neutral), `--s-4` (surface), `--s-5` (ink) — light default 는 핸드오프 S25 아레스 값 (`#7c3aed / #ec4899 / #fbcfe8 / #fdf2f8 / #1f1147`). dark 는 surface/ink 반전.
  - `--brand-blue: #2563eb`, `--brand-blue-hover: #3b82f6`, `--brand-blue-dark: #60a5fa`.
  - `--kakao-yellow: #fde047`.
  - Timeline tag-pill 8색 vocab — `--tag-gold #eab308`, `--tag-green #10b981`, `--tag-blue #2563eb`, `--tag-sky #0ea5e9`, `--tag-red #ef4444`, `--tag-yellow #f59e0b`, `--tag-purple #a855f7`, `--tag-orange #f97316`.

### Step 1.2 — Tailwind utility 매핑

- `tailwind.config.js` `theme.extend.colors` 에:
  - `season: { 1..5: 'var(--s-N)' }`
  - `brand: { blue: 'var(--brand-blue)' }`
  - `tag: { gold, green, blue, sky, red, yellow, purple, orange }`
- 나머지 (`text-title`, `text-subtitle`, `max-w-10xl`, `scale-103`, custom screens) — 이미 정의됨, 변경 없음.

### Step 1.3 — 검증

- `pnpm build` 통과.
- 임시 sandbox page (`app/_sandbox/tokens/page.tsx`, gitignore) 에서 새 토큰 시각 확인 후 삭제. (또는 Storybook 부재 시 그냥 제거.)

**Acceptance**

- [ ] light / dark 모두 새 토큰 8개 + 시즌 5개 존재
- [ ] `bg-tag-gold`, `bg-season-1` 등 utility 가 빌드에서 인식
- [ ] 기존 화면 시각 regression 0 (zinc 기반은 그대로)

---

## Phase 2 — Date format sweep (`YYYY-MM-DD`)

**Goal:** 모든 user-facing date 를 `YYYY-MM-DD` 로 통일.

### Step 2.1 — `src/util/utils.ts::formatDate` 재작성

- Input `string | number | Date` → Output `'YYYY-MM-DD'` (zero-pad).
- Locale 의존 제거.

### Step 2.2 — 호출부 정리

- `src/components/Redeem/RedeemCard.tsx:46-49` — 수동 포맷 삭제, util 호출.
- `src/components/Countdown/Countdown.tsx:36-37` — 로컬 `formatDate` 삭제, util import. `currentSeason.targetEndDate` 가 `MM/DD/YYYY` 문자열로 들어오는 부분은 input parsing 만 유지.
- `Blog.tsx`, `BlogFeatured.tsx`, `YouTubeModal.tsx`, `app/posts/[slug]/page.tsx` — 호출 그대로. 결과만 `YYYY-MM-DD` 로 자동 변경됨.

### Step 2.3 — 데이터 입력 layer 점검

- `currentSeason.targetEndDate` 같은 hard-coded string 의 source 위치 확인 (config / DB). 입력 형식이 일관되지 않으면 input parser 한 번 통과시키고 출력은 util 만 사용.

**Acceptance**

- [ ] 사이트 모든 노출 날짜가 `YYYY-MM-DD` 형식
- [ ] `formatDate` 호출은 한 곳 (util)
- [ ] 회귀 테스트: posts list / post detail / redeem / countdown / 유튜브 modal 수동 확인

---

## Phase 3 — Timeline (미래시) component

**Goal:** Home hero 아래에 vertical timeline 마운트.

### Step 3.1 — 데이터 shape 확정

- `src/types/season.ts` (or 적합 위치) 에 `TimelineGroup`, `TimelineItem`, `TimelineCard`, `TagPillColor` type 정의.
- 색 vocab 은 union literal — `'gold' | 'green' | 'blue' | 'sky' | 'red' | 'yellow' | 'purple' | 'orange'`.

### Step 3.2 — 데이터 source (잠정)

- Phase 4 (DB 통합) 전까지는 `src/data/timeline.ts` 정적 모듈. 추후 DB query 로 교체 가능한 형태 유지 (function 시그니처: `getTimeline(): Promise<TimelineGroup[]>`).

### Step 3.3 — 컴포넌트 구현 (`src/components/Timeline/`)

- 파일 분할:
  - `Timeline.tsx` — root, server component. spine + groups render.
  - `TimelineGroup.tsx` — header (dot + date + season chip) + items.
  - `TimelineItem.tsx` — kicker / title / media card.
  - `MediaCard.tsx` — `image` / `unknown` variant.
  - `TagPill.tsx` — strict color vocab via Tailwind class map (no inline style).
  - `Dot.tsx` — `active` / `upcoming` / `future` 3 variant.
- 스타일: prototype 의 `kit.css` 매핑을 모두 Tailwind utility 로 변환. `border-radius: 12px` → `rounded-[12px]` (또는 `rounded-xl` 12px 매칭 확인). spine 은 `absolute left-[47px] w-px bg-zinc-300`. wrap `max-w-[1280px] pl-[120px]`.
- 이미지: `next/image` 로 우선 (CDN 도입 후 src 만 교체 → Phase 4 와 호환).
- Hover / interaction: 사양상 timeline 카드는 lift 없음. 링크만.

### Step 3.4 — Home 마운트

- `app/page.tsx` 에서 hero 직하 import. SSR.

**Acceptance**

- [ ] 5개 시즌 group 렌더링
- [ ] active / upcoming / future dot 색 정확
- [ ] 8색 tag pill vocab 모두 동작
- [ ] unknown 카드 = 회색 `?` + 중앙 정렬된 pill row
- [ ] Mobile (max 720px) 에서 spine padding 축소 + 가독성 유지 (디자인은 desktop 우선이지만 layout 깨짐 없음)
- [ ] dark mode 정상

---

## Phase 4 — DB & Image CDN single source of truth (Cloudflare)

> 여기부터는 admin dashboard 전제. **사용자 결정 필요 항목 다수** — Phase 4 시작 전 별도 합의 권장.

### Step 4.1 — DB 결정

**현재 충돌:** `package.json` 에 `@supabase/supabase-js` + `mongodb` 동시 존재. `src/lib/supabase.ts` 만 wired. MongoDB 사용처 미확인.

**옵션:**

- **A. Cloudflare D1** (SQLite, edge-native) — Cloudflare 단일 vendor. season / post / coupon 정도 규모면 충분. Drizzle ORM 권장.
- **B. Supabase 유지** — 이미 client 코드 존재. PostgreSQL + auth + storage 묶음. Cloudflare 는 image CDN 만 담당.
- **C. MongoDB 유지** — handoff README 가 "MongoDB" 언급. 하지만 schema-less 의 이점이 이 도메인에 적은 편.

→ **권장: B (Supabase DB) + Cloudflare Images (CDN/storage)**. 이유:

- Auth/RLS 가 admin gating 에 바로 사용 가능.
- D1 은 아직 production 부담 (size 제한, region pin 등).
- CDN 만 Cloudflare 분리 = 비용/성능 best.

`mongodb` dep 은 사용처 확인 후 제거 (별도 task).

### Step 4.2 — 스키마 정의 (Supabase / Postgres)

- `seasons` — `id, server (kr|cn), num, name, start_date, end_date, banner_url, palette jsonb {s1..s5, locked: {...}}, status, created_at, updated_at`
- `posts` — 기존 구조 + `pub_date date` (string 아닌 date 타입), `tags text[]`, `kicker`, `thumbnail_url`
- `coupons` — `code, description, expires_at timestamptz, status (new|active|ending|ended)`
- `timeline_items` — `season_id fk, category, title, kicker, duration, media_url nullable, tags jsonb [{c,t}]`
- `site_config` — singleton row, `nav jsonb`, `features jsonb`, etc.
- migration: SQL file 형태로 `supabase/migrations/0001_init.sql` 저장.

### Step 4.3 — Cloudflare Images 통합

- account 생성 + API token 은 사용자 manual task → `USER_TASKS.md` 에 기재.
- env: `CLOUDFLARE_ACCOUNT_ID`, `CLOUDFLARE_IMAGES_TOKEN`, `NEXT_PUBLIC_CLOUDFLARE_IMAGES_HASH`.
- `src/lib/cloudflareImages.ts` — `uploadImage(file): Promise<{id, variants}>`, `deleteImage(id)`.
- `next.config.js` `images.remotePatterns` 에 `imagedelivery.net` 추가.
- Existing `public/assets/images/<S##>/` → 일괄 migration script (`scripts/migrate-assets-to-cf.ts`). 결과: DB 의 `banner_url` 등이 CF URL 로 채워짐. 정적 자산은 backup 으로 유지하다 단계적 제거.

### Step 4.4 — Server-side data layer

- `src/lib/db/seasons.ts`, `posts.ts`, `coupons.ts`, `timeline.ts`, `siteConfig.ts` — typed query 함수.
- Phase 3 의 `getTimeline()` 정적 모듈 → DB 호출로 교체.

**Acceptance**

- [ ] `seasons`, `posts`, `coupons`, `timeline_items`, `site_config` 테이블 존재
- [ ] 기존 자산 모두 CF Images 에 업로드, DB 에 URL 저장
- [ ] 사이트 모든 이미지가 `imagedelivery.net` 경유
- [ ] Timeline 데이터가 DB 에서 hydrate

---

## Phase 5 — Admin dashboard (`/admin`)

**Goal:** 5개 화면 + auth gate.

### Step 5.1 — Auth & shell

- Supabase Auth (email magic link, single admin email allowlist).
- `app/admin/layout.tsx` — server-side check, 미인증 시 `/login` redirect.
- `src/components/Admin/AdminShell.tsx` — sidebar (운영 / 콘텐츠 / 설정 group) + topbar.

### Step 5.2 — Dashboard 화면

- 4 tile (active season, next upcoming, post count, pending drafts) — 단순 query.
- Timeline preview card (link 만, 실제 timeline은 seasons 화면).

### Step 5.3 — Seasons 화면

- 테이블: 배너 thumb, num+name, server (KR/CN), start/end (`YYYY-MM-DD`), status pill, **5-swatch palette strip** (16/20/28/20/16% width).
- Row action: Edit / Duplicate / Archive.
- New-season modal: 이미지 업로드 → `PaletteExtractor` → 저장.

### Step 5.4 — PaletteExtractor (`src/components/Admin/PaletteExtractor.tsx`)

- 이미지 → 5색 추출. Lib 후보:
  - `node-vibrant` (server-side OK, 5색 role 매핑 직접 구현 필요)
  - `colorthief` (브라우저 전용)
  - **권장: `node-vibrant`** + 후처리로 5 role (accent/support/neutral/surface/ink) 매핑. Confidence = vibrant 의 population score.
- UI: 좌측 preview, 우측 5 swatch (hex + confidence + lock toggle), 하단 mock hero preview.
- Lock 된 swatch 는 re-extract 시 보존.

### Step 5.5 — Posts 화면

- 기존 post 데이터 위에 list + editor. MDX 편집기는 1차로 plain `<textarea>` + preview. 추후 고도화.

### Step 5.6 — Config 화면

- nav items, footer CTAs, feature flags, cache controls (revalidate trigger 버튼).
- 모두 `site_config` 단일 row 의 jsonb 편집.

**Acceptance**

- [ ] `/admin` 비인증 차단
- [ ] 5 화면 모두 라우팅 + 기본 CRUD 동작
- [ ] PaletteExtractor 결과가 season row 에 저장되고 사이트에 반영 (시즌 surface tint 변경)
- [ ] Palette strip 은 admin 전용 — 공개 사이트에 누출 없음

---

## Phase 6 — 공개 사이트 잔여 polish

(Phase 1~5 동안 본질이 안 바뀌는 화면들의 시각/copy 정합 작업.)

- Home hero — `var(--s-4)` tinted surface, no gradient.
- Posts index — filter bar + 1/2/3-col grid + 새 BlogCard 스타일.
- Post detail — `text-title` headline, blue-600 MDX heading, TOC rail.
- Redeem — RedeemCard 새 status pill (`new` / `active` / `ending` / `ended`), copy-to-clipboard toast 1500ms.
- Footer — KakaoTalk CTA `bg-[var(--kakao-yellow)] text-black`.
- 이모지 단 1개 (📢 home featured headline) 외 제거.
- Unicode 화살표 `→` CTA tail 통일.

**Acceptance**

- [ ] 핸드오프 README 의 "Content Rules" 전 항목 반영
- [ ] 모든 화면 dark mode parity

---

## 진행 순서 & 사용자 결정 포인트

```
Phase 1 (tokens) ─┬─ Phase 2 (date sweep) ─┐
                  └─ Phase 3 (Timeline) ───┴─ [확인 후 Phase 4 결정]
                                              │
                                              ▼
                                         Phase 4 (DB + CF)
                                              │
                                              ▼
                                         Phase 5 (admin)
                                              │
                                              ▼
                                         Phase 6 (polish)
```

**선결 합의 필요:**

1. **DB 선택** — 위 4.1 옵션 A/B/C 중. 권장 = B (Supabase + Cloudflare Images).
2. **MongoDB dep 처리** — 사용처 grep 후 미사용이면 제거 가능?
3. **Auth 방식** — Supabase magic link / OAuth (Google/GitHub) / 그 외?
4. **Phase 진행 범위** — 사용자 요청대로 "P1 → P2 → P3" 까지 1차 마일스톤, 그 후 P4 결정 회의 후 P5 진행 권장.

---

## Risks & mitigations

| Risk                                                                                | Mitigation                                                                         |
| ----------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| `formatDate` 변경이 의존 외부 데이터 (e.g. Countdown 의 `MM/DD/YYYY` source) 깨뜨림 | Step 2.3 에서 input parser 분리, output 만 일원화                                  |
| Cloudflare Images migration 도중 이미지 깨짐                                        | 정적 자산 backup 유지, 단계적 cutover, env flag 로 src origin 토글 가능하게        |
| Palette extraction 5 role 매핑 휴리스틱 부정확                                      | lock toggle 로 admin 수동 보정, 추출 결과 confidence 노출                          |
| MongoDB dep 제거가 숨은 사용처 깨뜨림                                               | 제거 전 `grep -r "from 'mongodb'" src app` 0건 확인                                |
| Timeline 데이터 DB 이전 시 정적 ↔ DB 시그니처 불일치                                | Phase 3 에서 미리 `getTimeline(): Promise<TimelineGroup[]>` 비동기 시그니처로 작성 |

---

## Verification 전반

- 각 phase 종료 시: `pnpm lint` + `pnpm build` + 수동 시각 검증.
- Phase 3 종료 시: home / posts / post detail / redeem 4개 화면 dark+light 양쪽 스크린샷.
- Phase 4 종료 시: 모든 이미지 origin 이 CF 인지 network tab 확인.
- Phase 5 종료 시: 비로그인 admin 접근 401, 로그인 후 5 화면 CRUD smoke.

---

## 산출물 위치

- 코드: 본 레포.
- 비코드 manual task (CF account, env 등): `USER_TASKS.md` 누적.
- 일일 작업 로그: `docs/logs/YYYYMMDD-{title}.md`.
- 작업 브랜치: `feat/design-overhaul` (큰 task → 별도 branch + PR per phase).
