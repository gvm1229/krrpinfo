import Image from 'next/image';
import ViewCounter from '@/components//View/ViewCounter';
import qrc from '@/public/assets/images/qrcode/qrc-xl-c.png';
import { cn } from '@/src/util/utils';

export function SiteFooter({ className, totalViews }) {
  return (
    <footer
      id="footer"
      className={cn(
        'py-4 mobile_only:container tablet_only:container tablet:py-8 desktop:px-8',
        className,
      )}
    >
      <div className="flex flex-col items-center mobile_only:space-y-4 tablet:flex-row tablet:justify-between">
        <div className="flex flex-col items-center justify-between tablet:items-start tablet:gap-6">
          {/* contact */}
          <p className="text-center leading-loose tablet:text-left tablet:text-lg">
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
          <p className="hidden text-left leading-loose tablet:block">
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
        <div className="flex items-center justify-center gap-2 tablet:flex-col tablet:items-end tablet:justify-end tablet:gap-2">
          {/* qr code */}
          <div className="flex items-center gap-2 tablet:mt-0">
            <p className="font-medium tablet:text-lg">공유용 QR 코드:</p>
            <div className="size-10 tablet:size-12">
              <Image src={qrc} alt="QR Code" />
            </div>
          </div>
          <ViewCounter view={totalViews} />
        </div>
        {/* copyright */}
        <p className="text-text-center block leading-loose tablet:hidden">
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
    </footer>
  );
}
