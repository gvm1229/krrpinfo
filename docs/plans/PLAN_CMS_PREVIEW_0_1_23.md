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

- `agent-owned`: Vercel 연결 확인·원격 push·Draft PR·원격 CI·Preview 배포와 검증
- `awaiting-user-authority`: 운영 배포·보호 브랜치 통합은 이번 작업 범위 밖

참고: [Vercel 환경변수 CLI](https://vercel.com/docs/cli/env), [프로젝트 지침](../../.agents/directives/00-project-harness.md)
