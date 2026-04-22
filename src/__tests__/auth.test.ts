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
    MONGODB_URL: 'mongodb://test',
  },
}));

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
    const cfg = nextAuthMock.mock.calls[0]?.[0] as unknown as {
      providers: unknown[];
      session: { strategy: string };
      secret: string;
      adapter: unknown;
    };
    expect(cfg.providers).toHaveLength(1);
  });

  it('uses database session strategy', async () => {
    await import('@/src/auth');
    const cfg = nextAuthMock.mock.calls[0]?.[0] as unknown as {
      providers: unknown[];
      session: { strategy: string };
      secret: string;
      adapter: unknown;
    };
    expect(cfg.session).toEqual({ strategy: 'database' });
    expect(cfg.secret).toBe('asecret');
  });

  it('wires MongoDBAdapter with clientPromise', async () => {
    await import('@/src/auth');
    expect(adapterMock).toHaveBeenCalledWith(fakeClientPromise);
    const cfg = nextAuthMock.mock.calls[0]?.[0] as unknown as {
      providers: unknown[];
      session: { strategy: string };
      secret: string;
      adapter: unknown;
    };
    expect(cfg.adapter).toMatchObject({ _adapter: 'mongodb' });
  });
});
