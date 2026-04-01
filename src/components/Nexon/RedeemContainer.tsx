'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import ResponsiveImage from '@/components/Image/ResponsiveImage';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { CheckedState } from '@radix-ui/react-checkbox';

const formSchema = z.object({
  // npaCode: alphanumerical, exactly 13 characters
  npaCode: z.string().min(1, {
    message: '회원 번호 입력은 필수입니다.',
  }).regex(/^[a-zA-Z0-9]{13}$/, {
    message: '회원 번호는 13자리의 영문과 숫자로만 이루어져 있습니다.',
  }),
  // coupon: korean & numeric, no characters limit
  // couponCode: z.string().min(1, {
  //   message: '쿠폰 코드 입력은 필수입니다.',
  // }).regex(/^[\u1100-\u11FF\uAC00-\uD7AF0-9]+$/, {
  //   message: '쿠폰 코드는 한글과 숫자로만 이루어져 있습니다.',
  // }),
});

const RedeemContainer = () => {
  // const [isRemember, setIsRemember] = React.useState<CheckedState>('indeterminate');
  const [isRemember, setIsRemember] = React.useState<CheckedState>(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      npaCode: '',
      // couponCode: '',
    },
  });

  // function handleCheckboxToggle() {
  //   setIsRemember((prevIsRemember) => (prevIsRemember === 'indeterminate' ? false : 'indeterminate'));
  // }

  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="npaCode"
          render={({ field }) => (
            <FormItem className="space-y-4">
              <FormLabel className="text-3xl font-bold">
                회원 번호
              </FormLabel>
              <div className="flex flex-col gap-4 tablet:flex-row tablet:items-center">
                <FormControl>
                  <Input
                    placeholder="13자리 회원 번호를 입력해주세요."
                    className="h-fit text-lg"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-xl font-bold tablet:hidden" />
                <div className="flex items-center space-x-2 tablet:hidden">
                  <Checkbox
                    id="terms"
                    checked={isRemember}
                    // onCheckedChange={handleCheckboxToggle}
                    onCheckedChange={setIsRemember}
                  />
                  <Label
                    htmlFor="terms"
                    className="text-lg"
                  >
                    회원번호 기억하기
                  </Label>
                </div>
                <Button
                  type="submit"
                  className="bg-blue-600 text-lg font-semibold text-white hover:bg-blue-500 tablet:max-w-48 tablet:py-4"
                >
                  회원 번호 제출
                </Button>
              </div>
              <FormMessage className="hidden text-xl font-bold tablet:block" />
              {/* remember checkbox */}
              <div className="hidden items-center space-x-2 tablet:flex">
                <Checkbox
                  id="terms"
                  checked={isRemember}
                  // onCheckedChange={handleCheckboxToggle}
                  onCheckedChange={setIsRemember}
                />
                <Label
                  htmlFor="terms"
                  className="text-lg"
                >
                  회원번호 기억하기
                </Label>
              </div>
              <FormDescription className="pt-4 text-xl font-medium text-primary">
                {'안내: 게임 내 우측 상단의 설정 메뉴 터치 > [계정 관리] 메뉴 선택 후 회원 번호 복사'}
              </FormDescription>
              <Link
                href="/posts/redeem-how-to"
                className="text-xl font-medium text-blue-600 underline"
              >
                방법 더 자세히 알아보기
              </Link>
              <ResponsiveImage
                src="/assets/images/links/npaCodeStepsKr.webp"
                gridNums={[1, 2, 3]}
              />
            </FormItem>
          )}
        />

      </form>
    </Form>
  );
};

export default RedeemContainer;
