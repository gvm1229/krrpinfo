import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { createHash } from 'node:crypto';
import { database } from '@/src/cms/client';
import { verifyPassword } from '@/src/cms/password';
export { isOwner } from '@/src/cms/owner';

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      credentials: { username: {}, password: { type: 'password' } },
      authorize: async (credentials, request) => {
        const username = typeof credentials?.username === 'string' ? credentials.username : '';
        const password = typeof credentials?.password === 'string' ? credentials.password : '';
        if (!process.env.AUTH_OWNER_ID || !process.env.AUTH_PASSWORD_HASH || !username || !password)
          return null;
        const address =
          request.headers.get('x-real-ip') ??
          request.headers.get('x-forwarded-for')?.split(',').at(-1)?.trim() ??
          'unknown';
        const key = createHash('sha256').update(address).digest('hex');
        const { data, error } = await database().rpc('cms_login_attempt', { attempt_key: key });
        if (error || data !== true) return null;
        const valid = verifyPassword(password, process.env.AUTH_PASSWORD_HASH);
        if (username !== process.env.AUTH_OWNER_ID || !valid) return null;
        return { id: process.env.AUTH_OWNER_ID, name: process.env.AUTH_OWNER_ID };
      },
    }),
  ],
  session: { strategy: 'jwt', maxAge: 8 * 60 * 60 },
  pages: { signIn: '/admin/login', error: '/admin/auth-error' },
  callbacks: {
    jwt: ({ token, user }) => {
      if (user) token.ownerId = user.id;
      return token;
    },
    session: ({ session, token }) => {
      if (session.user && typeof token.ownerId === 'string') session.user.id = token.ownerId;
      return session;
    },
  },
});
