import Link from 'next/link';
import Blog from '@/components/Blog/Blog';
import Countdown from '@/components/Countdown/Countdown';
import Timeline from '@/components/Timeline/Timeline';
import { siteSettings, publishedEntries } from '@/src/cms/repository';
import { getAllPosts } from '@/src/lib/queries';
import { text, list } from '@/src/cms/schema';
// CMS 데이터로 홈 섹션 구성
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
  return (
    <main className="space-y-12 tablet:space-y-16">
      {sections.map((section) => {
        const component = text(section, 'component');
        if (component === 'hero')
          return (
            <section
              key={section.id}
              className="bg-season-4/40 py-8 dark:bg-season-4/5 tablet:py-12"
            >
              <div className="container grid grid-cols-1 items-center gap-6 tablet:grid-cols-2">
                {settings.homeImage && (
                  <img
                    src={settings.homeImage}
                    alt={settings.homeTitle}
                    className="w-full rounded-lg"
                  />
                )}
                <div className="space-y-4">
                  <h1 className="text-3xl font-bold">{settings.homeTitle}</h1>
                  <p className="text-base leading-relaxed text-muted-foreground">
                    {settings.homeDescription}
                  </p>
                  {settings.homeLink && (
                    <Link
                      href={settings.homeLink}
                      className="font-semibold text-brand-link hover:underline"
                    >
                      {settings.homeLinkLabel}
                    </Link>
                  )}
                </div>
              </div>
            </section>
          );
        if (component === 'countdown')
          return (
            <section key={section.id} className="container space-y-8">
              <h2 className="text-2xl font-bold">{section.title}</h2>
              <div className="grid grid-cols-1 gap-4 tablet:grid-cols-3 laptop:grid-cols-6">
                {groups.map((group) => (
                  <div key={group} className="space-y-2">
                    <h3 className="text-sm font-semibold">{group}</h3>
                    <Countdown
                      seasons={countdowns
                        .filter((item) => text(item, 'group') === group)
                        .map((item) => {
                          const season = seasons.find(
                            (season) => season.id === text(item, 'seasonId'),
                          );
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
          );
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
              <h2 className="container text-2xl font-bold">{section.title}</h2>
              <Timeline />
            </section>
          );
        return null;
      })}
    </main>
  );
};
export default Home;
