import RedeemContainer from '@/components/Nexon/RedeemContainer';
import { siteConfig } from '@/config/site';

export const metadata = {
  title: '쿠폰 리딤',
  metadataBase: new URL(`${siteConfig.url}/redeem`),
  alternates: {
    canonical: '/',
    languages: {
      'ko-KR': '/ko-KR',
      // 'en-US': '/en-US',
    },
  },
};

export default async function RedeemRootPage() {
  return (
    <main className="container flex h-full flex-col items-center p-8 tablet:py-12">
      <div className="mx-auto w-full max-w-5xl">
        <RedeemContainer />
      </div>
    </main>
  );
}
