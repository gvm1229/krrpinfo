# Hive 설치 변경만 커밋

## 커밋 구성

### 1. 프로젝트 Hive 하네스 설치

- 목적: Hive 0.13.0 프로젝트 설정, 기본 스킬 23개, 한국어 위키와 세 역할 기록을 재현 가능한 형태로 보존
- 파일: .agents/directives의 설치 파일 5개, .hive의 Git 제외 대상이 아닌 설치 정본 파일 전체, .prettierignore, CLAUDE.md의 Hive 진입점, GEMINI.md의 Hive 진입점
- 부분 변경: AGENTS.md의 AIGENT-HIVE 표시 블록만, PR.md의 Hive 설치 요약만
- 문서: docs/plans/PLAN_HIVE_SETUP.md, docs/plans/PLAN_SHIP_HIVE.md, docs/logs/20261021-hive-project-setup.md의 설치 기록
- 검증: Hive 설치 validate, 지식 lint, staged diff 범위 확인, 프로젝트 Git hooks
- 공유 지침과 생성 답변은 일반 포맷터가 원문을 바꾸지 않도록 .prettierignore에 명시하고 Hive validate로 검사
- 메시지: 🔧 chore(hive): 프로젝트 하네스와 기본 스킬 설정
- 버전: 제품 코드 변경이 아니므로 package.json 변경 없음

## 이번 커밋에서 제외

- CMS 코드·SQL·의존성·타입 오류 수정·CMS 계획과 조사 문서
- 기존 사용자 응답 지침 변경과 그 PR.md 기록
- AGENTS.md의 작업 브랜치 접두사 규칙 변경 및 해당 PR.md 기록
- Hive runtime·파생 색인·백업

## 후속 작업

1. 이 프로젝트의 사용량 보호 기준을 잔여 30%로 설정하고 같은 세션에서 확인
2. feat/cms-mvp의 보존된 CMS 구현을 계속 진행
