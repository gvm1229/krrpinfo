// Supabase 서버 클라이언트
import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
const service = process.env.SUPABASE_SERVICE_ROLE_KEY ?? '';

export const serverClient: SupabaseClient | null =
  url && service ? createClient(url, service) : null;
