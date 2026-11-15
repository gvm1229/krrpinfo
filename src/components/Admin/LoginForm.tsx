'use client';
import { useActionState } from 'react';
import { login } from '@/app/admin/login/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
// 운영자 로그인 입력
export const LoginForm = () => {
  const [message, action, pending] = useActionState(login, '');
  return (
    <form action={action} aria-busy={pending} className="cms-panel w-full space-y-5">
      <label className="cms-label">
        운영자 ID
        <Input className="cms-input" name="username" autoComplete="username" required />
      </label>
      <label className="cms-label">
        비밀번호
        <Input
          className="cms-input"
          name="password"
          type="password"
          autoComplete="current-password"
          required
        />
      </label>
      {message && (
        <p role="alert" className="text-sm text-error-text">
          {message}
        </p>
      )}
      <Button type="submit" className="cms-button w-full" disabled={pending}>
        {pending ? '확인 중…' : '로그인'}
      </Button>
    </form>
  );
};
