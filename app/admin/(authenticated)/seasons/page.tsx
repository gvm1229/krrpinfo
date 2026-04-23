// admin seasons placeholder — Phase 4 (Cloudflare Images + season schema) 미해결
export const metadata = {
  title: 'Admin — Seasons',
  robots: { index: false, follow: false },
};

export default function AdminSeasonsPage() {
  return (
    <div className="space-y-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold">Seasons</h1>
        <p className="text-sm text-zinc-500">
          시즌 관리 — palette extractor / banner 업로드 / status pill
        </p>
      </header>
      <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900 dark:border-amber-800/50 dark:bg-amber-950/30 dark:text-amber-200">
        <p className="font-medium">🚧 Blocked — Phase 4 prerequisite</p>
        <p className="mt-2">
          이 화면은 PLAN_DESIGN_OVERHAUL Phase 4 (Cloudflare Images CDN + season DB schema) 완료 후
          구현됩니다. 필요한 사용자 작업:
        </p>
        <ul className="mt-2 list-inside list-disc space-y-1">
          <li>Cloudflare account + API token 발급</li>
          <li>
            env 등록: <code>CLOUDFLARE_ACCOUNT_ID</code>, <code>CLOUDFLARE_IMAGES_TOKEN</code>,
            <code>NEXT_PUBLIC_CLOUDFLARE_IMAGES_HASH</code>
          </li>
          <li>DB 결정 — 현재 MongoDB 위에 seasons collection 추가 vs plan 의 Supabase 재선정</li>
        </ul>
        <p className="mt-2">
          상세: <code>USER_TASKS.md</code>
        </p>
      </div>
    </div>
  );
}
