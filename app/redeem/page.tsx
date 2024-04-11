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
    <main className="container flex h-full flex-col items-center">
      <div className="mx-auto w-full max-w-5xl space-y-8">
        <RedeemCard />
        <RedeemContainer />
      </div>
    </main>
  );
}
