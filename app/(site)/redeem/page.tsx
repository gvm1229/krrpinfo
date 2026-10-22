import { notFound as disabledPage } from 'next/navigation';
import { siteSettings as pageSettings } from '@/src/cms/repository';
import RedeemContainer from '@/components/Nexon/RedeemContainer';
import RedeemCard from '@/components/Redeem/RedeemCard';
import { Copy } from '@/components/Text/PublicSite';
import { publicCopy } from '@/src/cms/repository';
// 쿠폰 목록 메타데이터
export const generateMetadata = async () => {
  if ((await pageSettings()).redeemEnabled !== 'true') return {};
  return { title: (await publicCopy())['redeem.title'], alternates: { canonical: '/redeem' } };
};
// 기존 쿠폰 사용 기능과 CMS 쿠폰 목록 연결
const RedeemPage = async () => {
  if ((await pageSettings()).redeemEnabled !== 'true') disabledPage();
  return (
    <main className="container space-y-8">
      <h1 className="text-3xl font-bold tablet:text-4xl">
        <Copy id="redeem.title" />
      </h1>
      <div className="grid grid-cols-1 items-start gap-10 laptop:grid-cols-2">
        <RedeemContainer />
        <RedeemCard />
      </div>
    </main>
  );
};
export default RedeemPage;
