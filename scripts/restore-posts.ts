// Supabase dump JSON → MongoDB posts collection 복원 (upsert by slug)
// tags: string → [string] 변환, pub_date/created_at/updated_at → Date 변환
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { MongoClient } from 'mongodb';

const DB_NAME = 'krrpinfo';

export const toArray = (v: unknown): string[] => {
  if (Array.isArray(v)) return v as string[];
  if (typeof v === 'string' && v.length > 0) return [v];
  return [];
};

export const toDoc = (r: Record<string, unknown>) => ({
  id: r.id as string,
  slug: r.slug as string,
  title: r.title as string,
  description: r.description as string | null,
  pub_date: new Date(r.pub_date as string),
  thumbnail: r.thumbnail as string,
  tags: toArray(r.tags),
  keywords: (r.keywords as string[] | null) ?? null,
  content: r.content as string,
  published: r.published as boolean,
  created_at: new Date(r.created_at as string),
  updated_at: new Date(r.updated_at as string),
});

export async function restorePosts(
  url: string,
  dbName: string,
  docs: ReturnType<typeof toDoc>[],
): Promise<void> {
  const client = new MongoClient(url);
  await client.connect();

  try {
    const col = client.db(dbName).collection('posts');
    await col.createIndex({ slug: 1 }, { unique: true });

    let upserted = 0;
    let modified = 0;
    for (const doc of docs) {
      const result = await col.updateOne({ slug: doc.slug }, { $set: doc }, { upsert: true });
      if (result.upsertedCount) upserted += 1;
      if (result.modifiedCount) modified += 1;
    }

    console.log(
      `[restore-posts] 완료: db=${dbName}, total=${docs.length}, upserted=${upserted}, modified=${modified}`,
    );
  } finally {
    await client.close();
  }
}

/* v8 ignore start -- 엔트리포인트 orchestration. 순수 함수 (toArray/toDoc/restorePosts) 가 단위 테스트로 검증됨 */
async function main() {
  const mongoUrl = process.env.MONGODB_URL;
  if (!mongoUrl) {
    console.error('[restore-posts] MONGODB_URL 환경변수 없음');
    process.exit(1);
  }

  const backupDir = join(process.cwd(), 'backup');
  const files = readdirSync(backupDir)
    .filter((f) => f.startsWith('supabase-posts-') && f.endsWith('.json'))
    .sort();

  if (files.length === 0) {
    console.error('[restore-posts] backup/supabase-posts-*.json 없음');
    process.exit(1);
  }

  const latest = files[files.length - 1];
  console.log(`[restore-posts] 사용 파일: ${latest}`);

  const payload = JSON.parse(readFileSync(join(backupDir, latest), 'utf8')) as {
    rows: Array<Record<string, unknown>>;
  };

  const docs = payload.rows.map(toDoc);

  await restorePosts(mongoUrl, DB_NAME, docs);
}

// 직접 실행 시에만 main() 호출 (import 시 실행 방지)
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((err) => {
    console.error('[restore-posts] 실패:', err instanceof Error ? err.message : err);
    process.exit(1);
  });
}
/* v8 ignore stop */
