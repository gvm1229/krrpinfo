// 시즌 미래시 (Timeline) 전용 페이지
import Timeline from '@/src/components/Timeline/Timeline';
import { siteConfig } from '@/config/site';

export const metadata = {
  title: '시즌 미래시',
  description: '카러플 시즌별 패치/이벤트/콘텐츠 출시 일정',
  openGraph: {
    title: `시즌 미래시 | ${siteConfig.name}`,
    description: '카러플 시즌별 패치/이벤트/콘텐츠 출시 일정',
  },
};

export default function SeasonsPage() {
  return (
    <main className="py-12">
      <header className="container mb-8">
        <h1 className="text-2xl font-bold tablet:text-4xl">시즌 미래시</h1>
        <p className="mt-2 text-base text-muted-foreground tablet:text-lg">
          중국 서버 기준 향후 시즌 콘텐츠 출시 일정
        </p>
      </header>
      <Timeline />
    </main>
  );
}
