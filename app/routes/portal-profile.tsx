import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import type { Route } from './+types/portal-profile';
import { PortalHeader } from '~/components/PortalHeader';
import { ProfileView } from '~/components/ProfileView';
import { fetchProfile, requireUser, useAuth } from '~/lib/auth';
import { missingProfileParts, publicProfilePath } from '~/lib/profile';

export const meta: Route.MetaFunction = () => [{ title: 'Profil — SWE Growth' }, { name: 'robots', content: 'noindex' }];

export async function clientLoader({ request }: Route.ClientLoaderArgs) {
  const user = await requireUser(request);
  const profile = await fetchProfile(user.id);
  if (!profile) throw new Error('Profil tidak ditemukan.');
  return { profile };
}

export default function PortalProfile({ loaderData: { profile } }: Route.ComponentProps) {
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const missing = missingProfileParts(profile);
  const publicPath = publicProfilePath(profile);
  const [copied, setCopied] = useState(false);

  const copyLink = async () => {
    await navigator.clipboard.writeText(`${window.location.origin}${publicPath}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <PortalHeader />
      <section className="block" style={{ paddingTop: 8 }}>
        <div className="wrap narrow-wrap portal-stack">
          {missing.length > 0 && (
            <p className="form-message success">
              Tambahkan {missing.join(', ')} supaya profilmu makin lengkap. <Link className="text-link" to="/portal/profil/edit">Lengkapi</Link>
            </p>
          )}

          <div className="panel">
            <div className="panel-head"><h2>Profil publik</h2></div>
            <p className="muted" style={{ marginBottom: 12 }}>
              Siapa pun bisa melihat profilmu lewat link ini. Nomor WhatsApp, email, dan jawaban kenalan tidak ikut tampil.
            </p>
            <div className="share-link">
              <code>swegrowth.id{publicPath}</code>
              <button className="btn btn-ghost sm" type="button" onClick={copyLink}>{copied ? 'Tersalin ✓' : 'Salin link'}</button>
              <Link className="text-link" to={publicPath}>Lihat sebagai publik</Link>
            </div>
          </div>

          <ProfileView
            profile={profile}
            actions={<Link className="btn btn-primary sm" to="/portal/profil/edit">Edit profil</Link>}
          />

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
