import Blog from '@/src/components/Blog/Blog';
import { cn } from '@/src/util/utils';

const Featured = ({ className }) => (
  <div className={cn('grid size-full grid-cols-1 content-center gap-y-4 md:grid-cols-3 md:gap-4', className)}>
    <div className="col-span-2 flex size-full items-center justify-center bg-gray-300 md:h-144">
      Ongoing event
    </div>
    <div className="col-span-1 grid size-full grid-rows-3 gap-y-4 md:gap-4">
      <div className="flex size-full items-center justify-center bg-amber-500">
        Current season: S24
      </div>
      <div className="flex size-full items-center justify-center bg-blue-300">
        PLACEHOLDER
      </div>
      <div className="flex size-full items-center justify-center bg-red-300">
        PLACEHOLDER
      </div>
    </div>
  </div>
);

const Posts = ({ className }) => {
  const posts = [
    {
      width: 'w-full',
      thumbnail: '/assets/images/넥슨API.jpg',
      category: '유틸리티 도구',
      title: '계정 정보 조회',
      toNavigate: 'view_account',
    },
    {
      width: 'w-full',
      thumbnail: '/assets/images/S24/시즌배너.webp',
      imgStyle: 'object-cover',
      category: '넥슨 공식 매체',
      title: '진행 중인 & 진행 예정인 이벤트',
      hyperlink: 'https://kartrush.nexon.com/2023/event_231214-launching',
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
      thumbnail: '/assets/images/아이템전.webp',
      imgStyle: 'object-fill',
      category: '유용한 링크',
      title: '아이템전용 카트 & 펫 목록 퀵뷰',
      hyperlink: 'https://krrpitem.vercel.app/',
    },
  ];

  return (
    <div className={cn('grid size-full grid-cols-1 content-center gap-y-4 md:grid-cols-3 md:gap-4', className)}>
      {posts.map((post) => (
        // <div key={post.title} className="bg-purple-200">
        //   <h1 className="text-center font-bold">{`POST #${index}`}</h1>
        // </div>
        <Blog key={post.title} {...post} />
      ))}
    </div>
  );
};

export default function Home() {
  return (
    <main className="flex h-full flex-col items-center gap-y-8 md:gap-y-16">
      <Featured className="px-4" />
      <Posts />
    </main>
  );
}
