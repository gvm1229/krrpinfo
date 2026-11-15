import { notFound } from 'next/navigation';
import { adminEntries, adminEntry, adminMedia } from '@/src/cms/repository';
import { kinds, kindLabels, type Kind } from '@/src/cms/schema';
import { ContentList } from '@/components/Admin/ContentList';
import { EntryForm } from '@/components/Admin/EntryForm';
export const dynamic = 'force-dynamic';
// 콘텐츠 종류별 목록과 편집 화면
const ContentPage = async ({ params }: { params: Promise<{ kind: string; entry?: string[] }> }) => {
  const route = await params;
  if (!kinds.includes(route.kind as Kind)) notFound();
  const kind = route.kind as Kind;
  if (!route.entry?.length) return <ContentList kind={kind} entries={await adminEntries(kind)} />;
  if (route.entry.length !== 1) notFound();
  const id = route.entry[0];
  if (id !== 'new' && !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id))
    notFound();
  const initial = id === 'new' ? null : await adminEntry(id);
  if (id !== 'new' && (!initial || initial.kind !== kind)) notFound();
  const [related, media] = await Promise.all([adminEntries(), adminMedia()]);
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-semibold">
        {kindLabels[kind]} {initial ? '편집' : '추가'}
      </h1>
      <EntryForm
        kind={kind}
        initial={initial}
        related={related.filter((entry) => entry.kind === 'season' || entry.kind === 'category')}
        media={media}
      />
    </div>
  );
};
export default ContentPage;
