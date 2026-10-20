'use client';
import { useActionState } from 'react';
import { login } from '@/app/admin/login/actions';
// 운영자 로그인 입력
export const LoginForm = () => {
  const [message, action, pending] = useActionState(login, '');
  return (
    <form action={action} className="cms-panel w-full space-y-5">
      <label className="cms-label">
        운영자 ID
        <input className="cms-input" name="username" autoComplete="username" required />
      </label>
      <label className="cms-label">
        비밀번호
        <input
          className="cms-input"
          name="password"
          type="password"
          autoComplete="current-password"
          required
        />
      </label>
      {message && (
        <p role="alert" className="text-sm text-red-600">
          {message}
        </p>
      )}
      <button className="cms-button w-full" disabled={pending}>
        {pending ? '확인 중…' : '로그인'}
      </button>
    </form>
  );
};
