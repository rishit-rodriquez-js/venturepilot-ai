import { createBrowserClient } from '@supabase/ssr';

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ktsoovjdgatjonaoawql.supabase.co';
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_eRVIDDDw4B3xQnyh3MBgeg_VHgCbYE8';

  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}
