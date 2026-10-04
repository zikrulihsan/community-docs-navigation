import { Link } from 'react-router';
import type { Route } from './+types/home';
import { AgendaList } from '~/components/AgendaList';
import { getPublishedActivities, isActivityUpcoming } from '~/lib/activities';
import { useAuth } from '~/lib/auth';
import { adminWaLink, MEMBER_BENEFITS, pageMeta, PORTAL_FEATURES, WA_COMMUNITY_URL } from '~/lib/site';

export const meta: Route.MetaFunction = () => pageMeta('SWE Growth — komunitas software engineer Indonesia');

const upcoming = async () => (await getPublishedActivities()).filter(isActivityUpcoming).slice(0, 3);

export async function loader() {
  return { activities: await upcoming() };
}

export async function clientLoader() {
  return { activities: await upcoming() };
}
clientLoader.hydrate = true as const;

const waHref = WA_COMMUNITY_URL || adminWaLink('Halo admin, saya mau gabung komunitas WhatsApp SWE Growth.');

/** Diambil dari Code of Conduct — ringkasannya, bukan janji baru. */
const VALUES = [
  { title: 'Fokus belajar', body: 'Diskusi soal ide, pengalaman, dan solusi engineering, bukan debat personal.' },
  { title: 'Saling menghargai', body: 'Tanpa harassment, spam, atau provokasi. Bahasa yang pantas.' },
  { title: 'Batas aman syariah', body: 'Dipakai sebagai prinsip kehati-hatian komunitas (mis. promosi dan lowongan), bukan untuk menilai keyakinan anggota.' },
];

export default function Home({ loaderData: { activities } }: Route.ComponentProps) {
  const { user } = useAuth();

  return (
    <>
      <section className="block intro">
        <div className="wrap narrow-wrap">
          <h1>Belajar dan bertumbuh sebagai software engineer, bareng-bareng.</h1>
          <p className="lead">
            SWE Growth adalah komunitas software engineer Indonesia: diskusi harian di grup WhatsApp, kegiatan
            belajar bersama, dan portal untuk mengikuti semuanya. Bergabung gratis.
          </p>
          <div className="inline-actions">
            {user ? (
              <Link className="btn btn-primary" to="/portal">Buka portal</Link>
            ) : (
              <>
                <a className="btn btn-primary" href={waHref} target="_blank" rel="noopener">
                  {WA_COMMUNITY_URL ? 'Gabung grup WhatsApp' : 'Minta link grup WhatsApp'}
                </a>
                <Link className="btn btn-ghost" to="/masuk?next=/portal">Buat akun portal</Link>
              </>
            )}
          </div>
        </div>
      </section>

      {activities.length > 0 && (
        <section className="block">
          <div className="wrap narrow-wrap">
            <div className="panel-head">
              <h2 className="section-title">Kegiatan terdekat</h2>
              <Link className="text-link" to="/agenda">Semua agenda</Link>
            </div>
            <div className="panel"><AgendaList activities={activities} /></div>
          </div>
        </section>
      )}

      <section className="block">
        <div className="wrap narrow-wrap">
          <h2 className="section-title">Cara ikut</h2>
          <ol className="ladder">
            <li>
              <div className="ladder-head">
                <h3>Gabung grup WhatsApp</h3>
                <span className="chip">Gratis</span>
              </div>
              <p>Tempat diskusi sehari-hari: tanya jawab, berbagi pengalaman, dan info kegiatan.</p>
              <a className="text-link" href={waHref} target="_blank" rel="noopener">
                {WA_COMMUNITY_URL ? 'Gabung grup' : 'Minta link ke admin'}
              </a>
            </li>
            <li>
              <div className="ladder-head">
                <h3>Buat akun portal</h3>
                <span className="chip">Gratis</span>
              </div>
              <ul className="plain-list">
                {PORTAL_FEATURES.map((f) => <li key={f}>{f}</li>)}
              </ul>
              {!user && <Link className="text-link" to="/masuk?next=/portal">Buat akun</Link>}
            </li>
            <li>
              <div className="ladder-head">
                <h3>Jadi verified member</h3>
                <span className="chip green">Berbayar</span>
              </div>
              <ul className="plain-list">
                {MEMBER_BENEFITS.map((b) => <li key={b}>{b}</li>)}
              </ul>
              <Link className="text-link" to={user ? '/portal/membership' : '/masuk?next=/portal/membership'}>
                Lihat membership
              </Link>
            </li>
          </ol>
        </div>
      </section>

      <section className="block">
        <div className="wrap narrow-wrap">
          <div className="panel-head">
            <h2 className="section-title">Yang kami jaga</h2>
            <Link className="text-link" to="/code-of-conduct">Code of Conduct</Link>
          </div>
          <div className="values-grid">
            {VALUES.map((v) => (
              <div key={v.title}>
                <h3>{v.title}</h3>
                <p>{v.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
