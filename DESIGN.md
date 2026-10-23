---
name: 카러플 정보통
description: 카트라이더 러쉬플러스의 글·영상·시즌·쿠폰을 찾고 관리하는 정보 사이트
colors:
  background: 'hsl(0 0% 100%)'
  foreground: '#202020'
  muted: '#f0f0f0'
  muted-foreground: '#646464'
  brand-blue: '#2563eb'
  brand-blue-hover: '#1d4ed8'
  brand-blue-dark: '#60a5fa'
  season-1: '#7c3aed'
  season-2: '#ec4899'
  season-3: '#fbcfe8'
  season-4: '#fdf2f8'
  season-5: '#1f1147'
  kakao-yellow: '#fde047'
  admin-primary: '#4945ff'
  admin-background: '#f6f6f9'
  admin-foreground: '#32324d'
  admin-border: '#dcdce4'
  admin-border-dark: '#4a4a6a'
  admin-muted: '#666687'
  admin-muted-light: '#c0c0cf'
  admin-text-dark: '#eaeaef'
  admin-background-dark: '#181826'
  admin-panel-dark: '#212134'
  admin-primary-hover: '#3730a3'
  admin-danger: '#b42318'
  admin-danger-hover: '#912018'
  modal-overlay: 'rgb(0 0 0/0.45)'
typography:
  title:
    fontFamily: 'Pretendard Variable, Pretendard, sans-serif'
    fontSize: '2.5rem'
    fontWeight: 700
  body:
    fontFamily: 'Pretendard Variable, Pretendard, sans-serif'
    fontSize: '1rem'
  label:
    fontSize: '0.875rem'
  editor:
    fontSize: '15px'
  heading-2:
    fontSize: '1.5rem'
  heading-1:
    fontSize: '2rem'
  heading-3:
    fontSize: '1.25rem'
rounded:
  sm: '4px'
  md: '6px'
  lg: '8px'
  xl: '16px'
spacing:
  sm: '8px'
  md: '16px'
  lg: '24px'
  xl: '32px'
---

# 카러플 정보통 디자인 기준

## Overview

게임 이미지와 글을 중심으로 정보를 찾는 기존 공개 화면을 유지한다. 공개 화면은 읽기 쉬운 카드와 일정 목록을 사용하고, 관리자 화면은 Strapi의 콘텐츠 목록·편집·미디어 관리 구성을 기준으로 한다.

운영자가 바꾸는 제목·설명·이미지·메뉴·순서·노출·문구는 CMS 데이터다. 글꼴·여백·화면 구간·허용된 색상과 구성요소의 구조는 이 문서와 코드에서 관리한다.

## Colors

공개 화면은 흰색과 Radix Gray 계열의 중립색, 기존 브랜드 파랑을 사용한다. 밝은 테마의 본문은 #202020, 어두운 테마의 배경은 #111111, 본문은 #eeeeee다.

공통 토큰은 Radix의 역할에 맞춰 표면은 3단계, 가리킨 표면은 4단계, 장식 경계는 6단계, 보조 글씨는 11단계, 본문은 12단계에 연결한다. 입력 경계는 3:1 대비를 위해 밝은 테마 Gray 9와 어두운 테마 Gray 10을 사용한다. 오류 글씨는 Red 11의 밝은 값 #ce2c31과 어두운 값 #ff9592다. CSS에 필요한 값만 두고 패키지는 추가하지 않는다.

브랜드 버튼 배경은 #2563eb, 가리킨 배경은 흰 글씨 대비를 유지하는 #1d4ed8이다. 링크는 --brand-link, 중립 조작 버튼은 --control과 --control-hover, 오류 글씨는 --error-text를 사용한다. 관리자 색상은 --cms-\*로 관리하며 기존 보라색과 Strapi 표면을 유지한다. 관리자 입력 경계와 초점 색은 테마별로 구분한다.

참조: [Radix 색상 역할](https://www.radix-ui.com/colors/docs/palette-composition/understanding-the-scale), [브랜드와 Radix 팔레트 병용](https://www.radix-ui.com/colors/docs/palette-composition/composing-a-palette). 2026-10-23에 공식 light.ts와 dark.ts 값을 확인했다.

시즌 색상은 --s-1부터 --s-5까지 다섯 역할을 유지한다. 어두운 테마에서는 surface인 --s-4와 ink인 --s-5를 바꿔 사용한다. 태그는 gold·green·blue·sky·red·yellow·purple·orange 이름 중에서 고른다. 원시 CSS나 임의 클래스 이름을 CMS에서 입력하지 않는다.

관리자 화면의 주요 동작은 Strapi의 보라색 #4945ff, 배경은 #f6f6f9, 글자는 #32324d를 기준으로 한다. 이 색상을 공개 사이트 브랜드 파랑의 대체 색으로 쓰지 않는다.

## Typography

Pretendard Variable을 우선하고 Pretendard와 시스템 sans-serif를 대체 글꼴로 사용한다. 본문은 1rem, 글 상세 제목은 큰 화면에서 2.5rem이다. 관리자 화면은 고정 rem 크기와 분명한 필드 이름을 사용한다.

실제 코드·주소 식별자 이외에는 고정폭 글꼴을 장식으로 쓰지 않는다. 긴 제목과 실제 한국어 문장을 작은 화면에서도 확인한다.

일반 화면의 글자 크기는 3~4개로 제한한다. 홈은 14·16·24·30px, 글과 영상 목록은 14·16px와 화면 크기에 따른 제목 30px 또는 36px다. 보조 글씨는 최소 12px를 유지한다. 글 본문 제목과 편집기의 문서 표현은 이 제한의 예외다. 모바일 관리자 입력은 16px로 읽기 쉽게 표시한다.

## Layout

공개 화면의 container는 가운데 정렬과 2rem 기본 좌우 여백을 사용한다. 기존 기준은 모바일 720px 이하, tablet 721px 이상, laptop 1241px 이상, desktop 1600px 이상이다.

글과 영상 카드는 1열·2열·3열로 늘어난다. 홈은 CMS에 등록한 기존 섹션의 순서와 노출 상태를 따른다. 공개 글은 본문과 큰 화면의 목차 영역으로 나눈다.

관리자 화면은 왼쪽 메뉴·상단 작업 영역·콘텐츠 영역으로 구성한다. 편집 화면의 공개 상태·저장·오류는 상단에 고정하고, 작성 내용과 주소·날짜 등 부가 정보를 나눈다. 작은 화면에서는 한 열로 바꾸고, 메뉴와 표는 필요한 경우 해당 영역 안에서 가로로 이동할 수 있게 한다.

제목은 콘텐츠와 같은 왼쪽 기준선에 맞춘다. 글·영상 카드의 제목은 줄바꿈하고 요약은 두 줄까지 표시한다. 입력 이름·경고·오류는 유지하며, 같은 내용을 반복하는 안내만 줄인다. 설정은 관련 항목끼리 묶고 현재 상태와 상태를 바꾸는 버튼을 구분한다.

## Elevation & Depth

기존 공개 화면의 경계선과 중립색 표면을 유지한다. 관리자 입력과 표는 옅은 경계선으로 나눈다. 그림자는 메뉴·대화상자처럼 실제로 겹치는 화면에 제한한다.

## Shapes

공개 버튼은 단색 배경·흰 글자·둥근 모서리를 사용한다. 동작 이름은 줄바꿈하지 않고 크기가 눌리지 않게 한다. 입력창과 관리자 버튼은 Strapi의 작은 모서리 형태를 따른다.

일정 카드의 모서리는 이미지 카드와 같은 8px를 사용한다. 검색창처럼 안쪽 여백이 없는 중첩 표면은 바깥 모서리만 표시한다. 장식 구분선은 이번 Windows 렌더 검증에서 기존 1px를 유지하며, 입력 경계와 초점 표시는 가늘게 줄이지 않는다. 공통 버튼과 관리자 메뉴의 색 전환은 250ms ease-out이며, 움직임 줄이기 설정에서는 전환을 끈다.

## Components

- 자체 조작 UI: 프로젝트에서 직접 작성·추가한 버튼·입력·선택·체크·대화상자는 shadcn 구성요소를 사용한다. 버튼형 링크는 Button의 asChild로 구성하며, 자체 HTML 컨트롤이나 브라우저 confirm·alert·prompt로 대체하지 않는다.
- Strapi 원본: 가져온 원본 UI는 shadcn 전환 대상에서 제외하고 기존 구성요소를 보존한다. 출처·이식 기록으로 자체 작성 UI와 구분한다. shadcn 내부 HTML과 Slate·CodeMirror 내부 편집 요소는 유지하고, 직접 추가한 주변 조작 UI에만 위 규칙을 적용한다.
- 카드: 실제 이미지·제목·설명·날짜·태그를 표시하며 빈 값을 임의 콘텐츠로 채우지 않는다.
- 메뉴: 큰 화면·작은 화면·검색이 같은 CMS 항목을 사용한다.
- 본문: Strapi 형식의 Slate 블록과 CodeMirror Markdown을 구분해 저장한다. 표·YouTube·접기는 이 프로젝트에서 확장한 기능이다.
- 미디어: R2에 직접 전송하며 업로드 중·실패·재시도·사용 중 삭제 차단을 보여 준다.
- 상태: Draft는 비공개이며 Published 저장은 다음 공개 조회에 반영한다.
- 아이콘: 직접 만든 UI는 lucide-react를 사용한다. 수정 없이 가져온 Strapi 원본 아이콘만 예외다.
- 접근성: 입력 이름, 키보드 초점, 비활성·진행·오류·빈 목록 상태를 함께 제공한다. 본문 이미지에는 대체 설명을 저장한다.

## Do's and Don'ts

- 현재 공개 화면의 이미지 중심 구성과 밝은·어두운 테마를 함께 확인한다.
- 새 관리 기능은 Strapi의 구현과 사용 흐름을 먼저 검토하고 변경 사유를 기록한다.
- 공개 콘텐츠와 운영 설정을 코드의 기본값으로 되살리지 않는다.
- 디자인 값을 CMS의 자유 CSS 입력으로 바꾸지 않는다.
- 배경음악과 유튜버 관리 화면을 다시 추가하지 않는다.
- DB가 작동하지 않을 때 필요한 복구 화면·보안 검사·기술 상수는 콘텐츠의 대체값으로 쓰지 않는다.
