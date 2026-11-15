# CMS 데이터 대응표

| 기존 위치                       | DB 항목                              | 관리자 화면    | 공개 사용처                                      |
| ------------------------------- | ------------------------------------ | -------------- | ------------------------------------------------ |
| src/lib/queries.ts의 MongoDB 글 | cms_entries / post                   | 글             | 홈 최신 글·글 목록·본문·메타데이터·검색·사이트맵 |
| 채널 안의 allVideos             | cms_entries / video                  | 추천 영상      | /videos의 외부 YouTube 링크                      |
| src/data/timeline.ts            | cms_entries / timeline, season       | 시즌·시즌 일정 | /seasons                                         |
| 홈 seasonsData                  | cms_entries / countdown              | 홈 카운트다운  | 홈의 일정 카드                                   |
| RedeemCard의 쿠폰 배열          | cms_entries / coupon                 | 쿠폰           | /redeem                                          |
| config/navBar.ts                | cms_entries / navigation             | 메뉴           | 헤더·모바일·검색·사이트맵                        |
| 홈 유용한 링크 배열             | cms_entries / link                   | 유용한 링크    | 홈 링크 카드                                     |
| 고정 영상 분류                  | cms_entries / category               | 분류           | 추천 영상 탭·시즌 서버 선택                      |
| 홈 JSX 섹션 순서                | cms_entries / section                | 홈 섹션        | 홈의 순서·노출                                   |
| 제목·안내·버튼·빈 목록 문구     | cms_entries / copy                   | 화면 문구      | Copy와 useCopy로 연결된 공개 화면                |
| config/site.ts·루트 메타데이터  | cms_settings / site                  | 사이트 설정    | 이름·설명·작성자·공유 이미지·검색 확인 값        |
| 홈 소개                         | cms_settings / site                  | 사이트 설정    | 홈 제목·설명·대표 이미지·연결 주소               |
| SiteFooter의 연락처·QR·저작권   | cms_settings / site                  | 사이트 설정    | 푸터                                             |
| 쿠폰 안내 주소와 이미지         | cms_settings / site                  | 사이트 설정    | 회원 번호 안내                                   |
| 페이지 표시 환경변수            | cms_settings / site의 페이지 활성 값 | 사이트 설정    | 페이지 접근·메뉴·검색·사이트맵                   |
| public의 직접 관리 이미지       | R2 파일, cms_media 메타데이터        | 미디어         | 본문·카드·로고·QR                                |
| 배경음악                        | 제거                                 | 없음           | 없음                                             |

## 경계

- 초기 입력값은 scripts/cms/seed.json에만 보존하며 공개 화면의 대체값으로 읽지 않음
- 디자인 값·허용 블록과 섹션 종류·라우트·보안 검사·복구 화면은 코드에서 관리
- DB가 고장 났을 때의 독립 복구 화면은 DB 문구에 의존하지 않음
- 이전 원본과 실제 데이터가 들어간 보고서는 Git 제외 대상인 backup 아래에 보존
- 실제 Supabase·R2 적용과 운영 전환은 별도 연결 검증 후 수행
