# PR: feat/cms-mvp branch

## 현재 검토 범위

- 1인용 CMS를 Next.js·Supabase·R2·NextAuth Credentials/JWT에 연결하고 Strapi의 Slate/CodeMirror 편집 기술과 선별 소스 적용
- 콘텐츠·사이트 설정·공개 문구를 관리자에서 편집하고 공개 화면·검색·메타데이터·사이트맵에 반영
- 완료한 TODO와 설정·문서를 단계별 커밋으로 보존, 최종 0.1.22에서 Windows 테스트 28개·타입·빌드 통과
- Session pooler와 공식 CA로 실제 DB 인증·암호화·서버 인증서 검증 통과. 실제 초기 SQL·항목 144개·고유 미디어 30개 이전·재실행 시 수정값 보존·이미지 참조 31개 바이트 일치 확인
- 실제 익명 DB 접근 거부·Draft 차단·Published 본문과 사이트맵 반영·R2 이미지 최적화 확인
- 사용자가 직접 로그인한 Windows Chrome에서 Blocks 저장·재열기와 승인한 이미지의 실제 R2 업로드·등록·원본 바이트 일치 확인. Blocks 물리적 한글 조합·선택·붙여넣기·실행 취소는 사용자 정상 확인
- Markdown 추가 시험의 형식 변경 확인창은 Chrome 도구 제한으로 사용자 클릭 대기. 실제 미디어 삭제 보호 시험/시험 데이터 정리와 Preview 배포는 승인 대기

## 🐛 본문 형식 선택 보완 (0.1.23)

- 실제 Chrome에서 선택값과 편집기가 어긋나는 현상을 확인하고 본문 형식값을 확인창 전에 보관하도록 수정
- 기존 0.1.22 검증 기록은 해당 버전의 결과이며 이 수정의 검증 결과는 일일 기록에 별도 반영
- 아래는 기반 UI 브랜치에서 이어받은 누적 기록이며 기존 MongoDB·Google·TinyMCE는 현재 CMS에서 제거

## 기존 UI 변경 누적 기록

- `develop` 대비 PLAN_DESIGN_OVERHAUL Phase 1+2+3 (디자인 토큰, 날짜 포맷 통일, Timeline 컴포넌트) 구현
- PLAN_OWNER_FEATURES 백로그의 `/admin/posts` 목록 / published toggle / Edit 링크 owner-only 추가
- 모든 admin 인증 boundary 에 `isOwner()` 명시 검증 도입 (defense in depth)

## 📝 CMS 구현 기반 검토 (2026-10-21)

- MongoDB·NextAuth 브랜치는 PR #109로 develop에 병합됐으며 현재 브랜치에도 포함. 원격 확인 시 develop 대비 13개 추가 커밋, 추가 병합 불필요
- `docs/plans/PLAN_CMS_MVP.md`에 운영자 제한·공개 글 필터 유지, Supabase·NextAuth 자체 로그인·NextAuth JWT 전환 범위 기록. Google 로그인은 제거 대상으로 확정
- Codex 로컬·Windows에서 현재 브랜치의 테스트 47개 통과. TypeScript 검사는 테스트 파일 두 곳에서 오류 14개로 실패
- Windows 복원 스크립트 진입 조건 문제 재현. 실제 로그인·운영 DB·Vercel 배포 동작은 미검증
- 조사 문서만 변경, 코드·데이터·브랜치 병합·배포 미실행
- 병합 상태 재확인 후 로컬 `feat/mongo-nextauth` 삭제 완료. 현재 `feat/owner-ui-overhaul`과 원격 브랜치 유지
- 역할을 마친 별도 브랜치 검토 문서 삭제. 기존 오류와 검증 기록은 일일 기록으로 보존하고 사용자 승인에 따라 타입 오류 정리·MongoDB 의존성 제거·공개 범위 및 권한 제한 테스트를 CMS 계획에 반영

## Changes

## 📝 응답 지침 정리

- `AGENTS.md`의 영어 질문 교정문 자동 추가 규칙과 관련 설명 제거

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

## ✨ TinyMCE 4 self-hosted editor (0.1.15)

- `tinymce@^4.9.11` + `@tinymce/tinymce-react@^3.14` 신규 설치 (LGPL-2.1, no API key)
- `public/tinymce/` 자산 self-host (gitignored, `pnpm setup:tinymce` 으로 재생성)
- KEDITOR ko_KR lang + LICENSE 동봉
- `EditPostForm` textarea → `<Editor>` (dynamic import, ssr:false). `onEditorChange` → state → form action 클로저 패턴
- 6개 input 반복 패턴 → `<TextField>` helper 추출
- toolbar: undo/redo / B I U S / forecolor backcolor / align / lists / link image hr / charmap emoticons codesample / removeformat / code fullscreen

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

## 🛠 Aigent Hive 프로젝트 설정

- Hive 0.13.0 사용자 지정 설정: 한국어 위키, daily-work 기본 23개, 개발·코드 검토·검증 역할
- 프로젝트 지식의 전역 공유 없이 소스와 문서 범위만 설정, 잔여 사용량 10% 중지 기준 상속
- 작업 브랜치 feat/cms-mvp로 변경, AGENTS.md에 커밋 타입 접두사 규칙 추가
- CMS 미완료 작업은 스냅샷으로 보존, 설치 validate와 지식 lint 통과

## 2026-10-21 CMS MVP 재개

- Hive 설치만 2f3a258에 커밋. 이후 프로젝트 사용량 보호 기준을 CLI로 잔여 30%에 설정·현재 세션 확인
- Supabase·R2·자체 로그인, Strapi와 같은 Slate/CodeMirror 기술과 선별 Community 소스, 콘텐츠/설정/미디어 관리자 구현
- 공개 메뉴·홈·글·영상·시즌·쿠폰·문구·메타데이터·검색·사이트맵을 CMS에 연결. MongoDB·Google·TinyMCE·채널 화면·배경음악 제거
- DESIGN.md·PRODUCT.md·CMS_DATA_MAP.md·초기 SQL·중복과 기존 수정값을 보존하는 이전 명령 추가
- Windows 테스트 28개·타입·빌드 통과. 임시 Linux PostgreSQL에서 SQL·권한과 브라우저 Draft 차단/공개 저장 반영 확인. Linux 이전 CLI 시작/오류 종료 통과
- 실제 Supabase·R2·Preview·물리적 한국어 IME는 설정/외부 검증 대기. 계획 실행 결과와 USER_TASKS.md에 구분
- 최초 Hive ship에서는 CMS 변경을 제외했고, 이후 사용자의 단계별 ship 요청으로 TODO별 커밋에 보존. 원격 push·배포는 미실행

- 단계 A: 사용량 30%와 작업 지침 보존 · 0dc230e

- 단계 B: MVP 계획과 디자인 기준 보존 · 36e19d0

- 단계 C: 기존 작업 브랜치 비교 기록 보존 · 629c73a

- 단계 D: 인증 모의 함수 타입 오류 수정 (0.1.15) · b56b150

- 단계 E: Supabase와 R2 기반 데이터 계층 추가 (0.1.16) · ad2209a

- 단계 F: 기존 콘텐츠와 미디어 이전 도구 추가 (0.1.17) · 1214e02

- 단계 G: Slate와 CodeMirror 본문 편집기 추가 (0.1.18) · 9dec421

- 단계 H: 자체 로그인과 콘텐츠 관리 화면 연결 (0.1.19) · a13d7e0

- 단계 I: 공개 콘텐츠와 운영 설정을 CMS에 연결 (0.1.20) · 7349efe

- 단계 J: MongoDB와 이전 미디어 의존성 정리 (0.1.21) · 6a95ef4

- 단계 K: 보안 회귀 검사와 두 운영체제 CI 추가 (0.1.22) · 91bdd15
