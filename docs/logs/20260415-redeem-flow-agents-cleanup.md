# 2026-04-15 — Redeem flow & AGENTS / commands 정리

> version: 0.1.4

## ✨ feat(redeem)

- `RedeemContainer`: 회원번호 기억하기 checkbox 제거, 저장/수정/취소 button flow 도입
  - 저장 시 localStorage (`krrpinfo:npaCode`) 영속화 + input disabled
  - 수정 mode 진입 시 취소(직전 값 복원) / 저장 button 표시
  - mount 시 localStorage 회원번호 자동 복원

## 📝 docs

- AGENTS.md 끝부분에 프로젝트 구조 map 섹션 추가 (routes / src / config / assets / docs)
- `.claude/commands/ship.md` 추가 (definitive commit directive)
- `.claude/commands/docs.md` 추가 (documentation update directive, 프로젝트 convention 적용)
