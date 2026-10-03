import { useState } from 'react';
import { useNavigate } from 'react-router';
import type { Route } from './+types/portal-profile';
import { PortalHeader } from '~/components/PortalHeader';
import { ProfileForm } from '~/components/ProfileForm';
import { fetchProfile, requireMember, useAuth } from '~/lib/auth';
import { formatDate } from '~/lib/format';
import { MEMBERSHIP_URL } from '~/lib/site';

export const meta: Route.MetaFunction = () => [{ title: 'Profil — SWE Growth' }, { name: 'robots', content: 'noindex' }];

export async function clientLoader({ request }: Route.ClientLoaderArgs) {
  const user = await requireMember(request);
  const profile = await fetchProfile(user.id);
  if (!profile) throw new Error('Profil tidak ditemukan.');
  return { profile, email: user.email ?? '' };
}

export default function PortalProfile({ loaderData: { profile, email } }: Route.ComponentProps) {
  const { membership, refreshProfile, signOut } = useAuth();
  const navigate = useNavigate();
  const [saved, setSaved] = useState(false);

  return (
    <>
      <PortalHeader />
      <section className="block" style={{ paddingTop: 8 }}>
        <div className="wrap narrow-wrap portal-stack">
          <div className="panel">
            <div className="panel-head"><h2>Membership</h2></div>
            <dl className="facts">
              <div><dt>Email akun</dt><dd>{email}</dd></div>
              {membership && <div><dt>Aktif sampai</dt><dd>{formatDate(membership.active_until)}</dd></div>}
            </dl>
            {membership && (
              <a className="btn btn-ghost sm" href={MEMBERSHIP_URL} target="_blank" rel="noopener" style={{ marginTop: 16 }}>
                Perpanjang di goakal
              </a>
            )}
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
