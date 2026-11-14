import { readdir, readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { Client } from 'pg';
// 마이그레이션 폴더
const directory = new URL('../../supabase/migrations/', import.meta.url);
// DB 구조를 버전 순서대로 적용
const main = async () => {
  if (process.argv.includes('--help')) {
    console.log('cms:db:apply — DATABASE_URL로 CMS SQL 버전 순서대로 적용');
    return;
  }
  if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL 설정 필요');
  const files = (await readdir(directory)).filter((name) => name.endsWith('.sql')).sort();
  const client = new Client({ connectionString: process.env.DATABASE_URL });
  await client.connect();
  try {
    await client.query('begin');
    await client.query('select pg_advisory_xact_lock(21061021)');
    await client.query(
      'create table if not exists public.cms_migrations(version text primary key, checksum text not null, applied_at timestamptz not null default now()); alter table public.cms_migrations enable row level security; revoke all on public.cms_migrations from anon, authenticated',
    );
    for (const file of files) {
      const version = file.split('_')[0];
      const source = await readFile(new URL(file, directory), 'utf8');
      const checksum = createHash('sha256').update(source).digest('hex');
      const existing = await client.query<{ checksum: string }>(
        'select checksum from public.cms_migrations where version=$1',
        [version],
      );
      if (existing.rows[0]) {
        if (existing.rows[0].checksum !== checksum)
          throw new Error(`적용된 마이그레이션의 원문 변경 감지: ${file}`);
        console.log(`이미 적용된 SQL: ${file}`);
        continue;
      }
      await client.query(source.replace(/^begin;\s*/i, '').replace(/commit;\s*$/i, ''));
      await client.query('insert into public.cms_migrations(version,checksum) values($1,$2)', [
        version,
        checksum,
      ]);
      console.log(`SQL 적용 완료: ${file}`);
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
