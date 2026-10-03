import { Outlet, redirect } from 'react-router';
import type { Route } from './+types/member-layout';
import { fetchIsMember, fetchProfile, requireUser } from '~/lib/auth';

/**
 * Semua halaman di bawah layout ini wajib login. Akun baru isi profil singkat
 * dulu, lalu halaman /portal/* hanya terbuka untuk member aktif.
 */
export async function clientLoader({ request }: Route.ClientLoaderArgs) {
  const user = await requireUser(request);
  const url = new URL(request.url);
  if (url.pathname === '/onboarding') return null;

  const profile = await fetchProfile(user.id);
  if (!profile?.onboarded_at) {
    throw redirect(`/onboarding?next=${encodeURIComponent(url.pathname + url.search)}`);
  }
  if (url.pathname.startsWith('/portal') && !(await fetchIsMember())) {
    throw redirect('/menunggu');
  }
  return null;
}

export function HydrateFallback() {
  return <div className="loading-block">Memuat…</div>;
}

export default function MemberLayout() {
  return <Outlet />;
}
