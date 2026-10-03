import { useState } from 'react';
import { Link } from 'react-router';
import type { Route } from './+types/profile-edit';
import { MemberHeader } from '~/components/MemberHeader';
import { ProfileForm } from '~/components/ProfileForm';
import { fetchProfile, requireUser, useAuth } from '~/lib/auth';

export const meta: Route.MetaFunction = () => [{ title: 'Profil saya — SWE Growth' }];

export async function clientLoader({ request }: Route.ClientLoaderArgs) {
  const user = await requireUser(request);
  const profile = await fetchProfile(user.id);
  if (!profile) throw new Error('Profil tidak ditemukan.');
  return { profile, email: user.email };
}

export default function ProfileEdit({ loaderData }: Route.ComponentProps) {
  const { profile, email } = loaderData;
  const { refreshProfile } = useAuth();
  const [saved, setSaved] = useState<string | null>(null);

  return (
    <>
      <MemberHeader />
      <section className="block" style={{ paddingTop: 20 }}>
        <div className="wrap" style={{ maxWidth: 860 }}>
          {saved && (
            <p className="form-message success">
              Profil tersimpan. <Link to={`/u/${saved}`}>Lihat profil publikmu →</Link>
            </p>
          )}
          <ProfileForm
            profile={profile}
            email={email}
            variant="full"
            submitLabel="Simpan profil"
            onSaved={async (next) => {
              await refreshProfile();
              setSaved(next.username);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        </div>
      </section>
    </>
  );
}
