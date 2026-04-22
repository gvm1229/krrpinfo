import NextAuth from 'next-auth';
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
});
