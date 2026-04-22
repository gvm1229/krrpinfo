import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/env.mjs', () => ({
  env: { MONGODB_URL: 'mongodb://test/krrpinfo' },
}));

vi.mock('mongodb', () => {
  class FakeMongoClient {
    constructor(
      public url: string,
      public opts: unknown,
    ) {}
    connect() {
      return Promise.resolve(this);
    }
  }
  return { MongoClient: FakeMongoClient };
});

describe('src/util/db.ts', () => {
  beforeEach(() => {
    vi.resetModules();
    delete (globalThis as { _mongoClientPromise?: unknown })._mongoClientPromise;
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('dev mode caches clientPromise across imports (singleton via global)', async () => {
    vi.stubEnv('NODE_ENV', 'development');
    const modA = await import('@/src/util/db');
    const promiseA = modA.clientPromise;
    // Second import hits module cache — same reference
    const modB = await import('@/src/util/db');
    const promiseB = modB.clientPromise;
    expect(promiseA).toBe(promiseB);
    // Also verify it was stored on globalThis
    expect((globalThis as { _mongoClientPromise?: unknown })._mongoClientPromise).toBe(promiseA);
  });

  it('prod mode yields a new promise on each fresh module load (no singleton)', async () => {
    vi.stubEnv('NODE_ENV', 'production');
    const modA = await import('@/src/util/db');
    const promiseA = modA.clientPromise;

    // Reset modules so the next import re-evaluates the module body
    vi.resetModules();

    const modB = await import('@/src/util/db');
    const promiseB = modB.clientPromise;

    expect(promiseA).not.toBe(promiseB);
  });

  it('default export mongoClient() resolves to the same MongoClient as clientPromise', async () => {
    vi.stubEnv('NODE_ENV', 'production');
    const mod = await import('@/src/util/db');
    const clientFromDefault = await mod.default();
    const clientFromNamed = await mod.clientPromise;
    expect(clientFromDefault).toBe(clientFromNamed);
  });
});
