import { AdminStyleProvider } from '@/components/Admin/AdminStyleProvider';
// 관리자 공통 스타일 제공
const Layout = ({ children }: { children: React.ReactNode }) => (
  <AdminStyleProvider>{children}</AdminStyleProvider>
);
export default Layout;
