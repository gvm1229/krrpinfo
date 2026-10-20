'use client';
import { useState, useTransition } from 'react';
import { saveSettings } from '@/app/admin/actions';
import { settingFields, type SiteSettings, type Media } from '@/src/cms/schema';
import { MediaPicker } from './MediaPicker';

// 사이트 공통 설정 입력
export const SettingsForm = ({ initial, media }: { initial: SiteSettings; media: Media[] }) => {
  const [values, setValues] = useState<Record<string, string>>({ ...initial });
  const [message, setMessage] = useState('');
  const [pending, start] = useTransition();
  return (
    <form
      className="space-y-6"
      onSubmit={(event) => {
        event.preventDefault();
        start(async () => {
          try {
            await saveSettings(values);
            setMessage('설정을 저장했습니다.');
          } catch (caught) {
            setMessage(caught instanceof Error ? caught.message : '저장 실패');
          }
        });
      }}
    >
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold">사이트 설정</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            이름·홈 소개·연락처·검색 정보를 관리합니다.
          </p>
        </div>
        <button className="cms-button" disabled={pending}>
          {pending ? '저장 중…' : '저장'}
        </button>
      </header>
      {message && <p role="status">{message}</p>}
      <div className="cms-panel grid gap-6 tablet:grid-cols-2">
        {settingFields.map((field) => (
          <div key={field.key} className="cms-label">
            {field.label}
            {field.type === 'checkbox' ? (
              <input
                aria-label={field.label}
                type="checkbox"
                checked={values[field.key] === 'true'}
                onChange={(event) =>
                  setValues((previous) => ({
                    ...previous,
                    [field.key]: String(event.target.checked),
                  }))
                }
              />
            ) : field.type === 'media' ? (
              <MediaPicker
                value={values[field.key] ?? ''}
                media={media}
                onChange={(value) => setValues((previous) => ({ ...previous, [field.key]: value }))}
              />
            ) : field.type === 'textarea' ? (
              <textarea
                aria-label={field.label}
                className="cms-input min-h-28"
                value={values[field.key] ?? ''}
                onChange={(event) =>
                  setValues((previous) => ({ ...previous, [field.key]: event.target.value }))
                }
              />
            ) : (
              <input
                aria-label={field.label}
                className="cms-input"
                value={values[field.key] ?? ''}
                onChange={(event) =>
                  setValues((previous) => ({ ...previous, [field.key]: event.target.value }))
                }
              />
            )}
          </div>
        ))}
      </div>
    </form>
  );
};
