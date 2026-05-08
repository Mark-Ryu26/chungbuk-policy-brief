import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// service role key는 브라우저에 넣으면 안 됩니다.
// 이 앱은 공개 anon key와 Supabase RLS 정책만 사용합니다.
export const supabase =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;

export function requireSupabase() {
  if (!supabase) {
    throw new Error(".env에 Supabase URL과 anon key를 입력해 주세요.");
  }
  return supabase;
}
