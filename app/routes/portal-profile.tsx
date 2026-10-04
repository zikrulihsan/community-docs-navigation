import { useState } from 'react';
import { useNavigate } from 'react-router';
import type { Route } from './+types/portal-profile';
import { PortalHeader } from '~/components/PortalHeader';
import { ProfileForm } from '~/components/ProfileForm';
import { fetchProfile, requireUser, useAuth } from '~/lib/auth';

export const meta: Route.MetaFunction = () => [{ title: 'Profil — SWE Growth' }, { name: 'robots', content: 'noindex' }];

export async function clientLoader({ request }: Route.ClientLoaderArgs) {
  const user = await requireUser(request);
  const profile = await fetchProfile(user.id);
  if (!profile) throw new Error('Profil tidak ditemukan.');
  return { profile, email: user.email ?? '' };
}

export default function PortalProfile({ loaderData: { profile, email } }: Route.ComponentProps) {
  const { refreshProfile, signOut } = useAuth();
  const navigate = useNavigate();
  const [saved, setSaved] = useState(false);

  return (
    <>
      <PortalHeader />
      <section className="block" style={{ paddingTop: 8 }}>
        <div className="wrap narrow-wrap portal-stack">
          <div className="panel">
            <div className="panel-head"><h2>Akun</h2></div>
            <dl className="facts">
              <div><dt>Email akun</dt><dd>{email}</dd></div>
            </dl>
          </div>

          <div>
            {saved && <p className="form-message success">Profil tersimpan.</p>}
            <ProfileForm
              profile={profile}
              submitLabel="Simpan"
              onSaved={async () => {
                await refreshProfile();
                setSaved(true);
              }}
            />
          </div>

          <div>
            <button
              className="link-btn"
              type="button"
              onClick={async () => {
                await signOut();
                navigate('/', { replace: true });
              }}
            >
              Keluar dari akun
            </button>
          </div>
        </div>
      </section>
    </>
  );
}
