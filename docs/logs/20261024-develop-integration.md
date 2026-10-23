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
- 원격 Windows/Linux CI와 develop 반영은 진행 중
