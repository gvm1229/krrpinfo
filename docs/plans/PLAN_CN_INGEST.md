# 중국 서버 소식 매일 수집

> 작성: 2026-11-14 · 상태: 수신 endpoint 구현 완료, 수집 routine 등록과 이미지 출처 URL 확정 대기

## 구조

1. 사용자 구독의 Claude cloud scheduled session이 매일 한 번 실행
2. session이 중국판 《跑跑卡丁车官方竞速版》 출처를 읽고 새 소식만 골라 한국어로 번역·요약
3. `POST https://<배포 주소>/api/ingest/cn-update`로 소식마다 한 번 전송
4. 앱은 token 확인 → 출처 주소 중복 확인 → 이미지 R2 복사 → 항상 Draft 저장
5. 운영자가 관리자 대시보드 `확인 대기`에서 내용 확인 후 Published 전환

앱은 외부 AI API를 호출하지 않는다. 번역은 cloud session이 맡는다.

## 출처 (우선순위)

| 출처                                                       | 용도                      | 비고                                                  |
| ---------------------------------------------------------- | ------------------------- | ----------------------------------------------------- |
| 이미지가 많은 공식 커뮤니티 페이지 (초록색 UI)             | 시즌·이벤트 이미지와 상세 | **사용자가 URL 제공 예정**. 공식 사이트에서 이동 가능 |
| `https://itunes.apple.com/lookup?id=1438842875&country=cn` | 버전·업데이트 노트        | 공식 JSON, 이미지 없음                                |
| 웨이보·Bilibili 공식 계정                                  | 이벤트 공지               | 구조 변경이 잦아 보조 출처                            |

확인한 오답: `speedm.qq.com`은 QQ飞车, `pao.qq.com`은 天天酷跑 사이트.

## 전송 형식

```json
{
  "sourceUrl": "https://… 원문 주소 (중복 판단 기준)",
  "sourceName": "공식 커뮤니티",
  "publishedAt": "2026-11-13",
  "title": "S48 시즌 「…」 예고",
  "season": "S48",
  "summary": "한국어 2~4문장 요약",
  "body": "한국어 상세 (트랙·카트·레이서·펫·이벤트를 줄 단위로)",
  "originalText": "중국어 원문 그대로",
  "images": ["https://… 원본 이미지, 최대 20개"],
  "krEta": "약 10개월 뒤 (2027년 9월 전후)"
}
```

- `Authorization: Bearer <CN_INGEST_TOKEN>` 필수. 32자 이상
- 응답: 201 저장, 200 `{ "duplicate": true }` 이미 저장된 출처, 400 형식 오류, 401 token 오류
- `published` 값을 보내도 무시하고 Draft로 저장

## cloud session 지침 (routine prompt 초안)

```text
매일 한 번 실행. 중국판 跑跑卡丁车官方竞速版의 새 소식을 찾아 카러플 정보통에 Draft로 보낸다.
1. 출처: <이미지 출처 URL>, App Store lookup JSON(id 1438842875, country=cn), 공식 웨이보·Bilibili.
2. 최근 3일 안에 게시된 시즌·이벤트·신규 카트·레이서·펫·트랙 소식만 고른다. 광고·점검 공지는 제외.
3. 소식마다 한국어 요약(2~4문장)과 상세를 쓴다. 고유명사는 한국 서버 공식 명칭을 알면 그 명칭, 모르면 중국어 원문 병기.
4. 원문 이미지 주소를 그대로 images에 넣는다. 이미지가 없으면 빈 배열.
5. krEta는 "중국 서버 대비 약 10개월(5시즌) 차이" 기준 추정이며 추정임을 표시.
6. 소식마다 POST https://<배포 주소>/api/ingest/cn-update, 헤더 Authorization: Bearer $CN_INGEST_TOKEN.
7. 200 duplicate는 정상. 4xx·5xx는 응답 본문과 함께 결과 보고에 남긴다.
```

## 남은 작업

- 사용자: `CN_INGEST_TOKEN` 생성 후 Vercel·cloud 환경에 등록, 이미지 출처 URL 전달, routine 등록 승인
- 공개 화면: 목표 D에서 Published 소식을 홈 hero와 미래시 페이지에 표시
