# 중국 서버 소식 매일 수집

> 갱신: 2026-11-15 · 상태: TapTap 수집기·번역 API 구현 완료, `CRON_SECRET`·`CN_INGEST_TOKEN` 등록과 routine 등록 대기

## 원칙

- AI API 미사용. 앱은 Anthropic을 포함한 어떤 AI API도 호출하지 않음
- 수집은 정해진 코드(Vercel Cron), 번역만 사용자 Claude 구독의 scheduled routine
- 번역이 늦거나 실패해도 원문·이미지 Draft는 관리자 대시보드에 먼저 도착

## 흐름

1. **Vercel Cron** 매일 10:00 KST (`vercel.json`, `0 1 * * *` UTC) → `GET /api/cron/taptap`
2. 공식 공지 목록 1페이지를 읽고 DB에 없는 글만 상세 요청 (요청 간격 1초, 최대 10건)
3. 작성자가 공식 계정(`/user/27073530`)이고 7일 안에 게시된 글만 저장
4. 제목·중국어 원문·게시일(KST)·이미지(최대 20장, R2 복사)를 `cn_update` **Draft**로 저장, `translated: false`
5. **Claude scheduled routine** 매일 11:00 KST → 번역 대기 목록 조회 → 번역 → 결과 저장(`translated: true`, Draft 유지)
6. 운영자가 대시보드 `확인 대기`에서 확인 후 Published 전환 → 홈 hero·`/cn-preview` 반영

## 출처

| 항목           | 값                                                                                                                                                                                    |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 공식 공지 목록 | `https://www.taptap.cn/app/84164/topic?type=official`                                                                                                                                 |
| 글 상세        | `https://www.taptap.cn/moment/<id>`                                                                                                                                                   |
| 공식 계정      | `https://www.taptap.cn/user/27073530` (跑跑-T宝), 게시판 `group_id=65192`                                                                                                             |
| 파싱 기준      | 목록: `/moment/<id>` 링크. 상세: JSON-LD `NewsArticle`(제목·게시일·작성자), `tap-rich-content__wrapper` 안의 `data-rich-content-index` 줄과 `img2-tc.tapimg.com/moment/etag/…` 이미지 |

- 2026-11-15 실제 요청 확인: 브라우저 없이 목록·상세 200, 이미지 referer 없이 200
- TapTap 앞단에 Aliyun 방화벽이 있으므로 하루 1회·요청 간격 유지. 구조가 바뀌면 cron 응답의 `skipped[].reason: "parse"`로 드러남

## 번역 API (routine 사용)

모든 요청에 `Authorization: Bearer <CN_INGEST_TOKEN>`.

- `GET /api/ingest/cn-update` → `{ "pending": [{ id, title, publishedAt, sourceUrl, originalText, imageCount }] }`
- `PATCH /api/ingest/cn-update`

```json
{
  "id": "uuid",
  "title": "한국어 제목",
  "summary": "한국어 2~4문장 요약",
  "body": "한국어 상세, 줄마다 항목 하나 (신규 카트·레이서·펫·트랙·이벤트·일정)",
  "season": "S47",
  "krEta": "약 10개월 뒤 (2027년 8월 전후, 추정)"
}
```

- 응답: 200 저장, 404 없거나 이미 Published, 400 형식 오류, 401 token 오류
- 기존 `POST /api/ingest/cn-update`(완성된 소식 직접 전송)도 유지

## routine prompt

```text
매일 실행. 카러플 정보통의 중국 서버 소식 Draft를 한국어로 번역한다.
1. GET https://<배포 주소>/api/ingest/cn-update (헤더 Authorization: Bearer $CN_INGEST_TOKEN)로 pending 목록을 받는다. 비어 있으면 종료.
2. 항목마다 originalText(중국어 원문)와 title을 읽고 번역한다.
   - title: 한국어 제목
   - summary: 핵심 2~4문장
   - body: 신규 카트·레이서·펫·트랙·모드·이벤트와 날짜를 줄마다 하나씩
   - season: 원문에 시즌 번호가 있으면 "S47" 형식, 없으면 빈 문자열
   - krEta: "중국 서버 대비 약 10개월(5시즌) 차이" 기준 추정, "(추정)" 표기
   - 고유명사는 한국 서버 공식 명칭을 알면 그 명칭, 모르면 한국어 음역 뒤 괄호에 중국어 원문
3. 항목마다 PATCH https://<배포 주소>/api/ingest/cn-update 로 위 필드와 id를 보낸다.
4. 4xx·5xx 응답은 id와 응답 본문을 결과 보고에 남긴다. 번역할 수 없는 항목은 건너뛰고 보고한다.
```

## 사용자 설정

- Vercel 환경변수: `CRON_SECRET`(16자 이상), `CN_INGEST_TOKEN`(32자 이상), 기존 R2 설정. 등록 후 재배포
- Claude routine: `/schedule`로 매일 11:00 KST, 위 prompt, 환경변수 `CN_INGEST_TOKEN`. routine 환경에서 배포 주소로 나가는 네트워크 허용
- 확인: Vercel 대시보드 Cron 실행 기록, 관리자 대시보드 `확인 대기`
