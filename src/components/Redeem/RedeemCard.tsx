import { Gift } from 'lucide-react';
import { publishedEntries } from '@/src/cms/repository';
import { text } from '@/src/cms/schema';
import { Copy } from '@/components/Text/PublicSite';
import { formatDate, cn } from '@/src/util/utils';
// CMS의 사용 가능한 쿠폰 표시
const RedeemCard = async ({ className }: { className?: string }) => {
  const coupons = (await publishedEntries('coupon')).filter(
    (coupon) => new Date(text(coupon, 'expiresAt')).getTime() > Date.now(),
  );
  return (
    <section className={cn('space-y-5 rounded-lg bg-muted p-5', className)}>
      <h2 className="text-xl font-bold">
        <Copy id="redeem.codes" />
      </h2>
      {coupons.map((coupon) => (
        <div key={coupon.id} className="space-y-3 rounded-lg bg-background p-4">
          <div className="flex gap-2 text-brand-blue">
            <Gift size={20} />
            {coupon.title}
          </div>
          <p className="font-semibold">{text(coupon, 'code')}</p>
          <p className="text-sm text-muted-foreground">{formatDate(text(coupon, 'expiresAt'))}</p>
        </div>
      ))}
      {!coupons.length && (
        <p>
          <Copy id="redeem.empty" />
        </p>
      )}
    </section>
  );
};
export default RedeemCard;
