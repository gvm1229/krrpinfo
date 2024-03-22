import { MessageCircle } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import ViewCounter from '@/components//View/ViewCounter';
import { buttonVariants } from '@/components/ui/button';
import qrc from '@/public/assets/images/qrcode/qrc-xl-c.png';
import { cn } from '@/src/util/utils';

export function SiteFooter({
  className,
  totalViews,
}: {
  className?: string;
  totalViews: number;
}) {
  return (
    <footer
      id="footer"
      className={cn('border-t bg-background py-4 tablet:py-8', className)}
    >
      <div className="container flex flex-col items-start space-y-2 tablet:flex-row tablet:items-center tablet:justify-between desktop:space-y-0">
        <div className="space-y-2 desktop:space-y-4">
          {/* contact */}
          <div className="flex flex-col gap-2 tablet:flex-row tablet:items-center">
            <p className="text-left leading-loose tablet:text-left tablet:text-lg">
              오류 신고 및 문의 :
            </p>
            <Link
              href="https://open.kakao.com/me/Megiii"
              className={cn(
                buttonVariants(),
                'flex gap-3 bg-yellow-300 font-bold hover:bg-yellow-200',
              )}
            >
              <MessageCircle fill="black" />
              카카오톡 오픈프로필 (Megiii)
            </Link>
          </div>
          {/* qr code & visitor count */}
          <div className="flex flex-col items-start justify-center gap-2 desktop:hidden">
            <div className="flex items-center gap-2">
              <p className="font-medium tablet:text-lg">공유용 QR 코드:</p>
              <div className="size-10 tablet:size-12">
                <Image src={qrc} alt="QR Code" />
              </div>
            </div>
            <ViewCounter view={totalViews} />
          </div>
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
        <div className="hidden flex-col items-start justify-center gap-2 desktop:flex desktop:flex-col desktop:items-end desktop:justify-end desktop:gap-2">
          {/* qr code */}
          <div className="flex items-center gap-2">
            <p className="font-medium desktop:text-lg">공유용 QR 코드:</p>
            <div className="size-10 desktop:size-12">
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
