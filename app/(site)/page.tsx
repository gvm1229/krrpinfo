import Link from 'next/link';
import Blog from '@/components/Blog/Blog';
import Countdown from '@/components/Countdown/Countdown';
import Timeline from '@/components/Timeline/Timeline';
import RedeemCard from '@/components/Redeem/RedeemCard';
import { Button } from '@/components/ui/button';
import { Copy } from '@/components/Text/PublicSite';
import { siteSettings, publishedEntries } from '@/src/cms/repository';
import { getAllPosts } from '@/src/lib/queries';
import { text, list, publicPathEnabled } from '@/src/cms/schema';
import type { Entry } from '@/src/cms/schema';
// 상단 미래시·쿠폰·일정 고정, 나머지는 CMS 섹션 순서
const Home = async () => {
  const [settings, sections, links, countdowns, seasons, posts] = await Promise.all([
    siteSettings(),
    publishedEntries('section'),
    publishedEntries('link'),
    publishedEntries('countdown'),
    publishedEntries('season'),
    getAllPosts(),
  ]);
  const groups = Array.from(new Set(countdowns.map((item) => text(item, 'group'))));
  // 고정 위치 섹션의 CMS 노출 여부
  const sectionOf = (component: string): Entry | undefined =>
    sections.find((section) => text(section, 'component') === component);
  const hero = sectionOf('hero');
  const schedule = sectionOf('countdown');
  const showCoupons = publicPathEnabled(settings, '/redeem');
  return (
    <main className="space-y-12 tablet:space-y-16">
      {(hero || showCoupons) && (
        <section className="container grid grid-cols-1 gap-6 laptop:grid-cols-5">
          {hero && (
            <div className="grid grid-cols-1 items-center gap-6 rounded-lg bg-season-4/40 p-5 dark:bg-season-4/10 tablet:grid-cols-2 tablet:p-6 laptop:col-span-3">
              {settings.homeImage && (
                <img
                  src={settings.homeImage}
                  alt={settings.homeTitle}
                  width={1200}
                  height={675}
                  className="aspect-video w-full rounded-lg object-cover"
                />
              )}
              <div className="space-y-4">
                <h1 className="text-balance text-3xl font-bold">{settings.homeTitle}</h1>
                <p className="text-base leading-relaxed text-muted-foreground">
                  {settings.homeDescription}
                </p>
                {settings.homeLink && (
                  <Button
                    asChild
                    className="whitespace-nowrap rounded-md bg-brand-blue font-semibold text-white hover:bg-brand-blue-hover"
                  >
                    <Link href={settings.homeLink}>{settings.homeLinkLabel}</Link>
                  </Button>
                )}
              </div>
            </div>
          )}
          {showCoupons && (
            <div className="space-y-3 laptop:col-span-2">
              <RedeemCard />
              <Link
                href="/redeem"
                className="inline-block text-sm font-semibold text-brand-link hover:underline"
              >
                <Copy id="redeem.title" />
              </Link>
            </div>
          )}
        </section>
      )}
      {schedule && (
        <section className="container space-y-6">
          <h2 className="text-2xl font-bold">{schedule.title}</h2>
          <div className="grid grid-cols-2 gap-x-3 gap-y-6 tablet:grid-cols-3 tablet:gap-x-4 laptop:grid-cols-6">
            {groups.map((group) => (
              <div key={group} className="space-y-2">
                <h3 className="text-sm font-semibold">{group}</h3>
                <Countdown
                  seasons={countdowns
                    .filter((item) => text(item, 'group') === group)
                    .map((item) => {
                      const season = seasons.find((season) => season.id === text(item, 'seasonId'));
                      return {
                        title: item.title,
                        description: text(item, 'description'),
                        src: text(item, 'image') || undefined,
                        alt: item.title,
                        targetEndDate: season
                          ? text(season, item.data.untilEnd === true ? 'endDate' : 'startDate')
                          : text(item, 'date'),
                        countdownUntilEnd: item.data.untilEnd === true,
                        bgFromColor: 'from-blue-600',
                        bgToColor: 'to-blue-400',
                      };
                    })}
                />
              </div>
            ))}
          </div>
        </section>
      )}
      {sections.map((section) => {
        const component = text(section, 'component');
        if (component === 'links')
          return (
            <section key={section.id} className="bg-muted py-8">
              <div className="container space-y-8">
                <h2 className="text-2xl font-bold">{section.title}</h2>
                <div className="grid grid-cols-1 gap-6 tablet:grid-cols-2 laptop:grid-cols-4">
                  {links.map((link) => (
                    <Blog
                      key={link.id}
                      hyperlink={text(link, 'href')}
                      thumbnail={text(link, 'image')}
                      title={link.title}
                      tags={list(text(link, 'tags'))}
                    />
                  ))}
                </div>
              </div>
            </section>
          );
        if (component === 'posts')
          return (
            <section key={section.id} className="container space-y-8">
              <h2 className="text-2xl font-bold">{section.title}</h2>
              <div className="grid grid-cols-1 gap-8 tablet:grid-cols-2 laptop:grid-cols-3">
                {posts.slice(0, 6).map((post) => (
                  <Blog
                    key={post.id}
                    toNavigate={'/posts/' + post.slug}
                    thumbnail={post.thumbnail}
                    title={post.title}
                    description={post.description ?? undefined}
                    date={post.pub_date}
                    tags={post.tags}
                  />
                ))}
              </div>
            </section>
          );
        if (component === 'timeline')
          return (
            <section key={section.id}>
              <div className="container flex flex-wrap items-baseline justify-between gap-3">
                <h2 className="text-2xl font-bold">{section.title}</h2>
                <Link
                  href="/seasons"
                  className="text-sm font-semibold text-brand-link hover:underline"
                >
                  <Copy id="seasons.title" />
                </Link>
              </div>
              <Timeline limit={3} />
            </section>
          );
        return null;
      })}
    </main>
  );
};
export default Home;
