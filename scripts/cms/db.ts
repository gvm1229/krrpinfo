import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { Client } from 'pg';
// 초기 DB 구조를 버전별로 적용
const main = async () => {
  if (process.argv.includes('--help')) {
    console.log('cms:db:apply — DATABASE_URL로 CMS 초기 SQL 적용');
    return;
  }
  if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL 설정 필요');
  const source = await readFile(
    new URL('../../supabase/migrations/202610210001_cms.sql', import.meta.url),
    'utf8',
  );
  const checksum = createHash('sha256').update(source).digest('hex');
  const client = new Client({ connectionString: process.env.DATABASE_URL });
  await client.connect();
  try {
    await client.query('begin');
    await client.query('select pg_advisory_xact_lock(21061021)');
    await client.query(
      'create table if not exists public.cms_migrations(version text primary key, checksum text not null, applied_at timestamptz not null default now()); alter table public.cms_migrations enable row level security; revoke all on public.cms_migrations from anon, authenticated',
    );
    const existing = await client.query<{ checksum: string }>(
      'select checksum from public.cms_migrations where version=$1',
      ['202610210001'],
    );
    if (existing.rows[0]) {
      if (existing.rows[0].checksum !== checksum)
        throw new Error('적용된 마이그레이션의 원문 변경 감지');
      console.log('이미 적용된 CMS SQL');
    } else {
      await client.query(source.replace(/^begin;\s*/i, '').replace(/commit;\s*$/i, ''));
      await client.query('insert into public.cms_migrations(version,checksum) values($1,$2)', [
        '202610210001',
        checksum,
      ]);
      console.log('CMS 초기 SQL 적용 완료');
    }
    await client.query('commit');
  } catch (error) {
    await client.query('rollback');
    throw error;
  } finally {
    await client.end();
  }
};
main().catch((error) => {
  console.error('[db::main] ' + (error instanceof Error ? error.message : 'SQL 적용 실패'));
  process.exitCode = 1;
});
