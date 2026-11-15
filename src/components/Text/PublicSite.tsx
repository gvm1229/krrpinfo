'use client';
import { createContext, useContext } from 'react';
import type { SiteSettings, Entry } from '@/src/cms/schema';
type PublicSite = { settings: SiteSettings; navigation: Entry[]; copy: Record<string, string> };
const Context = createContext<PublicSite | null>(null);
// 공개 설정과 문구 공유
export const PublicSiteProvider = ({
  value,
  children,
}: {
  value: PublicSite;
  children: React.ReactNode;
}) => <Context.Provider value={value}>{children}</Context.Provider>;
// 공개 설정 접근
export const usePublicSite = () => {
  const value = useContext(Context);
  if (!value) throw new Error('공개 사이트 설정 필요');
  return value;
};
// 공개 문구 조회
export const useCopy = () => {
  const { copy } = usePublicSite();
  return (id: string, values: Record<string, string | number> = {}) =>
    (copy[id] ?? '').replace(/\{(\w+)\}/g, (_match, key: string) => String(values[key] ?? ''));
};
// 서버와 클라이언트 화면의 문구 표시
export const Copy = ({ id }: { id: string }) => {
  const t = useCopy();
  return <>{t(id)}</>;
};
