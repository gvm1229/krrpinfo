import { MessageCircle } from 'lucide-react';
import { siteSettings } from '@/src/cms/repository';
import { cn } from '@/src/util/utils';
// CMS 연락처와 푸터 표시
export const SiteFooter = async ({ className }: { className?: string }) => {
  const settings = await siteSettings();
  return (
    <footer className={cn('border-t bg-background py-5 tablet:py-8', className)}>
      <div className="container flex flex-wrap items-center justify-between gap-6">
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <p>{settings.footerLabel}</p>
            {settings.contactUrl && (
              <a
                href={settings.contactUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 whitespace-nowrap rounded-md bg-brand-blue px-4 py-2 font-semibold text-white"
              >
                <MessageCircle size={20} />
                {settings.contactLabel}
              </a>
            )}
          </div>
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()}{' '}
            <a href={settings.authorUrl} className="font-semibold underline">
              {settings.author}
            </a>{' '}
            {settings.copyright}
          </p>
        </div>
        {settings.qrImage && (
          <div className="flex items-center gap-3">
            <span>{settings.qrLabel}</span>
            <img src={settings.qrImage} width={48} height={48} alt={settings.qrLabel} />
          </div>
        )}
      </div>
    </footer>
  );
};
