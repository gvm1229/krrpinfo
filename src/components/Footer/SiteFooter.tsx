import Image from 'next/image';
import ViewCounter from '@/components//View/ViewCounter';
import qrc from '@/public/assets/images/qrc/qrc-xl-c.png';
import { cn } from '@/src/util/utils';

export function SiteFooter({
  className,
  totalViews,
}) {
  return (
    <footer
      id="footer"
      className={cn(className)}
    >
      <div
        className="flex items-center justify-between py-8 mobile_only:container tablet_only:container desktop:px-8"
      >
        <div
          className="flex flex-col items-start justify-between gap-4"
        >
          {/* contact */}
          <p className="text-center text-sm leading-loose tablet:text-left tablet:text-lg">
            오류 신고 및 문의 :
            {' '}
            <a
              href="/"
              target="_blank"
              rel="noreferrer"
              className="font-bold underline underline-offset-4 hover:text-yellow-400"
            >
              카카오톡 오픈채팅방
            </a>
            .
          </p>
          {/* copyright */}
          <p className="text-center text-sm leading-loose tablet:text-left tablet:text-base">
            {`© ${new Date().getFullYear()} `}
            <a
              href="https://github.com/gvm1229"
              target="_blank"
              rel="noreferrer"
              className="font-bold underline underline-offset-4"
            >
              Megi
            </a>
            . All rights reserved.
          </p>
        </div>
        <div className="flex flex-col items-end justify-end gap-2">
          <ViewCounter view={totalViews} />
          {/* qr code */}
          <div className="flex items-center gap-2">
            <p className="text-lg font-medium">
              공유용 QR 코드:
            </p>
            <div className="size-12">
              <Image
                src={qrc}
                alt="QR Code"
              />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
