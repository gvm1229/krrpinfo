'use client';
import { Copy, useCopy, usePublicSite } from '@/components/Text/PublicSite';
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
// 공개 문구를 사용하는 회원 번호 검사
const createFormSchema = (required: string, format: string) =>
  z.object({
    // npaCode: alphanumerical, exactly 13 characters
    npaCode: z
      .string()
      .min(1, {
        message: required,
      })
      .regex(/^[a-zA-Z0-9]{13}$/, {
        message: format,
      }),
  });
// npaCode localStorage key
const NPA_STORAGE_KEY = 'krrpinfo:npaCode';
const RedeemContainer = () => {
  const t = useCopy();
  const { settings } = usePublicSite();
  const formSchema = createFormSchema(t('redeem.required'), t('redeem.invalid'));
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
          <Copy id="copy.3537f0cc3ec9" />
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
            <Copy id="copy.be876433993a" />
          </Button>
          <Button
            type="button"
            onClick={handleSave}
            className="whitespace-nowrap rounded-md bg-blue-600 px-4 py-2 text-base font-semibold text-white hover:bg-blue-500"
          >
            <Copy id="copy.5fb926229090" />
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
        <Copy id="copy.5fb926229090" />
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
              <FormLabel className="text-3xl font-bold">
                <Copy id="copy.3a4f5ecae1ce" />
              </FormLabel>
              <div className="flex flex-col gap-4 tablet:flex-row tablet:items-center">
                <FormControl>
                  <Input
                    placeholder={t('redeem.placeholder')}
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
                  <Copy id="copy.97699658e759" />
                </Button>
              </div>
              <FormMessage className="hidden text-xl font-bold tablet:block" />
              <div className="hidden tablet:flex">{renderActionButtons()}</div>
              <FormDescription className="pt-4 text-xl font-medium text-primary">
                <Copy id="copy.a0b6373186c6" />
              </FormDescription>
              <Link
                href={settings.redeemGuideUrl}
                className="text-xl font-medium text-blue-600 underline"
              >
                <Copy id="copy.b4c7f2bf0334" />
              </Link>
              <ResponsiveImage src={settings.redeemGuideImage} gridNums={[1, 2, 3]} />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
};
export default RedeemContainer;
