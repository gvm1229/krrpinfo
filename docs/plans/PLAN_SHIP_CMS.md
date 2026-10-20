# CMS TODO 단계별 커밋 계획

현재 브랜치 `feat/cms-mvp`에서 이전 커밋을 바꾸지 않고 새 커밋으로 분리한다. 비밀 설정·백업·임시 점검 도구는 제외한다.

각 단계에서 대상 변경과 staged diff를 확인하고 검사한 뒤 다음 단계로 이동한다. 초기 타입 오류를 별도 보존하며 공통 파일은 해당 단계에 필요한 내용만 순서대로 반영한다. 패키지는 새 의존성을 먼저 추가하고 기존 사용처가 사라진 뒤 이전 의존성을 제거한다.

## A. 사용량 30%와 작업 지침 보존

- 메시지: chore(hive): 사용량 30%와 작업 지침 보존
- 검증: 문서·설정 diff와 참조 확인; 제품 시험 생략
- 파일: `.hive/config/harness.toml`, `.hive/config/project-overrides.json`, `AGENTS.md`, `docs/logs/20261021-hive-project-setup.md`, `docs/plans/PLAN_SHIP_HIVE.md`

## B. MVP 계획과 디자인 기준 보존

- 메시지: docs(cms): MVP 계획과 디자인 기준 보존
- 검증: 문서·설정 diff와 참조 확인; 제품 시험 생략
- 파일: `.gitignore`, `DESIGN.md`, `PRODUCT.md`, `docs/plans/PLAN_CMS_MVP.md`, `docs/plans/CMS_DATA_MAP.md`, `docs/logs/20261021-cms-mvp-plan.md`, `docs/plans/PLAN_SHIP_CMS.md`

## C. 기존 작업 브랜치 비교 기록 보존

- 메시지: docs(branch): 기존 작업 브랜치 비교 기록 보존
- 검증: 문서·설정 diff와 참조 확인; 제품 시험 생략
- 파일: `docs/plans/PLAN_OWNER_BRANCH_COMPARISON.md`, `docs/logs/20261021-owner-branch-comparison.md`

## D. 인증 모의 함수 타입 오류 수정

- 메시지: fix(test): 인증 모의 함수 타입 오류 수정 (0.1.15)
- 검증: staged 소스의 TypeScript 검사·대상 포맷 검사, 기능 검사 결과 대조
- 파일: `src/__tests__/actions/saveEdit.test.ts`, `src/__tests__/actions/togglePublished.test.ts`, `package.json`, `docs/logs/20261021-cms-mvp.md`

## E. Supabase와 R2 기반 데이터 계층 추가

- 메시지: feat(cms): Supabase와 R2 기반 데이터 계층 추가 (0.1.16)
- 검증: staged 소스의 TypeScript 검사·대상 포맷 검사, 기능 검사 결과 대조
- 파일: `src/cms/blocks.ts`, `src/cms/client.ts`, `src/cms/media.ts`, `src/cms/owner.ts`, `src/cms/password.ts`, `src/cms/post-content.ts`, `src/cms/render.ts`, `src/cms/repository.ts`, `src/cms/schema.ts`, `supabase/migrations/202610210001_cms.sql`, `src/types/post.ts`, `scripts/cms/db.ts`, `scripts/cms/password.ts`, `app/admin/actions.ts`, `app/admin/preview.ts`, `env.mjs`, `package.json`, `pnpm-lock.yaml`, `docs/logs/20261021-cms-mvp.md`

## F. 기존 콘텐츠와 미디어 이전 도구 추가

- 메시지: feat(migration): 기존 콘텐츠와 미디어 이전 도구 추가 (0.1.17)
- 검증: staged 소스의 TypeScript 검사·대상 포맷 검사, 기능 검사 결과 대조
- 파일: `scripts/cms/migrate.ts`, `scripts/cms/migration.ts`, `scripts/cms/seed.json`, `src/__tests__/cms-migration.test.ts`, `package.json`, `docs/logs/20261021-cms-mvp.md`

## G. Slate와 CodeMirror 본문 편집기 추가

- 메시지: feat(editor): Slate와 CodeMirror 본문 편집기 추가 (0.1.18)
- 검증: staged 소스의 TypeScript 검사·대상 포맷 검사, 기능 검사 결과 대조
- 파일: `src/components/Admin/BlocksEditor.tsx`, `src/components/Admin/MarkdownEditor.tsx`, `src/components/Admin/MediaPicker.tsx`, `src/components/Admin/AdminStyleProvider.tsx`, `src/types/codemirror.d.ts`, `src/vendor/strapi/LICENSE`, `src/vendor/strapi/README.md`, `src/vendor/strapi/withStrapiSchema.ts`, `src/styles/admin.css`, `app/admin/layout.tsx`, `package.json`, `docs/logs/20261021-cms-mvp.md`

## H. 자체 로그인과 콘텐츠 관리 화면 연결

- 메시지: feat(admin): 자체 로그인과 콘텐츠 관리 화면 연결 (0.1.19)
- 검증: staged 소스의 TypeScript 검사·대상 포맷 검사, 기능 검사 결과 대조
- 파일: `app/admin/(authenticated)/config/page.tsx`, `app/admin/(authenticated)/layout.tsx`, `app/admin/(authenticated)/page.tsx`, `app/admin/(authenticated)/posts/[slug]/edit/actions.ts`, `app/admin/(authenticated)/posts/[slug]/edit/page.tsx`, `app/admin/(authenticated)/posts/actions.ts`, `app/admin/(authenticated)/posts/page.tsx`, `app/admin/(authenticated)/seasons/page.tsx`, `app/admin/login/page.tsx`, `app/admin/(authenticated)/content/[kind]/[[...entry]]/page.tsx`, `app/admin/(authenticated)/media/page.tsx`, `app/admin/login/actions.ts`, `src/components/Admin/EditPostForm.tsx`, `src/components/Admin/PublishedToggle.tsx`, `src/components/Admin/ContentList.tsx`, `src/components/Admin/EntryForm.tsx`, `src/components/Admin/LoginForm.tsx`, `src/components/Admin/MediaManager.tsx`, `src/components/Admin/SettingsForm.tsx`, `src/auth.ts`, `proxy.ts`, `src/__tests__/auth.test.ts`, `src/__tests__/actions/saveEdit.test.ts`, `src/__tests__/actions/togglePublished.test.ts`, `src/__tests__/helpers/cms-db.ts`, `src/__tests__/helpers/server-only.ts`, `vitest.config.ts`, `package.json`, `docs/logs/20261021-cms-mvp.md`

## I. 공개 콘텐츠와 운영 설정을 CMS에 연결

- 메시지: feat(site): 공개 콘텐츠와 운영 설정을 CMS에 연결 (0.1.20)
- 검증: staged 소스의 TypeScript 검사·대상 포맷 검사, 기능 검사 결과 대조
- 파일: `app/(site)/layout.tsx`, `app/(site)/page.tsx`, `app/(site)/posts/[slug]/page.tsx`, `app/(site)/posts/page.tsx`, `app/(site)/redeem/page.tsx`, `app/(site)/seasons/page.tsx`, `app/(site)/youtubers/[channelId]/_[videoId]/page.tsx`, `app/(site)/youtubers/[channelId]/error.tsx`, `app/(site)/youtubers/[channelId]/page.tsx`, `app/(site)/youtubers/page.tsx`, `app/(site)/youtubers/videos/page.tsx`, `app/(site)/videos/page.tsx`, `app/(site)/youtubers/[[...legacy]]/page.tsx`, `app/actions/fetchYouTube.ts`, `app/actions/handleYTData.ts`, `app/layout.tsx`, `app/error.tsx`, `app/global-error.tsx`, `app/sitemap.ts`, `config/navBar.ts`, `config/site.ts`, `src/components/Audio/Player.tsx`, `src/components/Blog/Blog.tsx`, `src/components/Blog/BlogFeatured.tsx`, `src/components/Breadcrumb/BreadcrumbContainer.tsx`, `src/components/Card/YouTubeChannelCard.tsx`, `src/components/Command/CommandMenu.tsx`, `src/components/Countdown/Clock.tsx`, `src/components/Countdown/Countdown.tsx`, `src/components/DarkMode/theme-toggle.tsx`, `src/components/Footer/SiteFooter.tsx`, `src/components/Header/MainNav.tsx`, `src/components/Header/MobileNav.tsx`, `src/components/Header/SiteHeader.tsx`, `src/components/Icons/KakaoTalkIcon.tsx`, `src/components/Icons/YouTubeIcon.tsx`, `src/components/Markdown/TableOfContents.tsx`, `src/components/Nexon/RedeemButton.tsx`, `src/components/Nexon/RedeemContainer.tsx`, `src/components/Redeem/RedeemCard.tsx`, `src/components/Timeline/MediaCard.tsx`, `src/components/Video/YouTubeDataInput.tsx`, `src/components/Video/YouTubeModal.tsx`, `src/components/Video/YouTubeModalContent.tsx`, `src/components/Video/YouTubeTimeStampInput.tsx`, `src/components/Video/YouTubeVideoTabs.tsx`, `src/components/Text/PublicSite.tsx`, `src/components/Video/FeaturedVideos.tsx`, `src/api/fetchKRPData.ts`, `src/data/timeline.ts`, `src/lib/markdown.tsx`, `src/lib/queries.ts`, `src/types/index.ts`, `next.config.js`, `proxy.ts`, `src/__tests__/lib/queries.test.ts`, `package.json`, `docs/logs/20261021-cms-mvp.md`

## J. MongoDB와 이전 미디어 의존성 정리

- 메시지: refactor(cms): MongoDB와 이전 미디어 의존성 정리 (0.1.21)
- 검증: staged 소스의 TypeScript 검사·대상 포맷 검사, 기능 검사 결과 대조
- 파일: `scripts/restore-posts.ts`, `src/util/db.ts`, `src/__tests__/helpers/mongo-memory.ts`, `src/__tests__/scripts/restore-posts.test.ts`, `src/__tests__/util/db.test.ts`, `public/assets/audio/네모_ASTERIA_겨울에는캐롤.mp3`, `env.mjs`, `.env.example`, `package.json`, `pnpm-lock.yaml`, `docs/logs/20261021-cms-mvp.md`

## K. 보안 회귀 검사와 두 운영체제 CI 추가

- 메시지: test(cms): 보안 회귀 검사와 두 운영체제 CI 추가 (0.1.22)
- 검증: staged 소스의 TypeScript 검사·대상 포맷 검사, 기능 검사 결과 대조
- 파일: `src/__tests__/cms-content.test.ts`, `src/__tests__/helpers/start-cms-browser.ts`, `src/__tests__/helpers/responsive-page.mjs`, `.github/workflows/test.yml`, `package.json`, `docs/logs/20261021-cms-mvp.md`

## L. 단계별 커밋과 실제 연결 검증 상태 정리

- 메시지: docs(cms): 단계별 커밋과 실제 연결 검증 상태 정리
- 검증: 문서·설정 diff와 참조 확인; 제품 시험 생략
- 파일: `README.md`, `AGENTS.md`, `PR.md`, `docs/logs/20261021-cms-mvp.md`, `docs/plans/PLAN_CMS_MVP.md`, `docs/plans/PLAN_SHIP_CMS.md`

## 공통 파일 분리

- AGENTS.md: A에서 응답·브랜치 규칙만, L에서 CMS 구조 지도 반영
- package.json: D에서 기존 patch 변경만, E에서 새 의존성 추가·이전 의존성 유지, F에서 이전 명령 추가, J에서 이전 의존성/명령 제거
- env.mjs: E에서 기존 연결을 유지하는 추가 설정, J에서 이전 연결 제거
- proxy.ts: H에서 기존 영상 노출 제한 유지, I에서 채널 제거와 함께 제한 제거
- PR.md와 일일 기록: 단계별 결과를 누적하고 완료된 내용만 반영

## 실제 연결 검증

Supabase·R2는 먼저 읽기 전용으로 확인한다. DATABASE_URL과 운영자 로그인 설정이 등록되면 초기 SQL·이전·변경 반영을 이어간다. 원본과 기존 대상 데이터를 보존하며 실제 배포는 별도 승인 범위다.
