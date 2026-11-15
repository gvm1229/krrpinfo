import { describe, it, expect } from 'vitest';
import { spawnSync } from 'node:child_process';
import { migratePost, createMigration, remapReferences } from '../../scripts/cms/migration';
const post = {
  id: 'original-id',
  slug: 'keep-url',
  title: '제목',
  content: '<Callout>원문</Callout>',
  published: false,
  pub_date: '2026-10-20T15:00:00Z',
  tags: ['하나', '둘'],
};
describe('이전 데이터 보존', () => {
  it('주소·원문·Draft·원래 ID·한국 날짜 보존', () => {
    const migrated = migratePost(post);
    expect(migrated.slug).toBe(post.slug);
    expect(migrated.data.body).toBe(post.content);
    expect(migrated.published).toBe(false);
    expect(migrated.data.legacyId).toBe('original-id');
    expect(migrated.data.pubDate).toBe('2026-10-21');
    expect(migratePost(post).id).toBe(migrated.id);
  });
  it('동일 영상의 중복을 보고하고 분류 참조 생성', () => {
    const video = {
      id: 'AbCdEf12345',
      category: '현재 시즌',
      snippet: {
        title: '영상',
        channelTitle: '채널',
        publishedAt: '2026-10-21T00:00:00Z',
        thumbnails: { high: { url: 'https://i.ytimg.com/test.jpg' } },
      },
    };
    const plan = createMigration(
      { settings: { name: '테스트' }, entries: [] },
      { posts: [post], channels: [{ allVideos: [video, video] }] },
    );
    expect(plan.report.videos).toBe(1);
    expect(plan.report.duplicates).toBe(1);
    expect(plan.entries.find((entry) => entry.kind === 'video')?.data.category).toBeTruthy();
  });
  it('CLI 시작과 누락 입력의 실패 종료', () => {
    const help = spawnSync(
      process.execPath,
      ['--import', 'tsx', 'scripts/cms/migrate.ts', '--help'],
      { encoding: 'utf8' },
    );
    expect(help.status, help.stderr).toBe(0);
    expect(help.stdout).toContain('--dry-run');
    const failed = spawnSync(process.execPath, ['--import', 'tsx', 'scripts/cms/migrate.ts'], {
      encoding: 'utf8',
    });
    expect(failed.status).toBe(1);
    expect(failed.stderr).toContain('--input');
  });
});

describe('이전 대상 참조', () => {
  it('기존 대상 분류를 유지하며 새 영상의 참조를 연결', () => {
    const category = {
      id: '11111111-1111-4111-a111-111111111111',
      kind: 'category' as const,
      slug: 'video-0',
      title: '분류',
      published: true,
      position: 0,
      data: { scope: 'video' },
    };
    const video = {
      id: '22222222-2222-4222-a222-222222222222',
      kind: 'video' as const,
      slug: 'video-example',
      title: '영상',
      published: true,
      position: 0,
      data: { category: category.id },
    };
    const migrated = remapReferences(
      [category, video],
      [{ id: '33333333-3333-4333-a333-333333333333', kind: 'category', slug: 'video-0' }],
    );
    expect(migrated[1].data.category).toBe('33333333-3333-4333-a333-333333333333');
    expect(video.data.category).toBe(category.id);
  });
});
