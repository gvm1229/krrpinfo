'use client';

import { Home } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { siteConfig } from '@/config/site';

export const metadata = {
  title: '404 찾을 수 없음',
};

export default function NotFound() {
  const router = useRouter();

  return (
    <>
      <title>{`404 찾을 수 없음 | ${siteConfig.name}`}</title>
      <div className="absolute inset-0 mx-8 flex items-center justify-center">
        <Card className="flex h-72 w-full flex-col items-center justify-center tablet:h-80 tablet:max-w-xl desktop:h-96 desktop:max-w-3xl">
          <CardHeader className="space-y-2 text-center tablet:space-y-4">
            <CardTitle className="text-4xl tablet:text-6xl desktop:text-7xl">
              404
            </CardTitle>
            <h1 className="text-2xl font-medium tracking-tight tablet:text-3xl desktop:text-4xl">
              페이지를 찾을 수 없음
            </h1>
            <CardDescription className="pt-2 text-base tablet:text-xl desktop:text-2xl">
              잘못된 주소가 입력되었거나,
              {' '}
              <br className="inline tablet:hidden" />
              존재하지 않는 페이지입니다.
            </CardDescription>
          </CardHeader>
          <CardFooter className="flex justify-center">
            <Button
              onClick={() => {
                router.push('/');
                router.refresh();
              }}
              className="flex items-center gap-3 text-lg tablet:h-[3.25rem] tablet:text-xl"
            >
              <Home className="size-4 tablet:size-6" />
              홈 화면으로 돌아가기
            </Button>
          </CardFooter>
        </Card>
      </div>
    </>
  );
}
