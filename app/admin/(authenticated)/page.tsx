import Link from 'next/link';
import { adminEntries } from '@/src/cms/repository';
import { kindLabels, type Kind } from '@/src/cms/schema';
// 콘텐츠 현황과 최근 작업
const Dashboard = async () => {
  const entries = await adminEntries();
  const kinds: Kind[] = ['post', 'video', 'season', 'coupon'];
  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-semibold">대시보드</h1>
      </header>
      <section className="cms-panel">
        <h2 className="mb-5 text-lg font-semibold">콘텐츠 현황</h2>
        <div className="grid grid-cols-2 gap-6 tablet:grid-cols-4">
          {kinds.map((kind) => (
            <Link
              key={kind}
              href={'/admin/content/' + kind}
              className="space-y-2 rounded-sm hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
            >
              <span className="text-sm">{kindLabels[kind]}</span>
              <strong className="block text-3xl">
                {entries.filter((entry) => entry.kind === kind).length}
              </strong>
            </Link>
          ))}
        </div>
      </section>
      <section className="cms-panel">
        <h2 className="mb-5 text-lg font-semibold">최근 수정한 콘텐츠</h2>
        <div className="divide-y">
          {[...entries]
            .sort((a, b) => b.updated_at.localeCompare(a.updated_at))
            .slice(0, 10)
            .map((entry) => (
              <Link
                key={entry.id}
                href={'/admin/content/' + entry.kind + '/' + entry.id}
                className="flex min-w-0 flex-col gap-2 rounded-sm py-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring tablet:flex-row tablet:items-center tablet:justify-between tablet:gap-4"
              >
                <span className="min-w-0 break-words">{entry.title}</span>
                <span className="flex shrink-0 gap-3 text-sm text-muted-foreground">
                  <span>{kindLabels[entry.kind]}</span>
                  <span>{entry.published ? 'Published' : 'Draft'}</span>
                </span>
              </Link>
            ))}
        </div>
        {!entries.length && (
          <p className="text-muted-foreground">콘텐츠 메뉴에서 첫 항목을 추가할 수 있습니다.</p>
        )}
      </section>
    </div>
  );
};
export default Dashboard;
