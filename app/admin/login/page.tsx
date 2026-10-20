import { auth } from '@/src/auth';
import { isOwner } from '@/src/cms/owner';
import { redirect } from 'next/navigation';
import { LoginForm } from '@/components/Admin/LoginForm';
import '@/src/styles/admin.css';
export const metadata = { title: '운영자 로그인', robots: { index: false, follow: false } };
// 비공개 운영자 로그인 화면
const LoginPage = async () => {
  if (isOwner(await auth())) redirect('/admin');
  return (
    <main className="cms-shell min-h-svh items-center justify-center">
      <div className="w-full max-w-sm space-y-6 p-5">
        <h1 className="text-2xl font-semibold">콘텐츠 관리</h1>
        <LoginForm />
      </div>
    </main>
  );
};
export default LoginPage;
