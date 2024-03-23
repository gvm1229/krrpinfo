import { Redis } from '@upstash/redis';
import { compareDesc } from 'date-fns';
import Blog from '@/components/Blog/Blog';
import BlogFeatured from '@/src/components/Blog/BlogFeatured';
import CarouselContainerMD from '@/src/components/Carousel/CarouselContainerMD';
import CarouselContainerSM from '@/src/components/Carousel/CarouselContainerSM';
import CountdownCN from '@/src/components/Countdown/CountdownCN';
import CountdownKR from '@/src/components/Countdown/CountdownKR';
import { cn } from '@/src/util/utils';
import type { Post } from 'contentlayer/generated';
import { allPosts } from 'contentlayer/generated';

const FeaturedBento = ({ className }: { className?: string }) => (
  <div
    className={cn(
      'relative grid grid-cols-2 content-center gap-x-4 gap-y-8 tablet:grid-cols-3',
      className,
    )}
  >
    <div className="col-span-1 row-span-1 flex aspect-square items-center justify-center overflow-hidden">
      <CountdownCN
        seasons={[
          {
            seasonNum: 29,
            targetEndDate: '3/27/2024',
            bgFromColor: 'from-cyan-600',
            bgToColor: 'to-cyan-300',
          },
          {
            seasonNum: 30,
            targetEndDate: '5/27/2024',
            bgFromColor: 'from-indigo-600',
            bgToColor: 'to-indigo-300',
          },
        ]}
      />
    </div>
    <div className="col-span-1 row-span-1 flex aspect-square items-center justify-center overflow-hidden">
      <CountdownKR
        seasons={[
          {
            seasonNum: 24,
            src: '/assets/images/한섭/S24_타이틀_가공.png',
            alt: 'S24타이틀',
            targetEndDate: '4/17/2024',
            bgFromColor: 'from-amber-600',
            bgToColor: 'to-amber-300',
          },
          {
            seasonNum: 25,
            src: '/assets/images/한섭/S24_타이틀_가공.png',
            alt: 'S25타이틀',
            targetEndDate: '6/20/2024',
            bgFromColor: 'from-purple-600',
            bgToColor: 'to-purple-300',
          },
        ]}
      />
    </div>
    {/* <h1 className="col-span-1 row-span-1 flex aspect-square items-center justify-center overflow-hidden rounded-[1rem] bg-zinc-400 text-center text-xl font-bold dark:bg-zinc-600 tablet:text-3xl">중국 서버 시즌: 30</h1> */}
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
      className={cn('space-y-8 overflow-hidden bg-muted py-8 laptop:space-y-12', className)}
    >
      <h1 className="text-center text-3xl font-bold laptop:text-4xl">
        유용한 링크
      </h1>
      <div className="container tablet:hidden">
        <CarouselContainerSM linksInput={links} />
      </div>
      <div className="container mobile_only:hidden laptop:mx-auto laptop:max-w-10xl">
        <CarouselContainerMD linksInput={links} />
      </div>
    </div>
  );
};

export const revalidate = 60;
const redis = Redis.fromEnv();

function renderPosts(className: string, posts: Post[], views = {}) {
  return (
    <div
      id="posts_wrapper"
      className={cn('space-y-8 laptop:space-y-12', className)}
    >
      <h1 className="text-center text-3xl font-bold laptop:text-4xl">
        최신 포스트 목록
      </h1>
      <div className="relative grid size-full grid-cols-1 content-center gap-y-8 tablet:grid-cols-2 tablet:gap-8 laptop:grid-cols-3">
        {posts.slice(0, 6).map((post) => (
          <Blog
            key={post._id}
            toNavigate={post.slug}
            isImagePriority={false}
            views={views[post.slugAsParams] ?? 1234} // Default views for development or if missing in production
            {...post}
          />
        ))}
      </div>
    </div>
  );
}

async function Posts({ className }: { className?: string }) {
  const posts = allPosts
    .filter((post) => post.published)
    .sort((a, b) => compareDesc(new Date(a.date), new Date(b.date)));

  if (process.env.NODE_ENV === 'development')
    return renderPosts(className, posts);

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

  return renderPosts(className, posts, views);
}

export default function Home() {
  return (
    <main className="relative h-full space-y-8 tablet:space-y-16">
      <BlogFeatured
        lastEditDate="4/17/2024"
        thumbnail="/assets/images/S28/시즌배너.webp"
        title="향후 시즌 미리보기"
        description="중국 서버는 한국 서버에 비해 약 10개월 (5시즌) 이 앞서있습니다. 미래에는 어떤 카트, 캐릭터 등이 등장할지 미리 알아보세요."
        className="container"
      />
      <FeaturedBento className="container" />
      <Links />
      <Posts className="container" />
    </main>
  );
}
