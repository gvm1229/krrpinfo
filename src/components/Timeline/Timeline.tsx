import { getTimeline } from '@/src/data/timeline';
import TimelineGroup from './TimelineGroup';

// 타임라인 루트 서버 컴포넌트
const Timeline = async () => {
  const groups = await getTimeline();

  return (
    <section className="relative mx-auto max-w-[1280px] px-4 py-12 mobile_only:pl-14 tablet:pl-[120px]">
      {/* 수직 spine */}
      <div className="absolute left-[47px] top-0 bottom-0 w-px bg-zinc-300 dark:bg-zinc-700" />
      {/* 그룹 목록 */}
      <div className="flex flex-col gap-12">
        {groups.map((group) => (
          <TimelineGroup key={group.id} group={group} />
        ))}
      </div>
    </section>
  );
};

export default Timeline;
