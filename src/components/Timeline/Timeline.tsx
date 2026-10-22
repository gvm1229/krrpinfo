import { getTimeline } from '@/src/data/timeline';
import TimelineGroup from './TimelineGroup';

// 타임라인 루트 서버 컴포넌트
const Timeline = async () => {
  const groups = await getTimeline();

  return (
    <section className="container relative py-8">
      <div className="absolute bottom-8 left-8 top-8 w-px bg-zinc-300 dark:bg-zinc-700" />
      <div className="flex min-w-0 flex-col gap-12 pl-6 tablet:pl-10">
        {groups.map((group) => (
          <TimelineGroup key={group.id} group={group} />
        ))}
      </div>
    </section>
  );
};

export default Timeline;
