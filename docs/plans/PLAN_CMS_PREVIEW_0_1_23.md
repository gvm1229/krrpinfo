# CMS 0.1.23 Preview 배포 실행 계획

> 2026-10-21 · feat/cms-mvp · 원격 push와 0.1.23 Vercel Preview 배포 사용자 승인 완료

## 범위

- 기존 로컬 검증 결과와 실제 Supabase/R2 데이터를 보존하고 기존 Vercel 프로젝트에 Preview 배포
- 운영 배포·보호 브랜치 병합·stable tag는 승인 범위에서 제외
- 비밀값은 Git·대화·명령 인수에 기록하지 않고 필요한 Preview 범위만 설정

## 실행과 확인

1. 기존 Vercel 인증·프로젝트·Git 연결·Preview 환경변수 확인, 필요한 로컬 연결 정보는 해당 Preview에만 적용
2. 저장소의 현행 CI는 PR에서 실행되므로 develop 대상 Draft PR을 준비하고 feat/cms-mvp를 원격으로 push
3. Windows/Linux CI의 실제 완료 결과와 Vercel Preview 빌드 상태 확인, 실패는 원인에 맞춰 처리하고 결과 구분
4. 실제 Preview에서 공개 페이지·기존 글·영상·이미지·주소 이동·관리자 접근 제한 확인
5. 실제 운영자 로그인과 저장 반영·Draft 비노출·R2 업로드를 확인하고 에이전트가 만든 시험 항목만 정리
6. 배포 주소·커밋·실행 호스트·시험 범위·실패/미검증 범위를 계획과 일일 기록에 반영하고 단계별 커밋

## 커밋 구분

| 관심사           | 파일                                       | 가까운 검증                        | 제안 메시지                                      |
| ---------------- | ------------------------------------------ | ---------------------------------- | ------------------------------------------------ |
| 승인된 배포 계획 | 이 파일, 일일 기록, PR.md                  | 승인 범위·CI 조건·문서 diff와 형식 | 📝 docs(cms): 0.1.23 Preview 배포 실행 계획 기록 |
| 배포 결과        | 이 파일, PLAN_CMS_MVP.md, 일일 기록, PR.md | 실제 CI·배포·HTTP·브라우저 증거    | 📝 docs(cms): Preview 배포 검증 결과 기록        |

제품 코드 변경이 필요하면 독립된 수정·검증·커밋으로 구분한다. 새 버전 배포는 그 버전에 대한 승인 규칙을 따른다.

## 현재 상태

- 원격 브랜치: feat/cms-mvp, 배포 기준 커밋 0734294. [Draft PR #116](https://github.com/gvm1229/krrpinfo/pull/116), [원격 CI](https://github.com/gvm1229/krrpinfo/actions/runs/39565236970)의 Windows/Linux 검사 모두 통과
- 기존 Vercel krrpinfo 프로젝트에 연결했고 운영 브랜치는 release로 확인. feat/cms-mvp Preview 전용 환경변수 11개 등록, 운영 환경변수 메타데이터 불변 확인. 초기 SQL용 DATABASE_URL은 로컬에 유지
- [Preview](https://krrpinfo-git-feat-cms-mvp-gvm1229s-projects.vercel.app) 재배포 Ready 확인. 기존 Vercel 로그인 보호 유지, 인증하지 않은 일반 HTTP 요청은 Vercel SSO로 이동
- R2의 기존 localhost 출처·GET/PUT·Content-Type·ETag·3600초를 유지하고 Preview 별칭 출처만 추가. 두 출처의 실제 CORS 사전 요청 HTTP 204 확인
- Codex·Windows Chrome에서 Preview 홈·추천 영상 분류 7/8/7/11개·첫 번째 기존 글과 R2 이미지 정상 확인. 새 탭에서 실제 운영자 대시보드 로그인 정상 확인
- 실제 Preview 운영자 화면에서 Draft 작성·서명 업로드·완료 등록·저장·재열기·공개 전환 확인. R2 파일 크기/형식/원본 바이트 일치, Vercel 요청 로그에서 GET 404 → 200 → 404 확인
- 시즌·쿠폰 화면·이전 유튜버 주소의 /videos 이동·robots 관리자 제외·사이트맵의 기존 글 포함/관리자 제외 확인. 공개 영상 33개 식별자가 DB와 모두 일치
- 시험 글·새 미디어 사본만 백업 후 정리하고 기존 글 2개·영상 33개·미디어 30개와 나머지 DB 값 보존 확인
- 두 번째 기존 글 /posts/prevent-roll-notice의 10초 제한과 한국 날짜 표시 오류를 발견해 아래 로컬 수정 완료. 현재 원격은 여전히 0.1.23이며 수정본 배포는 미실행
- `agent-owned`: 승인 전 독립적으로 진행할 로컬 수정·검증 작업 없음
- `awaiting-user-authority`: 623668c·43dfabc를 포함한 0.1.25 원격 push·Preview 배포 승인 필요. 승인 후 새 CI와 기존 글 초기 처리·한국 날짜를 실제 Preview에서 확인
- `awaiting-user-authority`: 운영 배포·보호 브랜치 통합은 이번 작업 범위 밖

참고: [Vercel 환경변수 CLI](https://vercel.com/docs/cli/env), [프로젝트 지침](../../.agents/directives/00-project-harness.md)

## 기존 MDX 초기 처리 최소 수정 계획

- 실제 Next.js Windows 프로덕션 서버에서 동일 기존 글의 첫 조회 9146ms, 이후 297ms로 확인. @shikijs/rehype 4.0.2는 기본값으로 모든 언어를 초기화하며 코드 없는 본문에도 실행되는 경로 확인
- 코드 블록이 있을 때만 기존 Shiki 플러그인을 불러오고 같은 옵션으로 실행. 기존 원문·이미지·서식·코드 색상은 보존
- 변경 대상: `src/lib/markdown.tsx`, `src/__tests__/cms-legacy-markdown.test.ts`, `package.json` patch, 필수 일일 기록과 PR.md
- 검증: 코드 없는 MDX의 불필요한 색칠기 로딩 차단·본문 보존·코드 블록 색상 유지·기존 테스트·타입·빌드·실제 프로덕션 서버의 초기 처리 시간
- 커밋 관심사: 기존 MDX 초기 처리 지연 수정. 새 버전은 0.1.24이며 로컬 결과를 먼저 검증하고 배포 전에 해당 버전 승인 규칙을 적용

## 공개 날짜의 한국 시간 표시 수정 계획

- Preview 입력 날짜 2026-10-21이 공개 화면에서 2026-10-20으로 표시되는 현상 확인. formatDate가 서버 현지 시간대를 사용하므로 한국 시간으로 고정
- 변경 대상: `src/util/utils.ts`의 `formatDate`만 수정, `src/__tests__/cms-date.test.ts`, `package.json` patch, 필수 일일 기록과 PR.md
- 검증: UTC 조건에서 날짜 경계 회귀 실패 재현 후 한국 날짜·날짜만 있는 문자열·Date/숫자 입력 확인, 전체 테스트·타입·빌드
- 제안 커밋: 🐛 fix(cms): 공개 날짜를 한국 시간으로 표시 (0.1.25). 원본 DB 날짜는 변경하지 않으며 새 버전 배포 승인은 로컬 검증 후 요청

## 후속 로컬 수정 결과와 다음 배포

- 623668c(0.1.24): 코드 없는 MDX의 Shiki 초기화를 생략. 새 프로세스·고유 캐시 키의 같은 기존 본문 첫 조회 9146ms → 423ms, 반복 177ms. 코드 서식 보존 포함 테스트 30개·타입·빌드 통과
- 43dfabc(0.1.25): 공개 날짜를 Asia/Seoul로 표시. UTC 조건의 기존 함수 회귀 실패 2개 재현 후 전체 테스트 32개·타입·빌드 통과
- 최종 0.1.25 로컬 프로덕션의 고유 시험 항목에서 HTTP 200·한국 날짜·기존 본문 표시 확인, 첫 조회 548ms/반복 283ms. 호스트는 Codex·Windows·Asia/Seoul이며 UTC 날짜 검사는 별도 단위 테스트다. Vercel 성능 결과로 일반화하지 않음
- 브라우저 JavaScript 39개에서 현재 서버 비밀값 7종 문자열 미검출. 시험 항목은 모두 정리했고 원본은 보존
- 강제 종료·캐시 삭제 명령은 자동 승인 검토에서 차단되어 미실행. 세션의 정상 중단과 고유 시험 항목으로 대체했다. 로컬 시험 프로세스의 AUTH_URL 설정도 차단되어 사용하지 않았으며, 별도 로컬 서버는 공개 SSR만 확인했다. 실제 인증은 Preview 브라우저에서 통과
- 일반 Node/tsx 단독 MDX 측정은 ESM 로딩 오류로 미실행. 실제 Next.js 프로덕션 서버로 대체해 측정했고 기존 신뢰 호스트 설정이 없는 로컬 프로덕션의 세션 확인은 검증 범위 밖
- 전체 저장소 pnpm lint는 미실행이며 수정 파일 Prettier만 확인. 실제 Nexon 쿠폰 사용은 계정에 영향을 주는 범위여서 실행하지 않음
- 승인 뒤 같은 feat/cms-mvp에 0.1.25를 push하고 새 원격 CI·자동 Preview 배포 완료를 확인한다. 기존 로그인 보호·운영 브랜치/설정은 유지하며, 이전 글과 날짜를 우선 재검증한다
