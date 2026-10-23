# 2026-10-24 — UI 후속 변경 커밋과 develop 통합

> version: 0.1.27 · feat/cms-mvp → develop

## 🐛 fix

- 공통 색상과 관리자 입력 대비, 버튼과 메뉴 전환, 공개 글자 크기, 테마 선택, 태그 펼침, 검색 초점, 로그인 입력, 대시보드 배치, 설정 문구를 9개 독립 커밋으로 구분
- 공유 CSS의 색상과 전환 변경은 부분 staging으로 분리. 커밋 직전 검토한 내용과 index 및 hook 적용 뒤 커밋의 내용 해시 일치 확인
- 구현과 실제 UI 검증 범위는 20261023-ship-ui-clarity.md에 보존

## 🔧 chore

- 기존 0.1.26 → 0.1.27 변경은 별도 버전 커밋 38831e1로 보존. 이번 ship에서 중복 증가 없음
- 사용자가 현재 변경의 원격 push와 develop 작업 브랜치 전체 병합을 명시 요청
- owner-ui-overhaul은 cms-mvp의 조상이며 Next.js·NextAuth·PostCSS 업데이트 브랜치 3개를 추가 통합할 예정. release는 프로덕션 고정 브랜치로 구분

## 📝 docs

- DESIGN.md, UI 후속 계획, 당일 기록, PR.md 및 PLAN_SHIP_UI_REFINEMENT.md에 변경·검증·커밋 대응표 보존

## 검증

- Codex·Windows에서 코드 관심사별 Prettier와 TypeScript, Git 공백 검사 및 기존 commit hook 통과. 현재 UI 코드와 각 커밋 내용 보존을 확인한 범위
- 의존성 통합 뒤의 설치·테스트·빌드와 원격 Windows/Linux CI는 다음 단계에서 실행하며, 현재 통과로 기록하지 않음

## 🔧 chore — 의존성 브랜치 병합

- UI 변경 11개 커밋을 5143cb2까지 feat/cms-mvp에 push하고 원격 SHA 일치 확인
- Next.js 16.2.11(342acca), NextAuth 5.0.0-beta.32(f3faf1b), PostCSS 8.5.23(575dfeb)을 각각 merge commit으로 연결
- 현재 CMS의 package.json과 pnpm-lock.yaml을 기준으로 충돌 해결. MongoDB·이전 편집기 등 제거한 구성을 되살리지 않고 각 의존성 변경만 반영
- pnpm이 선택하는 최신 patch로 범위를 넓히지 않고 직접 설치한 PostCSS는 원본 작업 브랜치와 같은 8.5.23으로 고정 확인

## 로컬 최종 검증

- Codex·Windows에서 frozen 잠금 설치, 테스트 32개, TypeScript incremental 해제 검사, 프로덕션 빌드, 이전 명령 --help 통과
- 업데이트된 Next.js production 서버에서 로그인 화면·Credentials 제공자·빈 세션 HTTP 200과 관리자 비인증 HTTP 307 확인. 실제 Supabase, 비밀번호 로그인, R2, 배포 환경을 증명하는 결과는 아님
- 소스 Prettier와 Git 공백 검사 통과. pnpm-lock.yaml은 생성기의 기본 형식이므로 Prettier 재형식 경고를 유지하고 frozen 설치로 package.json 일치 확인
- 앞선 UI의 36개 배치 검증은 의존성 업데이트 전 증거이며 이번에는 브라우저 검사를 반복하지 않음
- 원격 PR의 Windows/Linux Test 39976033415에서 최종 883abbb의 테스트·타입·이전 명령 시작 확인 통과. Vercel 빌드와 GitGuardian 상태도 성공

## develop 통합 결과

- 기존 PR #116의 제목과 설명을 0.1.27 최종 내용으로 갱신하고 Draft 해제 후 merge 방식으로 병합, 커밋 c3b73ef
- GitHub 연결 도구의 PR 쓰기는 403 Resource not accessible by integration으로 지원되지 않아, 동일 gvm1229 계정의 기존 GitHub CLI로 실행. 검사 우회나 권한 변경 없음
- 원격·로컬 develop에서 작업 브랜치 5개의 끝 커밋 포함 확인. owner-ui-overhaul은 cms-mvp의 조상으로 함께 포함
- develop 전체 파일 트리가 검증한 883abbb와 일치. release와 origin/release는 dd852c5로 보존
- 최종 결과 문서는 별도 docs commit으로 develop에 push하며 코드나 버전 변경 없음. 자동 push CI는 해당 문서 커밋에 대해 별도로 확인
- 실제 휴대전화·스크린 리더·운영 Supabase/R2·프로덕션 배포는 이번 통합 단계에서 실행하지 않았으며 CI 통과만으로 증명하지 않음
