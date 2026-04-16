'use client';

import Blog from '@/components/Blog/Blog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { YouTubeVideoItem } from '@/src/types';
import { categories } from '@/src/types';
import { cn, fallBackIndex } from '@/src/util/utils';

const YouTubeVideoTabs = ({
  categorizedVideos,
  nonZeroCategoryKeys,
  overrideIndex,
  className,
}: {
  categorizedVideos: {
    [key: string]: YouTubeVideoItem[];
  };
  nonZeroCategoryKeys: string[];
  overrideIndex: number;
  className?: string;
}) => (
  <Tabs
    defaultValue={nonZeroCategoryKeys[fallBackIndex(nonZeroCategoryKeys, overrideIndex)]}
    className={cn('w-full', className)}
  >
    <TabsList className="flex size-full">
      {categories.map((category) => (
        <>
          {categorizedVideos[category].length > 0 && (
            <TabsTrigger
              key={category}
              value={category}
              onClick={() => {
                // calculate the index of the category in the categoryKeys array
                const categoryIndex = nonZeroCategoryKeys.indexOf(category);

                // if categoryIndex === 0, then eliminate the query string
                if (categoryIndex === 0)
                  window.history.pushState(null, '', `${window.location.pathname}`); // else, push the query string with the correct index
                else window.history.pushState(null, '', `?idx=${categoryIndex}`);
              }}
              className="h-10 w-full truncate text-base font-medium tablet:h-12 tablet:text-lg laptop:text-xl"
            >
              {category}
            </TabsTrigger>
          )}
        </>
      ))}
    </TabsList>
    {categories.map((category) => (
      <>
        {categorizedVideos[category].length > 0 && (
          <TabsContent key={category} value={category}>
            {categorizedVideos[category].length > 0 ? (
              <div className="relative mt-8 grid w-full grid-cols-1 gap-8 tablet:grid-cols-2 laptop:mt-12 laptop:grid-cols-3">
                {categorizedVideos[category].map((video: YouTubeVideoItem, index: number) => (
                  <Blog
                    key={video.id}
                    hyperlink={`https://www.youtube.com/watch?v=${video.id}`}
                    thumbnail={
                      video.snippet.thumbnails.maxres?.url ?? video.snippet.thumbnails.high.url
                    }
                    isImagePriority={index < 6}
                    title={video.snippet.title}
                    description={video.snippet.channelTitle}
                    date={video.snippet.publishedAt}
                    tags={[]}
                  />
                ))}
              </div>
            ) : (
              <p className="py-20 text-center text-2xl font-bold tablet:text-3xl laptop:py-28 laptop:text-4xl">
                현재 카테고리에 해당하는 영상이 없습니다.
              </p>
            )}
          </TabsContent>
        )}
      </>
    ))}
  </Tabs>
);

export default YouTubeVideoTabs;
