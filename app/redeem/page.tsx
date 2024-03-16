import RedeemContainer from '@/components/Nexon/RedeemContainer';

export const metadata = {
  title: '쿠폰 리딤',
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
