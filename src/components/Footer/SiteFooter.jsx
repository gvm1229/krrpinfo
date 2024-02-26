import { cn } from '@/src/util/utils';

export function SiteFooter({ className }) {
  return (
    <footer
      id="footer"
      className={cn(className)}
    >
      <div
        className="flex flex-col items-center justify-between gap-4 mobile:container tablet_only:container mobile:py-4 tablet:h-24 tablet:flex-row desktop:px-8"
      >
        {/* <div className="flex flex-col items-center gap-4 px-8 tablet:flex-row tablet:gap-2 tablet:px-0"> */}
        {/* </div> */}
        <p className="text-center text-sm leading-loose tablet:text-left">
          Built by
          {' '}
          <a
            href="https://github.com/gvm1229"
            target="_blank"
            rel="noreferrer"
            className="font-medium underline underline-offset-4"
          >
            Megi
          </a>
          . Any inquiries welcome at
          {' '}
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="font-medium underline underline-offset-4"
          >
            KakaoTalk
          </a>
          .
        </p>
        <p className="flex size-12 items-center justify-center rounded-lg bg-blue-600 text-sm text-white">QR</p>
      </div>
    </footer>
  );
}
