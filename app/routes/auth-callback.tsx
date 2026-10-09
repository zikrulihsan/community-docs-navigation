import { redirect } from 'react-router';
import type { Route } from './+types/auth-callback';
import { safeNext } from '~/lib/auth';
import { hasSupabase, supabase } from '~/lib/supabase';

/**
 * Tujuan redirect OAuth Google (alur cadangan, lihat GoogleSignIn). Client Supabase menukar ?code= jadi sesi
 * secara otomatis (detectSessionInUrl), di sini kita tinggal menunggu hasilnya.
 */
export async function clientLoader({ request }: Route.ClientLoaderArgs) {
  const url = new URL(request.url);
  const next = safeNext(url.searchParams.get('next'));
  if (!hasSupabase || url.searchParams.has('error')) throw redirect('/masuk?error=callback');

  const db = supabase();
  let { data } = await db.auth.getSession();

  // Fallback kalau kode belum ditukar (mis. client dibuat sebelum URL berisi code).
  const code = url.searchParams.get('code');
  if (!data.session && code) {
    const exchanged = await db.auth.exchangeCodeForSession(code);
    data = { session: exchanged.data.session };
  }
  if (!data.session) throw redirect(`/masuk?error=callback&next=${encodeURIComponent(next)}`);

  // Kembali ke halaman asal (mis. detail event untuk lanjut daftar). Halaman
  // portal sendiri yang mengarahkan ke /onboarding kalau perlu (member-layout).
  throw redirect(next);
}

export function HydrateFallback() {
  return <div className="loading-block">Menyiapkan akunmu…</div>;
}

export default function AuthCallback() {
  return null;
}
