'use client';
import { useState, useTransition } from 'react';
import { saveSettings } from '@/app/admin/actions';
import { settingFields, type SiteSettings, type Media } from '@/src/cms/schema';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { MediaPicker } from './MediaPicker';
const groups = [
  {
    title: '페이지 표시',
    keys: ['postsEnabled', 'videosEnabled', 'seasonsEnabled', 'redeemEnabled'],
  },
  { title: '기본 정보', keys: ['name', 'description', 'logo', 'author', 'authorUrl'] },
  { title: '홈', keys: ['homeTitle', 'homeDescription', 'homeImage', 'homeLink', 'homeLinkLabel'] },
  {
    title: '연락처·푸터',
    keys: ['footerLabel', 'contactLabel', 'contactUrl', 'copyright', 'qrImage', 'qrLabel'],
  },
  { title: '쿠폰 안내', keys: ['redeemGuideUrl', 'redeemGuideImage'] },
  {
    title: '검색·사이트 확인',
    keys: ['ogImage', 'keywords', 'googleVerification', 'naverVerification'],
  },
];

// 관련 항목을 묶은 사이트 설정 입력
export const SettingsForm = ({ initial, media }: { initial: SiteSettings; media: Media[] }) => {
  const [values, setValues] = useState<Record<string, string>>({ ...initial });
  const [message, setMessage] = useState('');
  const [failed, setFailed] = useState(false);
  const [pending, start] = useTransition();
  // 설정 값 변경
  const update = (key: string, value: string) =>
    setValues((previous) => ({ ...previous, [key]: value }));
  return (
    <form
      className="space-y-8"
      onSubmit={(event) => {
        event.preventDefault();
        setMessage('');
        start(async () => {
          try {
            await saveSettings(values);
            setFailed(false);
            setMessage('설정을 저장했습니다.');
          } catch (caught) {
            setFailed(true);
            setMessage(caught instanceof Error ? caught.message : '저장 실패');
          }
        });
      }}
    >
      <header className="cms-panel sticky top-0 z-20 space-y-2 !py-3">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h1 className="text-3xl font-semibold">사이트 설정</h1>
          <Button type="submit" className="cms-button" disabled={pending}>
            {pending ? '저장 중…' : '저장'}
          </Button>
        </div>
        {message && (
          <p
            role={failed ? 'alert' : 'status'}
            className={failed ? 'text-red-600 dark:text-red-400' : 'text-sm'}
          >
            {message}
          </p>
        )}
      </header>
      {groups.map((group) => (
        <section key={group.title} className="space-y-4">
          <h2 className="text-lg font-semibold">{group.title}</h2>
          <div className="cms-panel grid min-w-0 grid-cols-1 gap-6 tablet:grid-cols-2">
            {group.keys
              .map((key) => settingFields.find((field) => field.key === key)!)
              .map((field) => (
                <div
                  key={field.key}
                  className={
                    field.type === 'checkbox'
                      ? 'flex items-center justify-between gap-4'
                      : 'min-w-0 space-y-2'
                  }
                >
                  <Label htmlFor={'setting-' + field.key}>{field.label}</Label>
                  {field.type === 'checkbox' ? (
                    <Checkbox
                      id={'setting-' + field.key}
                      checked={values[field.key] === 'true'}
                      onCheckedChange={(checked) => update(field.key, String(checked === true))}
                    />
                  ) : field.type === 'media' ? (
                    <MediaPicker
                      inputId={'setting-' + field.key}
                      label={field.label}
                      value={values[field.key] ?? ''}
                      media={media}
                      onChange={(value) => update(field.key, value)}
                    />
                  ) : field.type === 'textarea' ? (
                    <Textarea
                      id={'setting-' + field.key}
                      className="cms-input min-h-28"
                      value={values[field.key] ?? ''}
                      onChange={(event) => update(field.key, event.target.value)}
                    />
                  ) : (
                    <Input
                      id={'setting-' + field.key}
                      className="cms-input"
                      value={values[field.key] ?? ''}
                      onChange={(event) => update(field.key, event.target.value)}
                    />
                  )}
                </div>
              ))}
          </div>
        </section>
      ))}
    </form>
  );
};
