import {
  RotateCw, Gift,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/src/util/utils';

export default function Component({
  className,
}: {
  className?: string
}) {
  // expire time in YY/MM/DD HH:MM:SS
  const data = [
    {
      title: 'RRReward 1',
      code: 'DAKTDBWZTYR',
      expireTime: '2024-05-10T23:59:59',
    },
    {
      title: 'RRReward 2',
      code: 'AT3DSWTYBKD',
      expireTime: '2024-05-11T23:59:59',
    },
    {
      title: 'RRReward 3',
      code: '5TKAUAWAGBJR',
      expireTime: '2024-05-12T23:59:59',
    },
  ];

  const calculateTimeToExpire = (expireTime: string) => {
    const now = new Date();
    const expire = new Date(expireTime);
    const diff = expire.getTime() - now.getTime();

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    // format expireTime into YY/MM/DD format without the time
    const formattedTime = `${expire.getFullYear()}/${expire.getMonth() + 1}/${expire.getDate()}`;

    return `${days}일 ${hours}시 ${minutes}분 ${seconds}초 후 코드 만료 (~${formattedTime})`;
  };

  return (
    <div className={cn('relative rounded-lg bg-zinc-100 p-4 dark:bg-zinc-800', className)}>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-bold">쿠폰 코드</h2>
        <button
          className="text-zinc-600 dark:text-zinc-400"
        >
          <RotateCw className="text-zinc-600 dark:text-zinc-400" />
        </button>
      </div>
      <div className="space-y-4">
        {data.filter(({ expireTime }) => new Date(expireTime) > new Date()).map(({ title, code, expireTime }) => (
          <>
            <p
              className="mb-4 rounded-t-md text-base font-medium"
              suppressHydrationWarning
            >
              {calculateTimeToExpire(expireTime)}
            </p>
            <div className="flex flex-col rounded-md bg-zinc-200 dark:bg-zinc-700">
              <div className="flex items-center justify-between p-3">
                <div className="flex flex-col gap-y-2">
                  <div className="flex items-center space-x-2">
                    <Gift className="text-blue-500 dark:text-blue-400" />
                    <span className="text-blue-500 dark:text-blue-400">{title}</span>
                  </div>
                  <p className="text-left text-base font-bold">{code}</p>
                </div>
                <Button className="bg-blue-600 text-base text-white hover:bg-blue-500">
                  리딤
                </Button>
              </div>
            </div>
          </>
        ))}
      </div>
    </div>
  );
}
