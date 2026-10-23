'use client';
import Blog from '@/components/Blog/Blog';
import { Copy, useCopy } from '@/components/Text/PublicSite';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { text, type Entry } from '@/src/cms/schema';

// CMS 분류별 추천 영상 목록
export const FeaturedVideos = ({
  videos,
  categories,
}: {
  videos: Entry[];
  categories: Entry[];
}) => {
  const t = useCopy();
  // 선택 분류의 카드와 빈 목록 표시
  const renderVideos = (items: Entry[]) =>
    items.length ? (
      <div className="grid min-w-0 grid-cols-1 gap-8 tablet:grid-cols-2 laptop:grid-cols-3">
        {items.map((video) => (
          <Blog
            key={video.id}
            hyperlink={'https://www.youtube.com/watch?v=' + text(video, 'videoId')}
            thumbnail={text(video, 'thumbnail')}
            title={video.title}
            description={text(video, 'channelTitle')}
            date={text(video, 'pubDate') || undefined}
            tags={[]}
          />
        ))}
      </div>
    ) : (
      <p className="py-12 text-center">
        <Copy id="videos.empty" />
      </p>
    );
  if (!categories.length) return renderVideos(videos);
  return (
    <Tabs defaultValue={categories[0].id} className="min-w-0 space-y-6">
      <TabsList
        aria-label={t('videos.title')}
        className="flex h-auto w-full flex-wrap justify-start gap-2 bg-transparent p-0"
      >
        {categories.map((category) => (
          <TabsTrigger
            key={category.id}
            value={category.id}
            className="min-h-11 shrink-0 rounded-md bg-control px-4 py-2 text-white hover:bg-control-hover data-[state=active]:bg-brand-blue data-[state=active]:text-white data-[state=active]:shadow-none"
          >
            {category.title}
          </TabsTrigger>
        ))}
      </TabsList>
      {categories.map((category) => (
        <TabsContent key={category.id} value={category.id}>
          {renderVideos(videos.filter((video) => text(video, 'category') === category.id))}
        </TabsContent>
      ))}
    </Tabs>
  );
};
