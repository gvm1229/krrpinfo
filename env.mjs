import {createEnv} from "@t3-oss/env-nextjs"
import {z} from "zod"

export const env = createEnv({
  server: {
    // This is optional because it's only used in development.
    // See https://next-auth.js.org/deployment.
    // NEXTAUTH_URL: z.string().url().optional(),
    // NEXTAUTH_SECRET: z.string().min(1),
    NEXT_PUBLIC_APP_URL: z.string().min(1),
    MONGODB_URL: z.string().min(1),
    NEXON_API_KEY: z.string().min(1),
  },
  client: {
    NEXT_PUBLIC_APP_URL: z.string().min(1),
    MONGODB_URL: z.string().min(1),
    NEXON_API_KEY: z.string().min(1),
  },
  runtimeEnv: {
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    MONGODB_URL: process.env.MONGODB_URL,
    NEXON_API_KEY: process.env.NEXON_API_KEY,
  },
})
