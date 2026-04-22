import NextAuth from 'next-auth';
import type { Session } from 'next-auth';
import Google from 'next-auth/providers/google';
import { MongoDBAdapter } from '@auth/mongodb-adapter';
import { clientPromise } from '@/src/util/db';
import { env } from '@/env.mjs';

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: MongoDBAdapter(clientPromise),
  providers: [
    Google({
      clientId: env.AUTH_GOOGLE_ID,
      clientSecret: env.AUTH_GOOGLE_SECRET,
    }),
  ],
  session: { strategy: 'database' },
  secret: env.AUTH_SECRET,
  // 기본 NextAuth UI (/api/auth/signin) 노출 차단 — owner 만 아는 경로로 redirect
  pages: {
    signIn: '/admin/login',
    error: '/admin/auth-error',
  },
  callbacks: {
    // owner 단일 이메일만 가입/로그인 허용
    signIn({ user, profile }) {
      const email = user?.email ?? profile?.email;
      return email === env.AUTH_OWNER_EMAIL;
    },
  },
});

// owner 이메일 명시 검증 — defense in depth (signIn callback 변경 대비)
export function isOwner(session: Session | null): boolean {
  return session?.user?.email === env.AUTH_OWNER_EMAIL;
}
