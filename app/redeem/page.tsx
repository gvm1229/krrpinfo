import RedeemContainer from '@/components/Nexon/RedeemContainer';
import RedeemCard from '@/components/Redeem/RedeemCard';
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
    <main className="container relative flex flex-col items-center gap-y-12 laptop:gap-y-16">
      <h1 className="text-4xl font-bold laptop:text-5xl">
        쿠폰 리딤
      </h1>
      <div className="flex w-full flex-col gap-8 tablet:grid tablet:grid-cols-2 tablet:gap-16">
        <RedeemContainer />
        <RedeemCard />
      </div>
    </main>
  );
}
