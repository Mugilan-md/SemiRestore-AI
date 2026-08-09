import { createClient } from '@supabase/supabase-js';

const defaultSupabaseUrl = 'https://ukvshxgumrgufrsfsxlj.supabase.co';
const defaultSupabaseAnonKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVrdnNoeGd1bXJndWZyc2ZzeGxqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODYxNzI2MTAsImV4cCI6MjEwMTc0ODYxMH0.5EWXVZ-tTWPD5OXA3Cv_oPvFSChwEXKIwu-LCx-8glc';

const supabaseUrl =
  (import.meta.env.VITE_SUPABASE_URL as string) || defaultSupabaseUrl;
const supabaseAnonKey =
  (import.meta.env.VITE_SUPABASE_ANON_KEY as string) || defaultSupabaseAnonKey;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type SupabaseClient = typeof supabase;
