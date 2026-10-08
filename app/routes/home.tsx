import { Link } from 'react-router';
import type { Route } from './+types/home';
import { AgendaList } from '~/components/AgendaList';
import { getPublishedActivities, isActivityUpcoming } from '~/lib/activities';
import { useAuth } from '~/lib/auth';
import { formatWibDate, formatWibTime } from '~/lib/format';
import { pageMeta, PORTAL_FEATURES } from '~/lib/site';

export const meta: Route.MetaFunction = () => pageMeta('SWE Growth — komunitas software engineer Indonesia');

const upcoming = async () => (await getPublishedActivities()).filter(isActivityUpcoming).slice(0, 3);

export async function loader() {
  return { activities: await upcoming() };
}

export async function clientLoader() {
  return { activities: await upcoming() };
}
clientLoader.hydrate = true as const;

/** Diambil dari Code of Conduct — ringkasannya, bukan janji baru. */
const VALUES = [
  { title: 'Fokus belajar', body: 'Diskusi soal ide, pengalaman, dan solusi engineering, bukan debat personal.' },
  { title: 'Saling menghargai', body: 'Tanpa harassment, spam, atau provokasi. Bahasa yang pantas.' },
  { title: 'Batas aman syariah', body: 'Dipakai sebagai prinsip kehati-hatian komunitas (mis. promosi dan lowongan), bukan untuk menilai keyakinan anggota.' },
];

export default function Home({ loaderData: { activities } }: Route.ComponentProps) {
  const { user } = useAuth();
  const nextEvent = activities.find((a) => a.starts_at);

  return (
    <>
      <section className="block intro on-teal">
        <div className="wrap narrow-wrap">
          <h1>Belajar dan bertumbuh sebagai software engineer, <span className="hl">bareng-bareng.</span></h1>
          <p className="lead">
            SWE Growth adalah komunitas software engineer Indonesia: diskusi harian di grup WhatsApp, kegiatan
            belajar bersama, dan portal untuk mengikuti semuanya. Daftar pakai akun Google, isi profil, dan link
            grup WhatsApp langsung kamu dapatkan. Gratis.
          </p>
          <div className="inline-actions">
            {user ? (
              <Link className="btn btn-primary" to="/portal">Buka portal</Link>
            ) : (
              <>
                <Link className="btn btn-primary" to="/masuk?next=/portal">Daftar gratis</Link>
                <Link className="btn btn-ghost" to="/agenda">Lihat agenda</Link>
              </>
            )}
          </div>
          {nextEvent?.starts_at && (
            <div>
              <Link className="info-bar" to="/agenda">
                Terdekat: {nextEvent.title} · {formatWibDate(nextEvent.starts_at)} | {formatWibTime(nextEvent.starts_at)}
              </Link>
            </div>
          )}
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
                <h3>Daftar pakai Google</h3>
                <span className="chip">Gratis</span>
              </div>
              <p>Satu klik dengan akun Gmail, tanpa password. Bisa juga lewat link di email.</p>
              {!user && <Link className="text-link" to="/masuk?next=/portal">Daftar</Link>}
            </li>
            <li>
              <div className="ladder-head">
                <h3>Isi profil member</h3>
              </div>
              <p>Nomor WhatsApp, peran, level, dan teknologi yang kamu kuasai. LinkedIn, keahlian, dan pengalaman boleh menyusul.</p>
            </li>
            <li>
              <div className="ladder-head">
                <h3>Gabung grup WhatsApp</h3>
              </div>
              <p>Link grup langsung muncul setelah profil tersimpan. Di portal juga ada:</p>
              <ul className="plain-list">
                {PORTAL_FEATURES.map((f) => <li key={f}>{f}</li>)}
              </ul>
            </li>
          </ol>
          <p className="muted" style={{ marginTop: 18, fontSize: '.92rem' }}>
            Membership untuk mendukung komunitas <span className="chip yellow">segera hadir</span>
          </p>
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
