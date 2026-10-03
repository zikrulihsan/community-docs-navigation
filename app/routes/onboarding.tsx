import { useNavigate, useSearchParams } from 'react-router';
import type { Route } from './+types/onboarding';
import { ProfileForm } from '~/components/ProfileForm';
import { fetchProfile, requireUser, safeNext, useAuth } from '~/lib/auth';

export const meta: Route.MetaFunction = () => [{ title: 'Lengkapi profil — SWE Growth' }];

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
        <span className="eyebrow">Langkah terakhir</span>
        <h1 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', margin: '6px 0 10px', letterSpacing: '-.03em' }}>
          Kenalan dulu, yuk 👋
        </h1>
        <p className="muted" style={{ marginBottom: 26, maxWidth: '58ch' }}>
          Profil ini membantu kami merekomendasikan event & course yang pas, dan bikin member lain kenal kamu.
          Bisa diubah kapan saja.
        </p>
        <ProfileForm
          profile={profile}
          email={email}
          variant="onboarding"
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
