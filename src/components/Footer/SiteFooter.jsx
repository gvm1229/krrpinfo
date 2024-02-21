import { ModeToggle } from '@/src/components/DarkMode/theme-toggle';
import { cn } from '@/src/util/utils';

export function SiteFooter({ className }) {
  return (
    <footer
      id="footer"
      className={cn(className)}
    >
      <div className="container flex flex-col items-center justify-between gap-4 py-10 md:h-24 md:flex-row md:py-0">
        <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
          <p className="text-center text-sm leading-loose md:text-left">
            Built by
            {' '}
            <a
              href="https://github.com/gvm1229"
              target="_blank"
              rel="noreferrer"
              className="font-medium underline underline-offset-4"
            >
              Tom Jeong (Megi)
            </a>
            .
            {/* Any inquiries welcome at */}
            {/* {' '} */}
            {/* <a */}
            {/*  href="/" */}
            {/*  target="_blank" */}
            {/*  rel="noreferrer" */}
            {/*  className="font-medium underline underline-offset-4" */}
            {/* > */}
            {/*  KakaoTalk */}
            {/* </a> */}
            {/* . */}
          </p>
        </div>
        <ModeToggle />
      </div>
    </footer>
  );
}
