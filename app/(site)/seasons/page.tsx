import { notFound as disabledPage } from 'next/navigation';
import { siteSettings as pageSettings } from '@/src/cms/repository';
import Timeline from '@/components/Timeline/Timeline';
import { Copy } from '@/components/Text/PublicSite';
import { publicCopy } from '@/src/cms/repository';
// 시즌 목록 메타데이터
export const generateMetadata = async () => {
  if ((await pageSettings()).seasonsEnabled !== 'true') return {};
  return { title: (await publicCopy())['seasons.title'], alternates: { canonical: '/seasons' } };
};
// CMS 시즌 미래시
const SeasonsPage = async () => {
  if ((await pageSettings()).seasonsEnabled !== 'true') disabledPage();
  return (
    <main>
      <header className="container space-y-3">
        <h1 className="text-3xl font-bold tablet:text-4xl">
          <Copy id="seasons.title" />
        </h1>
        <p className="text-muted-foreground">
          <Copy id="seasons.description" />
        </p>
      </header>
      <Timeline />
    </main>
  );
};
export default SeasonsPage;
