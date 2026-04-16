# PR: strict/full branch

## Summary

- `develop` 대비 TypeScript `strict: true` 전환으로 타입 안정성 강화
- youtubers video metadata의 `keywords` 타입 처리 보강으로 Next.js production build 실패 해소
- Next.js 16 deprecation 대응으로 `middleware` warning 제거

## Changes

## ♻️ TypeScript strict 전환

- `tsconfig.json` `strict: true` 활성화
- `app/actions`, `app/posts`, `app/youtubers`, `src/components`, `src/util`, `src/lib` 전반의 null/undefined 타입 처리 정리
- build 단계 TypeScript 오류를 코드 레벨에서 선제 차단

## 🐛 YouTubers metadata build fix

- `app/youtubers/[channelId]/_[videoId]/page.tsx`에서 `parent.keywords`를 배열로 정규화
- `snippet.tags` 유무와 관계없이 metadata `keywords`를 안전하게 병합
- Next.js build type check에서 발생한 spread 오류 해소

## 🐛 Proxy migration

- 루트 `middleware.ts`를 `proxy.ts`로 rename
- export 함수명을 `proxy`로 변경해 Next.js 16 file convention에 맞춤
- 기존 matcher와 feature flag 동작은 유지하면서 build warning만 제거

## 🔧 Version / docs

- `package.json` patch version `0.1.9` 반영
- `docs/logs/20260416-strict-true-migration.md`에 metadata fix와 proxy migration 내역 반영
