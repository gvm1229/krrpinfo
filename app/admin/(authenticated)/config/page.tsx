// admin config placeholder — Phase 5 후속 PR 에서 구현 예정
export const metadata = {
  title: 'Admin — Config',
  robots: { index: false, follow: false },
};

export default function AdminConfigPage() {
  const planned = [
    { key: 'nav', desc: '헤더 네비게이션 항목 (config/navBar.ts) 편집' },
    { key: 'footer', desc: '푸터 CTA / 링크 편집' },
    { key: 'features', desc: 'feature flag 토글 (NEXT_PUBLIC_SHOW_YOUTUBERS 등)' },
    { key: 'cache', desc: 'revalidate 트리거 버튼' },
  ];

  return (
    <div className="space-y-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold">Config</h1>
        <p className="text-sm text-zinc-500">Coming soon — Phase 5 후속 PR. 예정 항목:</p>
      </header>
      <ul className="divide-y rounded-lg border bg-white dark:bg-zinc-950">
        {planned.map((item) => (
          <li key={item.key} className="flex items-baseline gap-3 px-4 py-3 text-sm">
            <code className="shrink-0 rounded bg-zinc-100 px-2 py-0.5 text-xs dark:bg-zinc-800">
              {item.key}
            </code>
            <span className="text-zinc-700 dark:text-zinc-300">{item.desc}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
