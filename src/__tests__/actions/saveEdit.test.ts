import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { Session } from 'next-auth';

// db updateOne spy 캡처용 — 기본은 1건 매치
const updateOneMock = vi.fn().mockResolvedValue({ matchedCount: 1 });

// NextAuth side-effect 로 vitest 에서 로드 불가 — isOwner 동작만 inline 재구현
vi.mock('@/src/auth', () => ({
  auth: vi.fn(),
  isOwner: (s: { user?: { email?: string | null } } | null) =>
    s?.user?.email === 'owner@example.com',
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

// redirect 는 Next.js 런타임에서 throw 동작 — 동일 패턴으로 mock
vi.mock('next/navigation', () => ({
  redirect: vi.fn(() => {
    throw new Error('NEXT_REDIRECT');
  }),
}));

import { auth } from '@/src/auth';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { saveEdit } from '@/app/admin/(authenticated)/posts/[slug]/edit/actions';

const mockAuth = vi.mocked(auth);
const mockRevalidatePath = vi.mocked(revalidatePath);
const mockRedirect = vi.mocked(redirect);

const ownerSession: Session = {
  user: { email: 'owner@example.com' },
  expires: '2099-01-01T00:00:00Z',
};

const nonOwnerSession: Session = {
  user: { email: 'attacker@example.com' },
  expires: '2099-01-01T00:00:00Z',
};

const validInput = {
  slug: 'test-slug',
  title: '테스트 포스트',
  description: '설명',
  tags: 'tag1, tag2',
  keywords: 'kw1, kw2',
  thumbnail: 'https://example.com/thumb.jpg',
  content: '# Hello',
  pubDate: '2024-01-15',
};

beforeEach(() => {
  vi.clearAllMocks();
  updateOneMock.mockClear();
  updateOneMock.mockResolvedValue({ matchedCount: 1 });
});

describe('saveEdit', () => {
  it('세션 없음 — Unauthorized 에러', async () => {
    mockAuth.mockResolvedValue(null);
    await expect(saveEdit(validInput)).rejects.toThrow('Unauthorized');
    expect(updateOneMock).not.toHaveBeenCalled();
  });

  it('비-owner 세션 — Unauthorized 에러', async () => {
    mockAuth.mockResolvedValue(nonOwnerSession);
    await expect(saveEdit(validInput)).rejects.toThrow('Unauthorized');
    expect(updateOneMock).not.toHaveBeenCalled();
  });

  it('잘못된 slug — Invalid slug 에러', async () => {
    mockAuth.mockResolvedValue(ownerSession);
    await expect(saveEdit({ ...validInput, slug: 'bad slug!' })).rejects.toThrow('Invalid slug');
    expect(updateOneMock).not.toHaveBeenCalled();
  });

  it('잘못된 pubDate — Invalid pub_date 에러', async () => {
    mockAuth.mockResolvedValue(ownerSession);
    await expect(saveEdit({ ...validInput, pubDate: 'not-a-date' })).rejects.toThrow(
      'Invalid pub_date',
    );
    expect(updateOneMock).not.toHaveBeenCalled();
  });

  it('대문자 slug — Invalid slug 에러 (소문자 정책)', async () => {
    mockAuth.mockResolvedValue(ownerSession);
    await expect(saveEdit({ ...validInput, slug: 'Test-Slug' })).rejects.toThrow('Invalid slug');
    expect(updateOneMock).not.toHaveBeenCalled();
  });

  it('필드 길이 초과 — Field too long 에러', async () => {
    mockAuth.mockResolvedValue(ownerSession);
    await expect(saveEdit({ ...validInput, content: 'x'.repeat(200_001) })).rejects.toThrow(
      'Field too long',
    );
    expect(updateOneMock).not.toHaveBeenCalled();
  });

  it('태그 개수 초과 — Too many tags 에러', async () => {
    mockAuth.mockResolvedValue(ownerSession);
    const tooManyTags = Array.from({ length: 51 }, (_, i) => `t${i}`).join(',');
    await expect(saveEdit({ ...validInput, tags: tooManyTags })).rejects.toThrow('Too many tags');
    expect(updateOneMock).not.toHaveBeenCalled();
  });

  it('matchedCount=0 — Post not found 에러 (race 보호)', async () => {
    mockAuth.mockResolvedValue(ownerSession);
    updateOneMock.mockResolvedValueOnce({ matchedCount: 0 });
    await expect(saveEdit(validInput)).rejects.toThrow('Post not found');
    expect(mockRevalidatePath).not.toHaveBeenCalled();
    expect(mockRedirect).not.toHaveBeenCalled();
  });

  it('빈 keywords — null 변환', async () => {
    mockAuth.mockResolvedValue(ownerSession);
    await expect(saveEdit({ ...validInput, keywords: ',  , ' })).rejects.toThrow('NEXT_REDIRECT');
    const [, update] = updateOneMock.mock.calls[0] as [unknown, { $set: Record<string, unknown> }];
    expect(update.$set.keywords).toBeNull();
  });

  it('owner + 유효 입력 — updateOne 호출, revalidatePath 4회, redirect 호출', async () => {
    mockAuth.mockResolvedValue(ownerSession);

    await expect(saveEdit(validInput)).rejects.toThrow('NEXT_REDIRECT');

    expect(updateOneMock).toHaveBeenCalledTimes(1);
    const [filter, update] = updateOneMock.mock.calls[0] as [
      unknown,
      { $set: Record<string, unknown> },
    ];
    expect(filter).toEqual({ slug: 'test-slug' });
    expect(update.$set.tags).toEqual(['tag1', 'tag2']);
    expect(update.$set.keywords).toEqual(['kw1', 'kw2']);
    expect(update.$set.pub_date).toBeInstanceOf(Date);

    expect(mockRevalidatePath).toHaveBeenCalledTimes(4);
    expect(mockRevalidatePath).toHaveBeenCalledWith('/');
    expect(mockRevalidatePath).toHaveBeenCalledWith('/admin/posts');
    expect(mockRevalidatePath).toHaveBeenCalledWith('/posts');
    expect(mockRevalidatePath).toHaveBeenCalledWith('/posts/test-slug');

    expect(mockRedirect).toHaveBeenCalledWith('/admin/posts');
  });
});
