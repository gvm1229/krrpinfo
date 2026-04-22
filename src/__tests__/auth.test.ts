import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const nextAuthMock = vi.fn((_config: unknown) => ({
  handlers: { GET: vi.fn(), POST: vi.fn() },
  auth: vi.fn(),
  signIn: vi.fn(),
  signOut: vi.fn(),
}));

const googleMock = vi.fn((opts: unknown) => ({ id: 'google', name: 'Google', _opts: opts }));
const adapterMock = vi.fn((promise: unknown) => ({ _adapter: 'mongodb', _promise: promise }));
const fakeClientPromise = Promise.resolve({});

vi.mock('next-auth', () => ({ default: nextAuthMock }));
vi.mock('next-auth/providers/google', () => ({ default: googleMock }));
vi.mock('@auth/mongodb-adapter', () => ({ MongoDBAdapter: adapterMock }));
vi.mock('@/src/util/db', () => ({ clientPromise: fakeClientPromise }));
vi.mock('@/env.mjs', () => ({
  env: {
    AUTH_GOOGLE_ID: 'gid',
    AUTH_GOOGLE_SECRET: 'gsecret',
    AUTH_SECRET: 'asecret',
    AUTH_OWNER_EMAIL: 'owner@example.com',
    MONGODB_URL: 'mongodb://test',
  },
}));

type CapturedConfig = {
  providers: unknown[];
  session: { strategy: string };
  secret: string;
  adapter: unknown;
  pages: { signIn: string; error: string };
  callbacks: {
    signIn: (args: {
      user?: { email?: string | null };
      profile?: { email?: string | null };
    }) => boolean | Promise<boolean>;
  };
};

const captureConfig = (): CapturedConfig =>
  nextAuthMock.mock.calls[0]?.[0] as unknown as CapturedConfig;

beforeEach(() => {
  vi.resetModules();
  nextAuthMock.mockClear();
  googleMock.mockClear();
  adapterMock.mockClear();
});

afterEach(() => {
  vi.clearAllMocks();
});

describe('src/auth.ts', () => {
  it('exports handlers/auth/signIn/signOut', async () => {
    const mod = await import('@/src/auth');
    expect(mod).toMatchObject({
      handlers: expect.any(Object),
      auth: expect.any(Function),
      signIn: expect.any(Function),
      signOut: expect.any(Function),
    });
  });

  it('passes Google provider with env credentials', async () => {
    await import('@/src/auth');
    expect(googleMock).toHaveBeenCalledWith({ clientId: 'gid', clientSecret: 'gsecret' });
    expect(captureConfig().providers).toHaveLength(1);
  });

  it('uses database session strategy', async () => {
    await import('@/src/auth');
    const cfg = captureConfig();
    expect(cfg.session).toEqual({ strategy: 'database' });
    expect(cfg.secret).toBe('asecret');
  });

  it('wires MongoDBAdapter with clientPromise', async () => {
    await import('@/src/auth');
    expect(adapterMock).toHaveBeenCalledWith(fakeClientPromise);
    expect(captureConfig().adapter).toMatchObject({ _adapter: 'mongodb' });
  });

  it('routes signIn UI to /admin/login and errors to /admin/auth-error', async () => {
    await import('@/src/auth');
    expect(captureConfig().pages).toEqual({
      signIn: '/admin/login',
      error: '/admin/auth-error',
    });
  });

  it('signIn callback allows owner email', async () => {
    await import('@/src/auth');
    const result = await captureConfig().callbacks.signIn({
      user: { email: 'owner@example.com' },
    });
    expect(result).toBe(true);
  });

  it('signIn callback rejects non-owner email', async () => {
    await import('@/src/auth');
    const result = await captureConfig().callbacks.signIn({
      user: { email: 'attacker@example.com' },
    });
    expect(result).toBe(false);
  });

  it('signIn callback rejects when email missing', async () => {
    await import('@/src/auth');
    const result = await captureConfig().callbacks.signIn({
      user: { email: null },
      profile: { email: null },
    });
    expect(result).toBe(false);
  });

  it('signIn callback falls back to profile.email when user.email absent', async () => {
    await import('@/src/auth');
    const result = await captureConfig().callbacks.signIn({
      user: {},
      profile: { email: 'owner@example.com' },
    });
    expect(result).toBe(true);
  });
});
