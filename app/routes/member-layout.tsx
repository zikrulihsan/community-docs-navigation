import { Outlet, redirect } from 'react-router';
import type { Route } from './+types/member-layout';
import { fetchProfile, requireUser } from '~/lib/auth';
import { fetchMotivation, isOnboarded } from '~/lib/profile';

/**
 * Semua halaman di bawah layout ini wajib login. Akun yang belum selesai
 * onboarding (kenalan + profil, lihat isOnboarded) diarahkan ke /onboarding dulu. Portal terbuka untuk semua akun; isi khusus verified member dijaga di
 * database (is_member()).
 */
export async function clientLoader({ request }: Route.ClientLoaderArgs) {
  const user = await requireUser(request);
  const url = new URL(request.url);
  if (url.pathname === '/onboarding') return null;

  const [profile, motivation] = await Promise.all([fetchProfile(user.id), fetchMotivation(user.id)]);
  if (!isOnboarded(profile, motivation)) {
    throw redirect(`/onboarding?next=${encodeURIComponent(url.pathname + url.search)}`);
  }
  return null;
}

export function HydrateFallback() {
  return <div className="loading-block">Memuat…</div>;
}

export default function MemberLayout() {
  return <Outlet />;
}
