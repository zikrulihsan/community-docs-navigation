import { useNavigate, useSearchParams } from 'react-router';
import type { Route } from './+types/onboarding';
import { ProfileForm } from '~/components/ProfileForm';
import { fetchProfile, requireUser, safeNext, useAuth } from '~/lib/auth';

export const meta: Route.MetaFunction = () => [{ title: 'Lengkapi data — SWE Growth' }];

export async function clientLoader({ request }: Route.ClientLoaderArgs) {
  const user = await requireUser(request);
  const profile = await fetchProfile(user.id);
  if (!profile) throw new Error('Profil tidak ditemukan. Pastikan migration Supabase sudah dijalankan.');
  return { profile, email: user.email };
}

export default function Onboarding({ loaderData }: Route.ComponentProps) {
  const { profile, email } = loaderData;
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { refreshProfile } = useAuth();

  return (
    <section className="block">
      <div className="wrap" style={{ maxWidth: 760 }}>
        <h1 className="page-title">Lengkapi data akun</h1>
        <p className="muted" style={{ marginBottom: 26, maxWidth: '58ch' }}>
          Admin memakai nama, nomor WhatsApp, dan email akun ini ({email}) untuk mencocokkan pembayaran membership-mu.
        </p>
        <ProfileForm
          profile={profile}
          submitLabel="Simpan & lanjut"
          onSaved={async () => {
            await refreshProfile();
            navigate(safeNext(params.get('next')), { replace: true });
          }}
        />
      </div>
    </section>
  );
}
