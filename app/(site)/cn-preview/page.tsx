import Link from 'next/link';
import { ExternalLink } from 'lucide-react';
import { publicCopy, publishedEntries, siteSettings } from '@/src/cms/repository';
import { publicPathEnabled } from '@/src/cms/schema';
import { Copy } from '@/components/Text/PublicSite';
import { toCnUpdates } from '@/components/CnPreview/cn-updates';
import { formatDate } from '@/src/util/utils';
export const dynamic = 'force-dynamic';
// 중국 서버 미래시 메타데이터
export const generateMetadata = async () => {
  const copy = await publicCopy();
  return {
    title: copy['cn.title'],
    description: copy['cn.description'],
    alternates: { canonical: '/cn-preview' },
  };
};
// 중국 서버 소식 전체 목록
const CnPreviewPage = async () => {
  const [entries, settings] = await Promise.all([publishedEntries('cn_update'), siteSettings()]);
  const updates = toCnUpdates(entries);
  return (
    <main className="container space-y-10">
      <header className="max-w-reading space-y-3">
        <h1 className="text-3xl font-bold tablet:text-4xl">
          <Copy id="cn.title" />
        </h1>
        <p className="leading-relaxed text-muted-foreground">
          <Copy id="cn.description" />
        </p>
        {publicPathEnabled(settings, '/seasons') && (
          <Link
            href="/seasons"
            className="inline-block text-sm font-semibold text-brand-link hover:underline"
          >
            <Copy id="cn.archive" />
          </Link>
        )}
      </header>
      {!updates.length && (
        <p className="text-muted-foreground">
          <Copy id="cn.empty" />
        </p>
      )}
      <div className="space-y-12">
        {updates.map((update) => (
          <article
            key={update.id}
            id={update.slug}
            className="scroll-mt-24 space-y-5 border-t pt-8 first:border-t-0 first:pt-0"
          >
            <header className="max-w-reading space-y-2">
              <p className="flex flex-wrap gap-x-3 text-sm text-muted-foreground">
                {update.season && <span className="font-semibold">{update.season}</span>}
                <time dateTime={update.publishedAt}>{formatDate(update.publishedAt)}</time>
              </p>
              <h2 className="text-balance text-2xl font-bold">{update.title}</h2>
              <p className="text-lg leading-relaxed">{update.summary}</p>
              {update.krEta && (
                <p>
                  <span className="font-semibold">
                    <Copy id="cn.eta" />
                  </span>{' '}
                  {update.krEta}
                </p>
              )}
            </header>
            {update.images.length > 0 && (
              <div className="grid grid-cols-1 gap-3 tablet:grid-cols-2 laptop:grid-cols-3">
                {update.images.map((src, index) => (
                  <a key={index} href={src} target="_blank" rel="noreferrer" className="block">
                    <img
                      src={src}
                      alt={update.title + ' ' + (index + 1)}
                      loading={index < 3 ? 'eager' : 'lazy'}
                      width={1200}
                      height={675}
                      className="aspect-video w-full rounded-lg bg-muted object-cover"
                    />
                  </a>
                ))}
              </div>
            )}
            {update.body.length > 0 && (
              <ul className="max-w-reading list-disc space-y-1.5 pl-5 leading-relaxed">
                {update.body.map((line, index) => (
                  <li key={index}>{line}</li>
                ))}
              </ul>
            )}
            {update.sourceUrl && (
              <a
                href={update.sourceUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-sm font-semibold text-brand-link hover:underline"
              >
                <Copy id="cn.source" />
                {update.sourceName && <span>· {update.sourceName}</span>}
                <ExternalLink size={14} />
              </a>
            )}
          </article>
        ))}
      </div>
    </main>
  );
};
export default CnPreviewPage;
