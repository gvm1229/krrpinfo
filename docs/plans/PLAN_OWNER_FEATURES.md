# PLAN_OWNER_FEATURES.md

> Owner-only 기능 후속 작업 가이드. 본 문서는 **언제** 해당 작업을 시작할지의 트리거와 **어떻게** 구현할지의 패턴을 정리한다. 새 기능 추가 시 본 문서를 컨텍스트로 활용.

---

## 배경

`feat/mongo-nextauth` 브랜치에서 NextAuth v5 인증 인프라가 완성됨:

- `src/auth.ts` — NextAuth 설정 (Google + MongoDBAdapter, owner-only `signIn` callback)
- `app/api/auth/[...nextauth]/route.ts` — auth route handler
- `app/admin/login/page.tsx`, `app/admin/auth-error/page.tsx`, `app/admin/page.tsx` — 비공개 admin 진입점
- `proxy.ts` — `/admin/*` 게이트
- `env.AUTH_OWNER_EMAIL` — 단일 owner 이메일

하지만 **사이트 다른 페이지는 로그인 상태를 모름**. session-aware UI 가 필요한 owner 기능을 추가할 때 본 문서의 패턴을 따른다.

---

## 트리거 — 언제 본 문서를 펼치는가

다음 요구사항이 들어오면 본 문서가 적용 대상:

- post 옆에 owner 만 보이는 "Edit" 버튼
- 헤더에 owner 한정 "Admin" 링크
- post 작성/편집 페이지 (CMS-like)
- 댓글 모더레이션 / 핀 / 삭제 버튼
- 분석 대시보드 / 카운트 등 비공개 데이터 표시
- 그 외 "owner 만 보거나 owner 만 누를 수 있는" 모든 UI

방문자 인증과 무관한 콘텐츠 변경이면 본 문서는 무관.

---

## Sign-in UI (sign-in entry points)

### 결정사항: 추가 노출 금지

사용자 명시 ("the login button being visible to everyone is not a good design"). 따라서:

- 헤더 / 푸터 / 사이드바 / 어디에도 "Sign In" 링크 노출 금지
- 사이트 루트 sitemap 에서 `/admin/*` 제외 (`app/sitemap.ts` 이미 처리)
- robots.txt 에서 `/admin/`, `/api/auth/` disallow (이미 처리)
- owner 는 직접 URL `/admin/login` 입력하여 진입

### 예외

만약 owner 가 본인 다른 기기에서 빠르게 진입할 단축경로가 필요하다고 명시 요청하면:

- `/admin` 자체를 메모하면 됨 (proxy 가 `/admin/login` 으로 redirect)
- 또는 sign-in 단축 URL 을 더 짧게 (예: `/_a`) — 단순 별칭

이 경우에도 **공개 UI 링크는 추가하지 않음**.

---

## `useSession` / `auth()` 사용 패턴

### Server Component (선호)

server component 에서 `await auth()` 사용. RSC streaming 친화, JS bundle 증가 없음.

```tsx
// app/posts/[slug]/page.tsx
import { auth } from '@/src/auth';
import { EditButton } from '@/src/components/Admin/EditButton';

export default async function PostPage({ params }) {
  const session = await auth();
  const post = await getPost(params.slug);
  return (
    <article>
      {/* ... */}
      {session?.user && <EditButton slug={post.slug} />}
    </article>
  );
}
```

`session` 은 `null` 또는 `{ user: { email, name, image }, expires }` 형태.

owner 검증은 이미 `signIn` callback 에서 끝났으므로, session 존재 자체가 곧 owner 임. 추가 email 비교 불필요.

### Client Component (불가피한 경우만)

`useSession` 은 React hook 이라 client component 만 사용 가능. 다음 경우에만:

- 인터랙션 즉시 session 상태가 필요한 경우 (e.g. 모달 토글에 따라 UI 분기)
- 페이지 새로고침 없이 session 변화를 즉시 반영해야 하는 경우

요구사항:

1. `app/layout.tsx` 또는 해당 client component 트리 상단에 `<SessionProvider>` 래핑 필요
2. NextAuth v5 에서는 `next-auth/react` import

```tsx
// src/components/Layout/Providers.tsx
'use client';
import { SessionProvider } from 'next-auth/react';
export function Providers({ children }) {
  return <SessionProvider>{children}</SessionProvider>;
}
```

```tsx
// app/layout.tsx
import { Providers } from '@/src/components/Layout/Providers';
// ...
<body>
  <Providers>{children}</Providers>
</body>;
```

```tsx
// 어떤 client component
'use client';
import { useSession } from 'next-auth/react';

export function AdminToggle() {
  const { data: session, status } = useSession();
  if (status === 'loading') return null;
  if (!session) return null;
  return <button>Admin Action</button>;
}
```

### 권장 우선순위

1. server component + `auth()` — 기본
2. server action (form submit 등) 안에서 `auth()` 재검증 — 보안 게이트
3. `useSession` — 위 둘로 해결 안 될 때만

---

## Server Action 보호 패턴

owner 만 호출 가능한 mutation 은 server action 진입 시 `auth()` 로 검증:

```ts
// app/actions/editPost.ts
'use server';
import { auth } from '@/src/auth';

export async function editPost(slug: string, content: string) {
  const session = await auth();
  if (!session?.user) throw new Error('Unauthorized');
  // mutation
}
```

이중 방어: client UI 가 owner 한정으로 버튼을 숨겨도, action 자체에서 재검증 (defense in depth).

---

## API Route 보호 패턴

`app/api/<route>/route.ts` 핸들러도 동일:

```ts
import { auth } from '@/src/auth';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) return new NextResponse(null, { status: 401 });
  // ...
}
```

또는 `/api/admin/*` prefix 를 정해두고 `proxy.ts` matcher 에 추가하여 일괄 게이트 가능:

```ts
// proxy.ts
export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*', '/youtubers', '/youtubers/:path*'],
};
```

---

## 테스트 패턴

owner 한정 컴포넌트/액션 추가 시:

- server component: `vi.mock('@/src/auth', () => ({ auth: vi.fn().mockResolvedValue({user: {email: 'owner@example.com'}}) }))` 로 session 주입
- server action: `await expect(action()).rejects.toThrow('Unauthorized')` (no session) + 정상 case
- proxy / route 는 통합 테스트 어려움 — server-side `auth()` 호출 단위 테스트로 갈음

기존 `src/__tests__/auth.test.ts` 의 mock 패턴 재사용.

---

## 후보 기능 백로그 (참고)

다음 중 사용자 요청 들어오면 본 문서 패턴 적용:

- [ ] post `Edit` 버튼 — 카드/상세 페이지에서 owner 한정 노출, `/admin/posts/[slug]/edit` 페이지로 이동
- [ ] `/admin/posts` — 전체 post 목록 + draft toggle
- [ ] post CMS — MDX 편집기 (textarea 또는 Tiptap 등). `app/actions/upsertPost.ts` server action 으로 저장
- [ ] post `published` toggle — 카드에 inline switch
- [ ] 분석 대시보드 — `getAllPosts()` 통계 (카운트 / 최근 업데이트 / draft 수 등)
- [ ] backup 트리거 — `/admin` 에서 버튼 클릭 시 server action 으로 `restorePosts` 역방향 (Mongo → JSON dump)
- [ ] Vercel deployment hook 트리거 (선택)

각 기능 추가 시 commit 메시지에 본 문서 참조 권장: `refs PLAN_OWNER_FEATURES.md`.

---

## 환경 / 의존성 점검

본 문서 패턴 사용 전 다음 확인:

- [x] `next-auth@5.0.0-beta.31` 설치됨 (`package.json`)
- [x] `@auth/mongodb-adapter` 설치됨
- [x] `env.AUTH_OWNER_EMAIL` 정의됨
- [x] `src/auth.ts` 의 `signIn` callback 활성
- [ ] (미구현) `<SessionProvider>` 래핑 — `useSession` 첫 사용 시 함께 추가
- [ ] Vercel 환경변수 등록 (`USER_TASKS.md` 참조)

---

## 참고

- NextAuth v5 docs: <https://authjs.dev/getting-started>
- 관련 commit: `2951e2b` (NextAuth 통합), `9fe8a67` (owner-only callback), `4d71190` (admin route 보호)
- 일별 로그: `docs/logs/20260422-supabase-mongo-nextauth-migration.md`
