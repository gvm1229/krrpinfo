'use client';
import { useState } from 'react';
import Blog from '@/components/Blog/Blog';
import { Copy } from '@/components/Text/PublicSite';
import { text, type Entry } from '@/src/cms/schema';
// CMS 분류별 추천 영상 목록
export const FeaturedVideos = ({
  videos,
  categories,
}: {
  videos: Entry[];
  categories: Entry[];
}) => {
  const [selected, setSelected] = useState(categories[0]?.id ?? '');
  const visible = selected
    ? videos.filter((video) => text(video, 'category') === selected)
    : videos;
  return (
    <div className="space-y-8">
      <div className="flex flex-wrap gap-2" role="tablist">
        {categories.map((category) => (
          <button
            key={category.id}
            type="button"
            role="tab"
            aria-selected={selected === category.id}
            className={
              'whitespace-nowrap rounded-md px-5 py-2 font-medium text-white ' +
              (selected === category.id ? 'bg-brand-blue' : 'bg-zinc-600')
            }
            onClick={() => setSelected(category.id)}
          >
            {category.title}
          </button>
        ))}
      </div>
      {visible.length ? (
        <div className="grid gap-8 tablet:grid-cols-2 laptop:grid-cols-3">
          {visible.map((video) => (
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
      )}
    </div>
  );
};
