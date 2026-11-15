# 2026-11-15 — TapTap 공식 공지 매일 수집

> version: 0.1.42 · feat/taptap-collector

## ✨ feat — TapTap 수집기와 번역 API (0.1.41)

- 중국판 출처를 TapTap 공식 포럼(`app/84164`, 공식 계정 `user/27073530`)으로 확정
- `src/cms/taptap.ts`: 공식 공지 목록의 글 ID, 상세의 JSON-LD 제목·게시일·작성자, `tap-rich-content__wrapper` 본문 줄과 본문 이미지 추출
- `GET /api/cron/taptap` + `vercel.json` 매일 10:00 KST: `CRON_SECRET` 인증, DB에 없는 글만 상세 요청(1초 간격, 최대 10건), 공식 작성자·7일 이내만 원문·이미지 `cn_update` Draft 저장(`translated: false`)
- `GET`·`PATCH /api/ingest/cn-update`: `CN_INGEST_TOKEN`으로 번역 대기 목록 조회와 한국어 번역 저장. Published 항목은 덮어쓰지 않고 원문 제목은 `originalTitle`로 보존
- 앱은 AI API를 호출하지 않음. 번역은 사용자 Claude 구독의 scheduled routine (`docs/plans/PLAN_CN_INGEST.md` routine prompt)
- `CRON_SECRET` 환경변수 schema·`.env.example` 추가

## ✨ feat — 번역 대기 표시 (0.1.42)

- 대시보드 `확인 대기`에서 원문만 수집된 중국 서버 소식(`translated: false`)에 "번역 대기" 배지
- 번역 대기 목록을 수집기가 만든 원문 Draft로 한정. 운영자가 직접 쓴 Draft는 routine이 덮어쓰지 않음

## 검증

- 실제 TapTap에 브라우저 없이 요청: 목록 200·글 ID 추출, 최신 글 상세 제목·KST 날짜·공식 작성자·본문 43줄·이미지 7장 추출, 이미지 referer 없이 200. DB 저장 없이 확인
- Vitest 63개(parser 3·수집 4·번역 API 4 추가), TypeScript, `pnpm build` 통과
- 미실행: 실제 DB에 cron 저장(배포 후 Vercel 수동 실행으로 확인), routine 등록
