import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

export const env = createEnv({
  /*
   * Serverside Environment variables, not available on the client.
   * Will throw if you access these variables on the client.
   */
  server: {
    NEXT_PUBLIC_APP_URL: z.string().min(1),
    MONGODB_URL: z.string().min(1),
    YOUTUBE_API_KEY: z.string().min(1),
    NEXON_API_KEY: z.string().min(1),
    AUTH_SECRET: z.string().min(1),
    AUTH_GOOGLE_ID: z.string().min(1),
    AUTH_GOOGLE_SECRET: z.string().min(1),
    NEXT_PUBLIC_SHOW_YOUTUBERS: z.enum(['true', 'false']).optional(),
  },
  /*
   * Environment variables available on the client (and server).
   *
   * 💡 You'll get type errors if these are not prefixed with NEXT_PUBLIC_.
   */
  client: {
    NEXT_PUBLIC_APP_URL: z.string().min(1),
    NEXT_PUBLIC_SHOW_YOUTUBERS: z.enum(['true', 'false']).optional(),
  },
  /*
   * Due to how Next.js bundles environment variables on Edge and Client,
   * we need to manually destructure them to make sure all are included in bundle.
   *
   * 💡 You'll get type errors if not all variables from `server` & `client` are included here.
   */
  runtimeEnv: {
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    MONGODB_URL: process.env.MONGODB_URL,
    YOUTUBE_API_KEY: process.env.YOUTUBE_API_KEY,
    NEXON_API_KEY: process.env.NEXON_API_KEY,
    AUTH_SECRET: process.env.AUTH_SECRET,
    AUTH_GOOGLE_ID: process.env.AUTH_GOOGLE_ID,
    AUTH_GOOGLE_SECRET: process.env.AUTH_GOOGLE_SECRET,
    NEXT_PUBLIC_SHOW_YOUTUBERS: process.env.NEXT_PUBLIC_SHOW_YOUTUBERS,
  },
});
