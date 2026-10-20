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
        <p className="mt-2 text-muted-foreground">
          사이트 콘텐츠를 작성하고 공개 상태를 관리하세요.
        </p>
      </header>
      <section className="cms-panel">
        <h2 className="mb-5 text-lg font-semibold">콘텐츠 현황</h2>
        <div className="grid grid-cols-2 gap-6 tablet:grid-cols-4">
          {kinds.map((kind) => (
            <Link
              key={kind}
              href={'/admin/content/' + kind}
              className="space-y-2 hover:text-[#4945ff]"
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
                className="flex items-center justify-between gap-4 py-4"
              >
                <span>{entry.title}</span>
                <span className="text-xs text-muted-foreground">
                  {kindLabels[entry.kind]} · {entry.published ? 'Published' : 'Draft'}
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
