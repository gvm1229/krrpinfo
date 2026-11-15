import { notFound as disabledPage } from 'next/navigation';
import { siteSettings as pageSettings } from '@/src/cms/repository';
import { publicCopy, publishedEntries } from '@/src/cms/repository';
import { text } from '@/src/cms/schema';
import { FeaturedVideos } from '@/components/Video/FeaturedVideos';
import { Copy } from '@/components/Text/PublicSite';
// 영상 목록 메타데이터
export const generateMetadata = async () => {
  if ((await pageSettings()).videosEnabled !== 'true') return {};
  return { title: (await publicCopy())['videos.title'], alternates: { canonical: '/videos' } };
};
// 독립된 추천 영상 목록
const VideosPage = async () => {
  if ((await pageSettings()).videosEnabled !== 'true') disabledPage();
  const [videos, categories] = await Promise.all([
    publishedEntries('video'),
    publishedEntries('category'),
  ]);
  return (
    <main className="container space-y-6">
      <h1 className="text-3xl font-bold tablet:text-4xl">
        <Copy id="videos.title" />
      </h1>
      <FeaturedVideos
        videos={videos}
        categories={categories.filter((category) => text(category, 'scope') === 'video')}
      />
    </main>
  );
};
export default VideosPage;
