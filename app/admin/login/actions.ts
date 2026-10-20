'use server';
import { signIn } from '@/src/auth';
import { AuthError } from 'next-auth';
// 단일 운영자 로그인
export const login = async (_previous: string, form: FormData): Promise<string> => {
  try {
    await signIn('credentials', {
      username: String(form.get('username') ?? ''),
      password: String(form.get('password') ?? ''),
      redirectTo: '/admin',
    });
    return '';
  } catch (error) {
    if (error instanceof AuthError) return '로그인 정보를 확인해 주세요.';
    throw error;
  }
};
