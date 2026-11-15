import { randomBytes, scryptSync, timingSafeEqual } from 'node:crypto';

// 단일 운영자 비밀번호 해시 생성
export const hashPassword = (password: string): string => {
  if (password.length < 12) throw new Error('비밀번호는 12자 이상 필요');
  const salt = randomBytes(16).toString('hex');
  return ['scrypt', salt, scryptSync(password, salt, 64).toString('hex')].join(':');
};
// 저장된 해시와 비밀번호 비교
export const verifyPassword = (password: string, stored: string): boolean => {
  const [algorithm, salt, encoded] = stored.split(':');
  if (
    algorithm !== 'scrypt' ||
    !/^[a-f0-9]{32}$/.test(salt ?? '') ||
    !/^[a-f0-9]{128}$/.test(encoded ?? '') ||
    password.length > 1024
  )
    return false;
  return timingSafeEqual(scryptSync(password, salt, 64), Buffer.from(encoded, 'hex'));
};
