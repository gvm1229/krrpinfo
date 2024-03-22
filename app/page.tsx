import { Redis } from '@upstash/redis';
import { compareDesc } from 'date-fns';
import Blog from '@/components/Blog/Blog';
import Clock from '@/components/Countdown/Clock';
import Countdown from '@/components/Countdown/Countdown';
import CarouselContainerMD from '@/src/components/Carousel/CarouselContainerMD';
import CarouselContainerSM from '@/src/components/Carousel/CarouselContainerSM';
import { cn } from '@/src/util/utils';
import { allPosts } from 'contentlayer/generated';

const Featured = ({ className }: { className?: string }) => (
  <div
    className={cn(
      'relative grid size-full grid-cols-1 content-center gap-y-4 tablet:grid-cols-3 tablet:gap-4',
      className,
    )}
  >
    <div className="col-span-2 flex size-full items-center justify-center bg-zinc-400 dark:bg-zinc-600 mobile_only:py-6 tablet:h-[400px] desktop:h-[500px]">
      <h1 className="text-xl font-semibold tablet:text-3xl">Ongoing event</h1>
    </div>
    <div className="col-span-1 flex size-full flex-col gap-y-4 tablet:gap-4">
      <Countdown targetDateStr="4/17/2024" size="w-full shrink-0 h-80" />
      <Clock
        bgColor="bg-zinc-400 dark:bg-zinc-600"
        size="size-full mobile_only:py-6"
      />
    </div>
  </div>
);

const Links = ({ className }: { className?: string }) => {
  const links = [
    {
      thumbnail: '/assets/images/한섭/S24_시즌배너.webp',
      tags: ['넥슨 공식 매체'],
      title: '진행 중인 & 진행 예정인 이벤트',
      hyperlink: 'https://kartrush.nexon.com/2024/event_240215-launching',
    },
    {
      thumbnail: '/assets/images/links/썸네일공지사항.jpg',
      tags: ['넥슨 공식 매체'],
      title: '일반 공지사항',
      hyperlink: 'https://forum.nexon.com/kartrush/board_list?board=839',
    },
    {
      thumbnail: '/assets/images/links/썸네일이벤트.png',
      tags: ['넥슨 공식 매체'],
      title: '이벤트 공지사항',
      hyperlink: 'https://forum.nexon.com/kartrush/board_list?board=741',
    },
    {
      thumbnail: '/assets/images/links/확짤1.jpg',
      tags: ['유용한 링크'],
      title: '확률표 1 - 상점 교환 관련',
      hyperlink: 'https://m.nexon.com/probability/2038?language=ko',
    },
    {
      thumbnail: '/assets/images/links/확짤2.jpg',
      tags: ['유용한 링크'],
      title: '확률표 2 - 주 과금 컨텐츠 관련',
      hyperlink: 'https://m.nexon.com/probability/705?language=ko',
    },
    {
      thumbnail: '/assets/images/links/sukimi.jpg',
      tags: ['유용한 링크'],
      title: '스피드 카트 성능 비교',
      hyperlink: 'https://krp-kart-compare.netlify.app/',
    },
    {
      thumbnail: '/assets/images/links/아이템전.webp',
      tags: ['유용한 링크'],
      title: '아이템전용 카트 & 펫 목록 퀵뷰',
      hyperlink: 'https://krrpitem.vercel.app/',
    },
  ];

  return (
    <div
      id="links_wrapper"
      className={cn('space-y-8 overflow-hidden desktop:space-y-16', className)}
    >
      <h1 className="container text-center text-3xl font-bold desktop:text-4xl">
        유용한 링크
      </h1>
      <div className="container tablet:hidden">
        <CarouselContainerSM linksInput={links} />
      </div>
      <div className="tablet_only:container mobile_only:hidden desktop:mx-auto desktop:max-w-10xl">
        <CarouselContainerMD linksInput={links} />
      </div>
    </div>
  );
};

export const revalidate = 60;
const redis = Redis.fromEnv();

async function Posts({ className }: { className?: string }) {
  const posts = allPosts
    .filter((post) => post.published)
    .sort((a, b) => compareDesc(new Date(a.date), new Date(b.date)));

  if (process.env.NODE_ENV === 'development')
    return (
      <div
        id="posts_wrapper"
        className={cn('space-y-8 desktop:space-y-16', className)}
      >
        <h1 className="container text-center text-3xl font-bold desktop:text-4xl">
          최신 포스트 목록
        </h1>
        <div className="relative grid size-full grid-cols-1 content-center gap-y-8 tablet:grid-cols-2 tablet:gap-8 desktop:grid-cols-3">
          {posts.slice(0, 6).map((post) => (
            <Blog
              key={post._id}
              toNavigate={post.slug}
              isImagePriority={false}
              views={1234}
              {...post}
            />
          ))}
        </div>
      </div>
    );

  const views = (
    await redis.mget<number[]>(
      ...allPosts.map((p) => ['pageviews', 'projects', 'posts', p.slugAsParams].join(':')),
    )
  ).reduce(
    (acc, v, i) => {
      acc[allPosts[i].slugAsParams] = v ?? 0;
      return acc;
    },
    {} as Record<string, number>,
  );

  return (
    <div
      id="posts_wrapper"
      className={cn('space-y-8 desktop:space-y-16', className)}
    >
      <h1 className="container text-center text-3xl font-bold desktop:text-4xl">
        최신 포스트 목록
      </h1>
      <div className="relative grid size-full grid-cols-1 content-center gap-y-8 tablet:grid-cols-2 tablet:gap-8 desktop:grid-cols-3">
        {posts.slice(0, 6).map((post) => (
          <Blog
            key={post._id}
            toNavigate={post.slug}
            isImagePriority={false}
            views={views[post.slugAsParams]}
            {...post}
          />
        ))}
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <main className="relative h-full space-y-8 tablet:space-y-16 desktop:space-y-24">
      <Featured className="container" />
      <Links />
      <Posts className="container" />
    </main>
  );
}
