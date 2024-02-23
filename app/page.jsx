import Blog from '@/src/components/Blog/Blog';
import { cn } from '@/src/util/utils';

const Featured = ({ className }) => (
  <div
    className={cn('relative grid size-full grid-cols-1 content-center gap-y-4 tablet:grid-cols-3 tablet:gap-4', className)}
  >
    <div className="col-span-2 flex h-28 w-full items-center justify-center bg-gray-300 tablet:h-144">
      Ongoing event
    </div>
    <div className="col-span-1 grid size-full grid-rows-3 gap-y-4 tablet:gap-4">
      <div className="flex h-16 w-full items-center justify-center bg-amber-500 tablet:h-full">
        Current season: S24
      </div>
      <div className="flex h-16 w-full items-center justify-center bg-blue-300 tablet:h-full">
        PLACEHOLDER
      </div>
      <div className="flex h-16 w-full items-center justify-center bg-red-300 tablet:h-full">
        PLACEHOLDER
      </div>
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
      category: '넥슨 공식 매체',
      title: '진행 중인 & 진행 예정인 이벤트',
      hyperlink: 'https://kartrush.nexon.com/2024/event_240215-launching',
    },
    {
      width: 'w-full',
      thumbnail: '/assets/images/썸네일공지사항.jpg',
      imgStyle: 'object-cover desktop:object-fill',
      category: '넥슨 공식 매체',
      title: '넥슨 공지사항',
      hyperlink: 'https://forum.nexon.com/kartrush/board_list?board=839',
    },
    {
      width: 'w-full',
      thumbnail: '/assets/images/확짤1.jpg',
      category: '유용한 링크',
      title: '확률표 1 - 상점 교환 관련',
      hyperlink: 'https://m.nexon.com/probability/2038?language=ko',
    },
    {
      width: 'w-full',
      thumbnail: '/assets/images/확짤2.jpg',
      category: '유용한 링크',
      title: '확률표 2 - 주 과금 컨텐츠 관련',
      hyperlink: 'https://m.nexon.com/probability/705?language=ko',
    },
    {
      width: 'w-full',
      thumbnail: '/assets/images/sukimi.jpg',
      category: '유용한 링크',
      title: '스피드 카트 성능 비교',
      hyperlink: 'https://krp-kart-compare.netlify.app/',
    },
    {
      width: 'w-full',
      thumbnail: '/assets/images/아이템전.webp',
      imgStyle: 'object-fill',
      category: '유용한 링크',
      title: '아이템전용 카트 & 펫 목록 퀵뷰',
      hyperlink: 'https://krrpitem.vercel.app/',
    },
  ];

  return (
    <div
      className={cn('relative grid size-full grid-cols-1 content-center gap-y-4 tablet:grid-cols-2 tablet:gap-4 desktop:grid-cols-3', className)}
    >
      {posts.map((post) => (
        <Blog key={post.title} {...post} />
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
