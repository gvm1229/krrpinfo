import { createInterface } from 'node:readline/promises';
import { hashPassword } from '../../src/cms/password';
// 운영자 비밀번호를 해시로 변환
const main = async () => {
  const prompt = createInterface({ input: process.stdin, output: process.stdout });
  try {
    const password = await prompt.question('운영자 비밀번호 입력 · 12자 이상: ');
    console.log('AUTH_PASSWORD_HASH=' + hashPassword(password));
  } finally {
    prompt.close();
  }
};
main().catch((error) => {
  console.error(
    '[password::main] ' + (error instanceof Error ? error.message : '비밀번호 설정 실패'),
  );
  process.exitCode = 1;
});
