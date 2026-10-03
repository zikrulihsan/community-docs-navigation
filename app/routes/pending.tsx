import { Link, redirect, useNavigate } from 'react-router';
import type { Route } from './+types/pending';
import { displayName, fetchIsMember, fetchMembership, fetchProfile, requireUser, useAuth } from '~/lib/auth';
import { formatDate } from '~/lib/format';
import { adminWaLink, MEMBERSHIP_URL } from '~/lib/site';

export const meta: Route.MetaFunction = () => [{ title: 'Status membership — SWE Growth' }, { name: 'robots', content: 'noindex' }];

export async function clientLoader({ request }: Route.ClientLoaderArgs) {
  const user = await requireUser(request);
  if (await fetchIsMember()) throw redirect('/portal');
  const [profile, membership] = await Promise.all([fetchProfile(user.id), fetchMembership(user.id)]);
  return { email: user.email ?? '', profile, membership };
}

export default function Pending({ loaderData }: Route.ComponentProps) {
  const { email, profile, membership } = loaderData;
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const name = displayName(profile, user);
  const expired = Boolean(membership);

  const waText = [
    `Halo admin, saya ${name}.`,
    expired ? 'Saya sudah memperpanjang membership SWE Growth.' : 'Saya sudah membayar membership SWE Growth.',
    `Email akun portal: ${email}`,
    profile?.whatsapp ? `WhatsApp: ${profile.whatsapp}` : null,
  ].filter(Boolean).join('\n');

  return (
    <section className="block">
      <div className="wrap" style={{ maxWidth: 720 }}>
        <h1 className="page-title">
          {expired ? 'Membership-mu sudah berakhir' : 'Akunmu belum aktif sebagai member'}
        </h1>
        <p className="muted" style={{ marginBottom: 28 }}>
          {expired
            ? `Masa aktif berakhir ${formatDate(membership!.active_until)}. Perpanjang untuk membuka portal lagi.`
            : 'Portal berisi agenda, grup WhatsApp khusus member, rekaman, dan rangkuman diskusi. Aksesnya dibuka setelah membership dibayar.'}
        </p>

        <ol className="steps">
          <li>
            <strong>{expired ? 'Perpanjang' : 'Bayar'} membership di goakal</strong>
            <span>Gunakan nama dan nomor WhatsApp yang sama dengan akun ini supaya mudah dicocokkan.</span>
            <a className="btn btn-primary sm" href={MEMBERSHIP_URL} target="_blank" rel="noopener">Buka halaman membership</a>
          </li>
          <li>
            <strong>Kabari admin</strong>
            <span>Admin mencocokkan pembayaranmu dengan akun <b>{email}</b>, lalu mengaktifkannya.</span>
            <a className="btn btn-ghost sm" href={adminWaLink(waText)} target="_blank" rel="noopener">Chat admin di WhatsApp</a>
          </li>
          <li>
            <strong>Masuk lagi</strong>
            <span>Setelah aktif, halaman ini otomatis berganti ke portal.</span>
          </li>
        </ol>

        <div className="inline-actions" style={{ marginTop: 28 }}>
          <Link className="btn btn-ghost sm" to="/agenda">Lihat agenda</Link>
          <button className="link-btn" type="button" onClick={async () => {
            await signOut();
            navigate('/', { replace: true });
          }}>Keluar</button>
        </div>
      </div>
    </section>
  );
}
