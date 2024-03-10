import Blog from '@/src/components/Blog/Blog';
import Clock from '@/src/components/Countdown/Clock';
import Countdown from '@/src/components/Countdown/Countdown';
import { cn } from '@/src/util/utils';

const Featured = ({ className }) => (
  <div
    className={cn('relative grid size-full grid-cols-1 content-center gap-y-4 tablet:grid-cols-3 tablet:gap-4', className)}
  >
    <div
      className="col-span-2 flex size-full items-center justify-center bg-slate-400 dark:bg-slate-600 tablet:h-144"
    >
      <h1 className="text-xl font-semibold tablet:text-3xl">
        Ongoing event
      </h1>
    </div>
    <div className="col-span-1 flex size-full flex-col gap-y-4 tablet:gap-4">
      <Countdown
        targetDateStr="4/17/2024"
        size="w-full shrink-0 h-80"
      />
      <Clock
        bgColor="bg-slate-400 dark:bg-slate-600"
        size="size-full"
      />
    </div>
  </div>
);

const Posts = ({ className }) => {
  const posts = [
    // {
    //   width: 'w-full',
    //   thumbnail: '/assets/images/넥슨API.jpg',
    //   category: '유틸리티 도구',
    //   title: '계정 정보 조회',
    //   toNavigate: 'view_account',
    // },
    {
      width: 'w-full',
      thumbnail: '/assets/images/한섭/S24_시즌배너.webp',
      imgStyle: 'object-cover',
      tags: ['넥슨 공식 매체'],
      title: '진행 중인 & 진행 예정인 이벤트',
      hyperlink: 'https://kartrush.nexon.com/2024/event_240215-launching',
    },
    {
      width: 'w-full',
      thumbnail: '/assets/images/썸네일공지사항.jpg',
      imgStyle: 'object-cover desktop:object-fill',
      tags: ['넥슨 공식 매체'],
      title: '일반 공지사항',
      hyperlink: 'https://forum.nexon.com/kartrush/board_list?board=839',
    },
    {
      width: 'w-full',
      thumbnail: '/assets/images/썸네일이벤트.png',
      imgStyle: 'object-cover desktop:object-fill',
      tags: ['넥슨 공식 매체'],
      title: '이벤트 공지사항',
      hyperlink: 'https://forum.nexon.com/kartrush/board_list?board=741',
    },
    {
      width: 'w-full',
      thumbnail: '/assets/images/확짤1.jpg',
      tags: ['유용한 링크'],
      title: '확률표 1 - 상점 교환 관련',
      hyperlink: 'https://m.nexon.com/probability/2038?language=ko',
    },
    {
      width: 'w-full',
      thumbnail: '/assets/images/확짤2.jpg',
      tags: ['유용한 링크'],
      title: '확률표 2 - 주 과금 컨텐츠 관련',
      hyperlink: 'https://m.nexon.com/probability/705?language=ko',
    },
    {
      width: 'w-full',
      thumbnail: '/assets/images/sukimi.jpg',
      tags: ['유용한 링크'],
      title: '스피드 카트 성능 비교',
      hyperlink: 'https://krp-kart-compare.netlify.app/',
    },
    {
      width: 'w-full',
      thumbnail: '/assets/images/아이템전.webp',
      imgStyle: 'object-fill',
      tags: ['유용한 링크'],
      title: '아이템전용 카트 & 펫 목록 퀵뷰',
      hyperlink: 'https://krrpitem.vercel.app/',
    },
  ];

  return (
    <div
      className={cn('relative grid size-full grid-cols-1 content-center gap-y-4 tablet:grid-cols-2 tablet:gap-4 desktop:grid-cols-3', className)}
    >
      {posts.map((post, index) => (
        <Blog
          key={post.title}
          isImagePriority={index < 3}
          {...post}
        />
      ))}
    </div>
  );
};

export default function Home() {
  return (
    <main className="relative h-full space-y-8 tablet:space-y-16 desktop:space-y-24">
      <Featured className="px-4" />
      <Posts />
    </main>
  );
}
