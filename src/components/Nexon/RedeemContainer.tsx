'use client';

import { zodResolver } from '@hookform/resolvers/zod';
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
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      npaCode: '',
      // couponCode: '',
    },
  });

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
              <FormLabel className="text-3xl font-bold">회원 번호</FormLabel>
              <FormControl className="py-4">
                <Input
                  placeholder="13자리 회원 번호를 입력해주세요."
                  className="h-fit px-5 py-4 text-lg"
                  {...field}
                />
              </FormControl>
              <FormMessage className="text-xl font-bold" />
              {/* remember checkbox */}
              <div className="flex items-center space-x-2">
                <Checkbox id="terms" />
                <Label
                  htmlFor="terms"
                  className="text-lg"
                >
                  회원번호 기억하기
                </Label>
              </div>
              <FormDescription className="text-xl font-medium text-primary">
                {'회원 번호 안내: 우측 설정 메뉴 터치 > [계정 관리] 메뉴 선택 후 회원 번호'}
              </FormDescription>
              <ResponsiveImage
                src="/assets/images/links/npaCodeStepsKr.webp"
                gridNums={[1, 1, 1]}
              />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          className="w-full bg-blue-600 text-lg font-semibold text-white hover:bg-blue-500"
        >
          회원 번호 제출
        </Button>
      </form>
    </Form>
  );
};

export default RedeemContainer;
