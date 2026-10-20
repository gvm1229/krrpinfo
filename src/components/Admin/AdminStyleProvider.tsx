'use client';
import { useState } from 'react';
import { useServerInsertedHTML } from 'next/navigation';
import styled, { ServerStyleSheet, StyleSheetManager, ThemeProvider } from 'styled-components';
const colors = {
  primary600: '#4945ff',
  neutral0: '#ffffff',
  neutral100: '#f6f6f9',
  neutral800: '#32324d',
};
declare module 'styled-components' {
  export interface DefaultTheme {
    colors: typeof colors;
  }
}
const Frame = styled.div`
  --cms-primary: ${({ theme }) => theme.colors.primary600};
  --cms-admin-surface: ${({ theme }) => theme.colors.neutral0};
  --cms-admin-background: ${({ theme }) => theme.colors.neutral100};
  --cms-admin-text: ${({ theme }) => theme.colors.neutral800};
`;
// Strapi 방식 관리자 색상과 서버 스타일 수집
export const AdminStyleProvider = ({ children }: { children: React.ReactNode }) => {
  const [sheet] = useState(() => new ServerStyleSheet());
  useServerInsertedHTML(() => {
    const styles = sheet.getStyleElement();
    sheet.instance.clearTag();
    return <>{styles}</>;
  });
  const content = (
    <ThemeProvider theme={{ colors }}>
      <Frame>{children}</Frame>
    </ThemeProvider>
  );
  return typeof window !== 'undefined' ? (
    content
  ) : (
    <StyleSheetManager sheet={sheet.instance}>{content}</StyleSheetManager>
  );
};
