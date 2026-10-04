import type { Route } from './+types/membership';
import { PortalHeader } from '~/components/PortalHeader';
import { displayName, fetchIsMember, fetchMembership, fetchProfile, requireUser, useAuth } from '~/lib/auth';
import { formatDate } from '~/lib/format';
import { adminWaLink, MEMBER_BENEFITS, MEMBERSHIP_URL } from '~/lib/site';

export const meta: Route.MetaFunction = () => [{ title: 'Membership — SWE Growth' }, { name: 'robots', content: 'noindex' }];

export async function clientLoader({ request }: Route.ClientLoaderArgs) {
  const user = await requireUser(request);
  const [profile, membership, verified] = await Promise.all([
    fetchProfile(user.id),
    fetchMembership(user.id),
    fetchIsMember(),
  ]);
  return { email: user.email ?? '', profile, membership, verified };
}

export function HydrateFallback() {
  return <div className="loading-block">Memuat…</div>;
}

export default function Membership({ loaderData }: Route.ComponentProps) {
  const { email, profile, membership, verified } = loaderData;
  const { user } = useAuth();
  const name = displayName(profile, user);
  const expired = Boolean(membership) && !verified;

  const waText = [
    `Halo admin, saya ${name}.`,
    membership ? 'Saya sudah memperpanjang membership SWE Growth.' : 'Saya sudah membayar membership SWE Growth.',
    `Email akun portal: ${email}`,
    profile?.whatsapp ? `WhatsApp: ${profile.whatsapp}` : null,
  ].filter(Boolean).join('\n');

  return (
    <>
      <PortalHeader />
      <section className="block" style={{ paddingTop: 8 }}>
        <div className="wrap narrow-wrap">
          <h2 className="detail-title">
            {verified ? 'Kamu verified member' : expired ? 'Membership-mu sudah berakhir' : 'Jadi verified member'}
          </h2>
          <p className="muted" style={{ marginBottom: 20 }}>
            {verified
              ? membership
                ? `Aktif sampai ${formatDate(membership.active_until)}. Perpanjang lewat langkah yang sama sebelum tanggal itu.`
                : 'Akun admin selalu dihitung verified.'
              : expired
                ? `Masa aktif berakhir ${formatDate(membership!.active_until)}. Portal tetap bisa kamu pakai; perpanjang untuk mendapatkan lagi:`
                : 'Portal bisa kamu pakai tanpa membership. Verified member juga mendapatkan:'}
          </p>

          {!verified && (
            <ul className="plain-list" style={{ marginBottom: 28 }}>
              {MEMBER_BENEFITS.map((b) => <li key={b}>{b}</li>)}
            </ul>
          )}

          {!(verified && !membership) && (
            <ol className="steps">
              <li>
                <strong>{membership ? 'Perpanjang' : 'Bayar'} membership di goakal</strong>
                <span>Gunakan nama dan nomor WhatsApp yang sama dengan akun ini supaya mudah dicocokkan.</span>
                <a className="btn btn-primary sm" href={MEMBERSHIP_URL} target="_blank" rel="noopener">Buka halaman membership</a>
              </li>
              <li>
                <strong>Kabari admin</strong>
                <span>Admin mencocokkan pembayaranmu dengan akun <b>{email}</b>, lalu memverifikasinya.</span>
                <a className="btn btn-ghost sm" href={adminWaLink(waText)} target="_blank" rel="noopener">Chat admin di WhatsApp</a>
              </li>
              <li>
                <strong>Badge verified muncul</strong>
                <span>Setelah diverifikasi, badge dan isi khusus verified langsung terbuka di portal.</span>
              </li>
            </ol>
          )}
        </div>
      </section>
    </>
  );
}
