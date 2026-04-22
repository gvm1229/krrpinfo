import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { Session } from 'next-auth';

// 공유 mock — db updateOne spy 캡처용
const updateOneMock = vi.fn().mockResolvedValue({});

// 실제 src/auth 는 NextAuth side-effect 로 vitest 에서 로드 불가 — isOwner 동작만 inline 재구현
vi.mock('@/src/auth', () => ({
  auth: vi.fn(),
  isOwner: (session: { user?: { email?: string | null } } | null) =>
    session?.user?.email === 'owner@example.com',
}));

vi.mock('@/env.mjs', () => ({
  env: {
    AUTH_OWNER_EMAIL: 'owner@example.com',
    AUTH_GOOGLE_ID: 'gid',
    AUTH_GOOGLE_SECRET: 'gsecret',
    AUTH_SECRET: 'asecret',
    MONGODB_URL: 'mongodb://test',
  },
}));

vi.mock('@/src/util/db', () => ({
  clientPromise: Promise.resolve({
    db: () => ({
      collection: () => ({
        updateOne: updateOneMock,
      }),
    }),
  }),
}));

vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}));

import { auth } from '@/src/auth';
import { revalidatePath } from 'next/cache';
import { togglePublished } from '@/app/admin/posts/actions';

const mockAuth = vi.mocked(auth);
const mockRevalidatePath = vi.mocked(revalidatePath);

const ownerSession: Session = {
  user: { email: 'owner@example.com' },
  expires: '2099-01-01T00:00:00Z',
};

const nonOwnerSession: Session = {
  user: { email: 'attacker@example.com' },
  expires: '2099-01-01T00:00:00Z',
};

beforeEach(() => {
  vi.clearAllMocks();
  updateOneMock.mockClear();
});

describe('togglePublished', () => {
  it('세션 없음 — Unauthorized 에러', async () => {
    mockAuth.mockResolvedValue(null);
    await expect(togglePublished('test-slug', true)).rejects.toThrow('Unauthorized');
    expect(updateOneMock).not.toHaveBeenCalled();
  });

  it('비-owner 세션 — Unauthorized 에러', async () => {
    mockAuth.mockResolvedValue(nonOwnerSession);
    await expect(togglePublished('test-slug', true)).rejects.toThrow('Unauthorized');
    expect(updateOneMock).not.toHaveBeenCalled();
  });

  it('잘못된 slug — Invalid slug 에러', async () => {
    mockAuth.mockResolvedValue(ownerSession);
    await expect(togglePublished('bad slug!', true)).rejects.toThrow('Invalid slug');
    expect(updateOneMock).not.toHaveBeenCalled();
  });

  it('owner 세션 — updateOne 호출 + revalidatePath 4회', async () => {
    mockAuth.mockResolvedValue(ownerSession);

    await togglePublished('test-slug', false);

    expect(updateOneMock).toHaveBeenCalledTimes(1);
    expect(updateOneMock).toHaveBeenCalledWith(
      { slug: 'test-slug' },
      expect.objectContaining({ $set: expect.objectContaining({ published: false }) }),
    );
    expect(mockRevalidatePath).toHaveBeenCalledTimes(4);
    expect(mockRevalidatePath).toHaveBeenCalledWith('/');
    expect(mockRevalidatePath).toHaveBeenCalledWith('/admin/posts');
    expect(mockRevalidatePath).toHaveBeenCalledWith('/posts');
    expect(mockRevalidatePath).toHaveBeenCalledWith('/posts/test-slug');
  });
});
