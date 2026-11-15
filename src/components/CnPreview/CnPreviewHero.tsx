import Link from 'next/link';
import { Copy } from '@/components/Text/PublicSite';
import { Button } from '@/components/ui/button';
import { formatDate, cn } from '@/src/util/utils';
import type { CnUpdate } from './cn-updates';

// 홈 상단 중국 서버 최신 소식
const CnPreviewHero = ({ update, className }: { update: CnUpdate; className?: string }) => (
  <section
    aria-labelledby="cn-preview-hero-title"
    className={cn(
      'grid grid-cols-1 items-center gap-6 rounded-lg bg-season-4/40 p-5 dark:bg-season-4/10 tablet:grid-cols-2 tablet:p-6',
      className,
    )}
  >
    {update.images[0] && (
      <img
        src={update.images[0]}
        alt=""
        width={1200}
        height={675}
        className="aspect-video w-full rounded-lg bg-muted object-cover"
      />
    )}
    <div className="min-w-0 space-y-4">
      <h1 id="cn-preview-hero-title" className="text-balance text-3xl font-bold">
        <Copy id="cn.title" />
      </h1>
      <div className="space-y-2">
        <h2 className="text-balance text-xl font-bold">{update.title}</h2>
        <p className="flex flex-wrap gap-x-3 text-sm text-muted-foreground">
          {update.season && <span>{update.season}</span>}
          <span>{formatDate(update.publishedAt)}</span>
        </p>
        <p className="leading-relaxed">{update.summary}</p>
        {update.krEta && (
          <p className="text-sm">
            <span className="font-semibold">
              <Copy id="cn.eta" />
            </span>{' '}
            {update.krEta}
          </p>
        )}
      </div>
      <Button
        asChild
        className="whitespace-nowrap rounded-md bg-brand-blue font-semibold text-white hover:bg-brand-blue-hover"
      >
        <Link href={'/cn-preview#' + update.slug}>
          <Copy id="cn.more" />
        </Link>
      </Button>
    </div>
  </section>
);
export default CnPreviewHero;
