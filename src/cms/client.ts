import 'server-only';
import { createClient } from '@supabase/supabase-js';

// 서버 내부 Supabase 연결
export const database = () => {
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SECRET_KEY)
    throw new Error('Supabase 연결 설정 필요');
  return createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SECRET_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
};
