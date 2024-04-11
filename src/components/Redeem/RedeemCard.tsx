import {
  Settings, Gift,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/src/util/utils';

export default function Component({
  className,
}: {
  className?: string
}) {
  const data = [
    {
      title: 'RRReward 1',
      code: 'DAKTDBWZTYR',
    },
    {
      title: 'RRReward 2',
      code: 'AT3DSWTYBKD',
    },
    {
      title: 'RRReward 3',
      code: '5TKAUAWAGBJR',
    },
  ];

  return (
    <div className={cn('relative rounded-lg bg-[#2c2c3e] p-4 text-white', className)}>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold">쿠폰 코드</h2>
        <Settings className="text-gray-400" />
      </div>
      <p
        className="mb-4 text-base"
        suppressHydrationWarning
      >
        12시 30분 00초 후 코드 만료 (~ 4/1)
      </p>
      <div className="space-y-3">
        {data.map(({ title, code }) => (
          <div
            key={code}
            className="flex items-center justify-between rounded-md bg-[#1f1f2e] p-3"
          >
            <div className="flex flex-col gap-y-2">
              <div className="flex items-center space-x-2">
                <Gift className="text-purple-400" />
                <span className="text-purple-400">{title}</span>
              </div>
              <p className="text-left text-base font-bold">{code}</p>
            </div>
            <Button className="bg-blue-600 text-base text-primary hover:bg-blue-500">
              리딤
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
