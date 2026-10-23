import { createServer, request as proxyRequest } from 'node:http';
import { readFile } from 'node:fs/promises';
import { createHmac } from 'node:crypto';
import { spawn } from 'node:child_process';
import { Client } from 'pg';
import { createMigration } from '../../../scripts/cms/migration';
import { hashPassword } from '../../cms/password';
// 로컬 PostgreSQL 검증 환경에 이전 데이터 준비
const main = async () => {
  const client = new Client({
    connectionString: 'postgresql://postgres:local-cms-check@127.0.0.1:55432/postgres',
  });
  await client.connect();
  const seed = JSON.parse(await readFile('scripts/cms/seed.json', 'utf8'));
  const snapshot = JSON.parse(await readFile('backup/legacy-cms.json', 'utf8'));
  const plan = createMigration(seed, snapshot);
  await client.query(
    "insert into cms_settings(id,data) values('site',$1) on conflict(id) do update set data = excluded.data || cms_settings.data",
    [plan.settings],
  );
  for (const entry of plan.entries)
    await client.query(
      'insert into cms_entries(id,kind,slug,title,published,position,data) values(coalesce($1::uuid,gen_random_uuid()),$2,$3,$4,$5,$6,$7) on conflict(kind,slug) do nothing',
      [entry.id, entry.kind, entry.slug, entry.title, entry.published, entry.position, entry.data],
    );
  await client.end();
  if (process.argv.includes('--seed-only')) {
    console.log('로컬 초기 데이터 확인');
    return;
  }
  const secret = 'cms-local-only-jwt-secret-not-production-20261021';
  const encoded = (value: unknown) => Buffer.from(JSON.stringify(value)).toString('base64url');
  const payload =
    encoded({ alg: 'HS256', typ: 'JWT' }) +
    '.' +
    encoded({
      role: 'service_role',
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 4 * 3600,
    });
  const token = payload + '.' + createHmac('sha256', secret).update(payload).digest('base64url');
  const proxy = createServer((incoming, outgoing) => {
    if (!incoming.url?.startsWith('/rest/v1/')) {
      outgoing.writeHead(404);
      outgoing.end();
      return;
    }
    const forwarded = proxyRequest(
      'http://127.0.0.1:55433' + incoming.url.slice('/rest/v1'.length),
      { method: incoming.method, headers: { ...incoming.headers, host: '127.0.0.1:55433' } },
      (response) => {
        outgoing.writeHead(response.statusCode ?? 500, response.headers);
        response.pipe(outgoing);
      },
    );
    forwarded.on('error', () => {
      outgoing.writeHead(502);
      outgoing.end();
    });
    incoming.pipe(forwarded);
  });
  await new Promise<void>((done) => proxy.listen(55434, '127.0.0.1', done));
  const app = spawn(
    process.execPath,
    ['node_modules/next/dist/bin/next', 'dev', '--port', '3000', '--hostname', '127.0.0.1'],
    {
      stdio: 'inherit',
      env: {
        ...process.env,
        SUPABASE_URL: 'http://127.0.0.1:55434',
        SUPABASE_SECRET_KEY: token,
        AUTH_SECRET: 'cms-local-only-nextauth-secret-not-production-20261021',
        AUTH_OWNER_ID: 'cms-owner',
        AUTH_PASSWORD_HASH: hashPassword('cms-local-testing-password'),
        NEXT_PUBLIC_APP_URL: 'http://localhost:3000',
        AUTH_URL: 'http://localhost:3000',
        DATABASE_URL: 'postgresql://postgres:local-cms-check@127.0.0.1:55432/postgres',
        NEXON_API_KEY: '',
        R2_ACCOUNT_ID: '',
        R2_ACCESS_KEY_ID: '',
        R2_SECRET_ACCESS_KEY: '',
        R2_BUCKET: '',
        R2_PUBLIC_URL: '',
      },
    },
  );
  const close = () => {
    app.kill();
    proxy.close();
  };
  process.on('SIGINT', close);
  process.on('SIGTERM', close);
  app.on('exit', () => {
    proxy.close();
  });
  console.log('로컬 CMS 브라우저 검증 서버 준비');
};
main().catch(() => {
  console.error('로컬 CMS 브라우저 검증 서버 시작 실패');
  process.exitCode = 1;
});
