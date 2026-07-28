import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://eRVIDDDw4B3xQnyh3MBgeg.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_eRVIDDDw4B3xQnyh3MBgeg_VHgCbYE8';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
