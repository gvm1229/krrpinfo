import type { Session } from 'next-auth';

// 운영자 식별자와 세션 만료 확인
export const isOwner = (session: Session | null): boolean =>
  Boolean(
    process.env.AUTH_OWNER_ID &&
    session?.user?.id === process.env.AUTH_OWNER_ID &&
    Number.isFinite(Date.parse(session.expires)) &&
    Date.parse(session.expires) > Date.now(),
  );
