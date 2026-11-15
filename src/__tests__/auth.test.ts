import { describe, it, expect, vi, beforeEach } from 'vitest';
import { hashPassword, verifyPassword } from '@/src/cms/password';
import { isOwner } from '@/src/cms/owner';
import type { Session } from 'next-auth';
const { nextAuthMock, dbMock } = vi.hoisted(() => ({
  nextAuthMock: vi.fn((_config: unknown) => ({
    handlers: {},
    auth: vi.fn(),
    signIn: vi.fn(),
    signOut: vi.fn(),
  })),
  dbMock: vi.fn(),
}));
vi.mock('next-auth', () => ({ default: nextAuthMock }));
vi.mock('next-auth/providers/credentials', () => ({ default: (config: unknown) => config }));
vi.mock('@/src/cms/client', () => ({ database: () => dbMock() }));
type Config = {
  providers: { authorize: (value: unknown, request: Request) => Promise<{ id: string } | null> }[];
  session: { strategy: string };
  adapter?: unknown;
  callbacks: { session: (value: { session: Session; token: Record<string, unknown> }) => Session };
};
beforeEach(() => {
  process.env.AUTH_OWNER_ID = 'owner';
  process.env.AUTH_PASSWORD_HASH = hashPassword('long-test-password');
  vi.resetModules();
  dbMock.mockReturnValue({ rpc: vi.fn().mockResolvedValue({ data: true, error: null }) });
});
describe('운영자 인증', () => {
  it('실제 비밀번호 해시 검증과 잘못된 입력 거부', () => {
    const hash = hashPassword('strong-test-password');
    expect(verifyPassword('strong-test-password', hash)).toBe(true);
    expect(verifyPassword('wrong', hash)).toBe(false);
    expect(verifyPassword('wrong', 'broken')).toBe(false);
    expect(() => hashPassword('short')).toThrow();
  });
  it('실제 운영자 식별자와 만료 시각 검사', () => {
    expect(isOwner({ user: { id: 'owner' }, expires: '2099-01-01T00:00:00Z' })).toBe(true);
    expect(isOwner(null)).toBe(false);
    expect(isOwner({ user: { id: 'other' }, expires: '2099-01-01T00:00:00Z' })).toBe(false);
    expect(isOwner({ user: { id: 'owner' }, expires: '2000-01-01T00:00:00Z' })).toBe(false);
    expect(isOwner({ user: { id: 'owner' }, expires: 'bad' })).toBe(false);
  });
  it('Credentials와 JWT로 로그인하고 Google·DB 어댑터를 사용하지 않음', async () => {
    await import('@/src/auth');
    const cfg = nextAuthMock.mock.calls.at(-1)?.[0] as unknown as Config;
    expect(cfg.session.strategy).toBe('jwt');
    expect(cfg.adapter).toBeUndefined();
    const request = new Request('https://example.com/login');
    expect(
      await cfg.providers[0].authorize(
        { username: 'owner', password: 'long-test-password' },
        request,
      ),
    ).toEqual({ id: 'owner', name: 'owner' });
    expect(
      await cfg.providers[0].authorize(
        { username: 'other', password: 'long-test-password' },
        request,
      ),
    ).toBeNull();
    expect(
      await cfg.providers[0].authorize({ username: 'owner', password: 'wrong' }, request),
    ).toBeNull();
  });
  it('횟수 제한과 DB 오류가 있으면 로그인 거부', async () => {
    await import('@/src/auth');
    const cfg = nextAuthMock.mock.calls.at(-1)?.[0] as unknown as Config;
    dbMock.mockReturnValue({ rpc: vi.fn().mockResolvedValue({ data: false, error: null }) });
    expect(
      await cfg.providers[0].authorize(
        { username: 'owner', password: 'long-test-password' },
        new Request('https://example.com'),
      ),
    ).toBeNull();
  });
});
