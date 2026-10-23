# UI 변경 커밋과 develop 통합

> 2026-10-24 · 사용자의 ship, 원격 push 및 모든 develop 작업 브랜치 병합 요청

## 범위

- 현재 feat/cms-mvp의 UI 변경을 검토 가능한 관심사로 나누어 커밋하고 push
- owner-ui-overhaul은 cms-mvp의 조상이며 함께 포함되는 관계 확인
- develop 이후의 Dependabot 작업 브랜치 3개도 포함: Next.js 16.2.11, NextAuth 5.0.0-beta.32, PostCSS ^8.5.23
- 고정 프로덕션 브랜치 release는 작업 브랜치에서 제외, 기존 stash와 브랜치 보존
- 현재 package.json의 0.1.27 증가를 유지하며 중복 증가 없음

## 커밋 대응표

각 코드 커밋은 staged diff와 공백, 대상 Prettier, Windows TypeScript를 확인한다. UI 렌더와 테스트·빌드의 0.1.27 결과는 앞선 구현 증거를 유지한다. 의존성 병합 뒤에는 설치·테스트·타입·빌드를 새로 실행한다.

| 순서 | 의도와 메시지                                               | 정확한 경로 또는 변경 구간                                                                                                                                                |
| ---- | ----------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1    | 🐛 fix(theme): 공통 색상과 관리자 입력 대비 통일            | src/styles/globals.css, tailwind.config.js 전체; src/styles/admin.css에서 전환 시간과 움직임 줄이기 구간 제외; src/components/Video/FeaturedVideos.tsx에서 색상 구간만    |
| 2    | 🐛 fix(motion): 버튼과 메뉴의 색 전환 및 움직임 줄이기 통일 | src/components/ui/button.tsx; src/styles/admin.css와 src/components/Video/FeaturedVideos.tsx의 남은 전환 구간                                                             |
| 3    | 🐛 fix(site): 공개 화면의 글자 크기와 정보 위계 정리        | app/(site)/page.tsx, src/components/Blog/Blog.tsx, src/components/Countdown/Countdown.tsx, src/components/Header/SiteHeader.tsx, src/components/Timeline/TimelineItem.tsx |
| 4    | 🐛 fix(theme): 테마 선택 상태와 키보드 초점 복원            | src/components/DarkMode/theme-toggle.tsx                                                                                                                                  |
| 5    | 🐛 fix(tags): 태그 펼침 접근성과 크기 변경 처리 수정        | src/components/Tag/Tag.tsx                                                                                                                                                |
| 6    | 🐛 fix(search): 검색 입력 이름과 닫기 초점 복귀 추가        | src/components/Command/CommandMenu.tsx, src/components/ui/command.tsx                                                                                                     |
| 7    | 🐛 fix(auth): 로그인 입력과 진행 상태 표시 통일             | src/components/Admin/LoginForm.tsx                                                                                                                                        |
| 8    | 🐛 fix(admin): 모바일 대시보드 제목과 상태 배치 수정        | app/admin/(authenticated)/page.tsx                                                                                                                                        |
| 9    | 🐛 fix(settings): 설정 제목과 오류 글씨 정리                | src/components/Admin/SettingsForm.tsx                                                                                                                                     |
| 10   | 🔧 chore(version): UI 후속 개선 patch 버전 반영 (0.1.27)    | package.json의 version 구간만                                                                                                                                             |
| 11   | 📝 docs(ui): UI 후속 개선 기준과 검증 및 통합 계획 기록     | DESIGN.md, PR.md, docs/logs/20261023-ship-ui-clarity.md, docs/logs/20261024-develop-integration.md, docs/plans/PLAN_UI_REFINEMENT.md, 본 계획                             |

## 통합 순서

1. 위 커밋을 순서대로 생성하고 feat/cms-mvp를 일반 push
2. 해당 브랜치에 Dependabot 3개를 하나씩 이력 보존 병합. 충돌은 현재 CMS 구성을 유지하면서 해당 의존성 변경만 적용하고 잠금 파일 재생성
3. 최종 의존성 설치와 Windows 테스트·타입·빌드, 변경 파일 형식 검사
4. 기존 PR #116을 최종 내용으로 갱신하고 Draft 해제. Windows/Linux CI를 확인한 뒤 merge 방식으로 develop에 통합
5. 로컬 develop를 원격과 동기화하고 5개 원본 브랜치의 끝 커밋이 모두 포함됨을 확인. 결과는 20261024 일일 기록에 추가

## 진행

- 원격 갱신과 브랜치 관계 확인 완료
- 코드 관심사 1~9와 버전 10 커밋 완료: 8a36161, f1ff2e1, 6ef3ab9, 9f1ec04, 96cce13, c51be78, 40c9218, 9c5964b, b4e011a, 38831e1
- 모든 코드 커밋의 변경 구간과 내용 해시, Windows Prettier·TypeScript 및 Git hook 통과 확인
- 문서 커밋과 원격 push 뒤 의존성 통합 진행 예정

## 로컬 통합 결과

- 문서 커밋 5143cb2와 앞선 10개 커밋을 feat/cms-mvp에 push하고 원격 끝 커밋 일치 확인
- Next.js는 342acca, NextAuth는 f3faf1b, PostCSS는 575dfeb에서 각 원본 브랜치의 이력을 보존해 병합
- 각 package.json 충돌은 현재 CMS 항목을 유지하고 해당 의존성만 변경. pnpm-lock.yaml은 현재 잠금 상태를 기준으로 생성하고 frozen 설치 확인
- 직접 설치 버전 Next.js 16.2.11, NextAuth 5.0.0-beta.32, PostCSS 8.5.23 확인. 기존 범위에 있던 공유 하위 의존성은 pnpm의 중복 정리 반영
- Codex·Windows에서 최종 Vitest 32개, TypeScript incremental 해제 검사, pnpm build, 이전 명령 --help 통과
- 실제 로컬 production 서버에서 로그인 HTML, Credentials 제공자와 비인증 세션 HTTP 200, 관리자 비인증 HTTP 307 확인. 실제 DB 로그인과 배포 검증은 제외
- 소스 파일 Prettier 통과. 생성된 잠금 파일은 pnpm 기본 형식을 유지하므로 Prettier의 재형식 경고를 예외로 처리하고 frozen 설치로 구조 일치 검증
- 원격 CI 및 develop 병합 진행 중
