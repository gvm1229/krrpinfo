'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import ResponsiveImage from '@/components/Image/ResponsiveImage';
import { Button } from '@/components/ui/button';
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

const formSchema = z.object({
  // npaCode: alphanumerical, exactly 13 characters
  npaCode: z
    .string()
    .min(1, {
      message: '회원 번호 입력은 필수입니다.',
    })
    .regex(/^[a-zA-Z0-9]{13}$/, {
      message: '회원 번호는 13자리의 영문과 숫자로만 이루어져 있습니다.',
    }),
});

// npaCode localStorage key
const NPA_STORAGE_KEY = 'krrpinfo:npaCode';

const RedeemContainer = () => {
  // 저장 여부 state
  const [isSaved, setIsSaved] = React.useState(false);
  // 편집 mode state
  const [isEditing, setIsEditing] = React.useState(false);
  // 마지막 저장 값 backup
  const [savedValue, setSavedValue] = React.useState('');

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      npaCode: '',
    },
  });

  // mount 시 localStorage 복원
  React.useEffect(() => {
    const stored = localStorage.getItem(NPA_STORAGE_KEY);
    if (stored) {
      form.setValue('npaCode', stored);
      setSavedValue(stored);
      setIsSaved(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
  }

  // 저장 처리: validate 후 localStorage 기록 + lock
  async function handleSave() {
    const valid = await form.trigger('npaCode');
    if (!valid) return;
    const value = form.getValues('npaCode');
    localStorage.setItem(NPA_STORAGE_KEY, value);
    setSavedValue(value);
    setIsSaved(true);
    setIsEditing(false);
  }

  // 수정 mode 진입
  function handleEdit() {
    setIsEditing(true);
  }

  // 취소: 직전 저장 값 복원
  function handleCancel() {
    form.setValue('npaCode', savedValue);
    setIsEditing(false);
  }

  // input disabled 조건
  const isInputDisabled = isSaved && !isEditing;

  // 저장/수정/취소 버튼 group render
  const renderActionButtons = () => {
    if (isSaved && !isEditing) {
      return (
        <Button
          type="button"
          onClick={handleEdit}
          className="whitespace-nowrap rounded-md bg-blue-600 px-4 py-2 text-base font-semibold text-white hover:bg-blue-500"
        >
          수정
        </Button>
      );
    }
    if (isSaved && isEditing) {
      return (
        <div className="flex items-center gap-2">
          <Button
            type="button"
            onClick={handleCancel}
            className="whitespace-nowrap rounded-md bg-gray-500 px-4 py-2 text-base font-semibold text-white hover:bg-gray-400"
          >
            취소
          </Button>
          <Button
            type="button"
            onClick={handleSave}
            className="whitespace-nowrap rounded-md bg-blue-600 px-4 py-2 text-base font-semibold text-white hover:bg-blue-500"
          >
            저장
          </Button>
        </div>
      );
    }
    return (
      <Button
        type="button"
        onClick={handleSave}
        className="whitespace-nowrap rounded-md bg-blue-600 px-4 py-2 text-base font-semibold text-white hover:bg-blue-500"
      >
        저장
      </Button>
    );
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="npaCode"
          render={({ field }) => (
            <FormItem className="space-y-4">
              <FormLabel className="text-3xl font-bold">회원 번호</FormLabel>
              <div className="flex flex-col gap-4 tablet:flex-row tablet:items-center">
                <FormControl>
                  <Input
                    placeholder="13자리 회원 번호를 입력해주세요."
                    className="h-fit text-lg"
                    disabled={isInputDisabled}
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-xl font-bold tablet:hidden" />
                <div className="flex tablet:hidden">{renderActionButtons()}</div>
                <Button
                  type="submit"
                  className="bg-blue-600 text-lg font-semibold text-white hover:bg-blue-500 tablet:max-w-48 tablet:py-4"
                >
                  회원 번호 제출
                </Button>
              </div>
              <FormMessage className="hidden text-xl font-bold tablet:block" />
              <div className="hidden tablet:flex">{renderActionButtons()}</div>
              <FormDescription className="pt-4 text-xl font-medium text-primary">
                {
                  '안내: 게임 내 우측 상단의 설정 메뉴 터치 > [계정 관리] 메뉴 선택 후 회원 번호 복사'
                }
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
