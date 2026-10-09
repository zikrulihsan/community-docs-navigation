import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import type { Database } from './database.types';

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const publishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string | undefined;

export const hasSupabase = Boolean(url && publishableKey);

let browserClient: SupabaseClient<Database> | null = null;

/**
 * Client untuk browser: sesi disimpan di localStorage dan kode OAuth
 * di URL otomatis ditukar jadi sesi (PKCE).
 */
export function supabase() {
  if (!url || !publishableKey) {
    throw new Error('Supabase belum dikonfigurasi. Isi VITE_SUPABASE_URL dan VITE_SUPABASE_PUBLISHABLE_KEY.');
  }
  browserClient ??= createClient<Database>(url, publishableKey, {
    auth: { flowType: 'pkce', persistSession: true, autoRefreshToken: true, detectSessionInUrl: true },
  });
  return browserClient;
}

/** Client tanpa sesi untuk loader saat build/prerender. */
export function anonSupabase() {
  if (!url || !publishableKey) return null;
  return createClient<Database>(url, publishableKey, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
  });
}
