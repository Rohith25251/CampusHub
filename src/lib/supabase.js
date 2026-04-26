import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase URL and Anon Key must be provided in .env file');
}

if (supabaseAnonKey && !supabaseAnonKey.startsWith('eyJ')) {
  console.warn('CRITICAL: Your VITE_SUPABASE_ANON_KEY does not look like a valid Supabase key. It should be a very long string starting with "eyJ". Please check your Supabase Project Settings > API.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

