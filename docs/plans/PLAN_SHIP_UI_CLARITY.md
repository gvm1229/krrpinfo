# UI 개선 커밋과 원격 반영

> 2026-10-23 · feat/cms-mvp · 사용자 commit 및 push 승인

기존 구현을 관심사별로 순서대로 커밋하고 origin의 동일 작업 브랜치로 일반 push. 기록 변경·강제 push·보호 브랜치 병합·tag 생성 제외.

## 커밋 대응표

### 1. ✨ feat(ui): 공통 긴 글 입력과 작업 확인창 추가

- 대상: `src/components/ui/textarea.tsx`, `src/components/ui/alert-dialog.tsx`
- 가까운 검증: staged diff와 공백 검사, 대상 Prettier와 Windows TypeScript
- 독립 의도: 공통 긴 글 입력과 작업 확인창 추가

### 2. 🐛 fix(site): 공개 카드와 시즌의 모바일 넘침 수정

- 대상: `app/(site)/layout.tsx`, `app/(site)/page.tsx`, `app/(site)/posts/page.tsx`, `app/(site)/videos/page.tsx`, `app/(site)/seasons/page.tsx`, `app/(site)/redeem/page.tsx`, `src/components/Blog/Blog.tsx`, `src/components/Countdown/Countdown.tsx`, `src/components/Timeline/Timeline.tsx`, `src/components/Timeline/TimelineGroup.tsx`, `src/components/Timeline/MediaCard.tsx`, `src/components/Video/FeaturedVideos.tsx`, `src/components/Nexon/RedeemContainer.tsx`, `src/components/Redeem/RedeemCard.tsx`
- 가까운 검증: staged diff와 공백 검사, 대상 Prettier와 Windows TypeScript
- 독립 의도: 공개 카드와 시즌의 모바일 넘침 수정

### 3. ✨ feat(navigation): 공개와 관리자 메뉴의 현재 위치 표시

- 대상: `src/components/Header/SiteHeader.tsx`, `src/components/Command/CommandMenu.tsx`, `src/components/Admin/AdminNavigation.tsx`, `app/admin/(authenticated)/layout.tsx`; src/styles/admin.css의 현재 메뉴 표시 hunk
- 가까운 검증: staged diff와 공백 검사, 대상 Prettier와 Windows TypeScript
- 독립 의도: 공개와 관리자 메뉴의 현재 위치 표시

### 4. 🐛 fix(media): 이미지 선택창과 삭제 확인 흐름 개선

- 대상: `src/components/Admin/MediaPicker.tsx`, `src/components/Admin/MediaManager.tsx`; src/styles/admin.css의 미디어 창 간격 hunk
- 가까운 검증: staged diff와 공백 검사, 대상 Prettier와 Windows TypeScript
- 독립 의도: 이미지 선택창과 삭제 확인 흐름 개선

### 5. ✨ feat(admin): 콘텐츠 상태와 변경 동작 구분

- 대상: `src/components/Admin/ContentList.tsx`, `app/admin/(authenticated)/page.tsx`
- 가까운 검증: staged diff와 공백 검사, 대상 Prettier와 Windows TypeScript
- 독립 의도: 콘텐츠 상태와 변경 동작 구분

### 6. ✨ feat(editor): 저장 영역 고정과 콘텐츠 정보 분리

- 대상: `src/components/Admin/EntryForm.tsx`; src/styles/admin.css의 입력 높이·초점 이동 여백·편집 열 너비 hunk
- 가까운 검증: staged diff와 공백 검사, 대상 Prettier와 Windows TypeScript
- 독립 의도: 저장 영역 고정과 콘텐츠 정보 분리

### 7. ✨ feat(settings): 관련 설정을 묶고 저장 결과 구분

- 대상: `src/components/Admin/SettingsForm.tsx`
- 가까운 검증: staged diff와 공백 검사, 대상 Prettier와 Windows TypeScript
- 독립 의도: 관련 설정을 묶고 저장 결과 구분

### 8. 🔧 chore(version): UI 개선 patch 버전 반영 (0.1.26)

- 대상: `package.json`
- 가까운 검증: staged diff와 공백 검사, 대상 Prettier와 Windows TypeScript
- 독립 의도: UI 개선 patch 버전 반영 (0.1.26)

### 9. 📝 docs(ui): 화면 개선과 검증 및 커밋 계획 기록

- 대상: `AGENTS.md`, `DESIGN.md`, `PR.md`, `docs/plans/PLAN_UI_CLARITY.md`, `docs/logs/20261022-ui-clarity.md`, `docs/plans/PLAN_SHIP_UI_CLARITY.md`, `docs/logs/20261023-ship-ui-clarity.md`
- 가까운 검증: staged diff와 공백 검사, 문서 내용 대조
- 독립 의도: 화면 개선과 검증 및 커밋 계획 기록

## 검증과 결과

- 구현 시 Windows·Chrome 54개 화면 조합·Vitest 32개·타입·빌드 검증은 기존 일일 기록 참조
- 이번 ship은 staged 경계·변경 파일 형식·타입과 원격 HEAD 일치를 검증. 실제 기기·R2·Linux·배포 상태를 새로 입증하지 않음
