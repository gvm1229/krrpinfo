import { env } from '@/env.mjs';
// 배포 환경에서 결정하는 서비스 주소
export const siteConfig = { url: env.NEXT_PUBLIC_APP_URL };
