import { useState } from 'react';
import { Link } from 'react-router';
import type { Route } from './+types/home';
import { AgendaList } from '~/components/AgendaList';
import { SOCIALS } from '~/components/Socials';
import { BookIcon, BriefcaseIcon, ChatIcon, MicIcon, UsersIcon, VideoIcon } from '~/components/Icons';
import { getPublishedActivities, isActivityUpcoming } from '~/lib/activities';
import { useAuth } from '~/lib/auth';
import { pageMeta } from '~/lib/site';

export const meta: Route.MetaFunction = () => pageMeta('SWE Growth — komunitas software engineer Indonesia');

const upcoming = async () => (await getPublishedActivities()).filter(isActivityUpcoming).slice(0, 3);

export async function loader() {
  return { activities: await upcoming() };
}

export async function clientLoader() {
  return { activities: await upcoming() };
}
clientLoader.hydrate = true as const;

const STATS = [
  { value: '1000+', label: 'member' },
  { value: '50+', label: 'sesi komunitas' },
  { value: '10+', label: 'topik diskusi' },
];

/** Satu kalimat pendek per kartu. */
const ACTIVITIES = [
  { icon: <ChatIcon />, name: 'Ngobrol tiap hari', body: 'Grup WhatsApp per bidang: backend, frontend, infra, managerial.' },
  { icon: <BriefcaseIcon />, name: 'Share peluang', body: 'Loker, referral, dan rekomendasi event dari sesama member.' },
  { icon: <VideoIcon />, name: 'Diskusi online', body: 'Bahas topik yang lagi rame, langsung bareng-bareng.' },
  { icon: <UsersIcon />, name: 'Belajar bareng', body: 'Sesi rutin, satu materi dibahas sampai tuntas.' },
  { icon: <BookIcon />, name: 'Kelas', body: 'Materi runtut dari praktisi, berangkat dari masalah nyata.' },
  { icon: <MicIcon />, name: 'Talkshow', body: 'Cerita perjalanan karier langsung dari praktisi.' },
];

/** Pola: apa yang dibahas + kenapa penting sekarang. Maksimal dua kalimat. */
const TOPICS = [
  { name: 'AI terkini', body: 'Tools dan model AI terbaru, plus cara makenya di kerjaan. Cara kerja engineer lagi berubah cepet.' },
  { name: 'CS fundamental', body: 'Struktur data, algoritma, OS, jaringan. Pas AI bisa nulis kode, pemahaman dasar jadi pembeda.' },
  { name: 'English speaking', body: 'Latihan ngomong Inggris bareng. Peluang remote dan tim global makin kebuka.' },
  { name: 'Backend', body: 'API, database, arsitektur. Salah desain di awal makin mahal benerinnya.' },
  { name: 'Frontend', body: 'Framework, performa, aksesibilitas. Ekosistemnya gerak cepet banget.' },
  { name: 'Mobile dev', body: 'Android, iOS, Flutter, React Native. Kebanyakan pengguna di Indonesia aksesnya lewat HP.' },
  { name: 'Infra & DevOps', body: 'Cloud, CI/CD, observability. Biaya infra makin disorot.' },
  { name: 'Managerial', body: 'Jadi tech lead atau EM. Naik level butuh skill ngurus orang, bukan cuma kode.' },
  { name: 'Karier & loker', body: 'Loker, referral, persiapan interview. Pasar kerja lagi ketat.' },
  { name: 'System design', body: 'Bedah cara sistem besar dibangun. Ini tolok ukur buat naik ke senior.' },
  { name: 'Personal project', body: 'Side project dari iseng sampai jadi produk. Cara paling cepet buat belajar hal baru sekaligus nambah portofolio.' },
  { name: 'Buku', body: 'Rekomendasi dan obrolan buku, dari engineering sampai pengembangan diri. Biar belajarnya nggak cuma dari thread.' },
  { name: 'Hidup sehat', body: 'Olahraga, tidur, dan jaga mental biar nggak burnout. Seharian kerja di depan layar ada harganya.' },
];

export default function Home({ loaderData: { activities } }: Route.ComponentProps) {
  const { user } = useAuth();
  const [picked, setPicked] = useState(0);
  const [hovered, setHovered] = useState<number | null>(null);
  const active = TOPICS[hovered ?? picked];

  const joinButton = user ? (
    <Link className="btn btn-primary" to="/portal">Buka portal</Link>
  ) : (
    <Link className="btn btn-primary" to="/masuk?next=/portal">Daftar sekarang</Link>
  );

  return (
    <div className="home">
      <section className="block intro on-teal">
        <div className="wrap narrow-wrap">
          <h1>Tumbuh sebagai software engineer, <span className="hl">bareng-bareng.</span></h1>
          <p className="lead">Diskusi harian, belajar bareng, dan kelas bersama sesama software engineer Indonesia.</p>
          <div className="inline-actions">
            {joinButton}
            {!user && (
              <a className="btn btn-ghost" href={activities.length > 0 ? '#terdekat' : '/agenda'}>Lihat agenda terdekat</a>
            )}
          </div>
          <ul className="hero-stats">
            {STATS.map((s) => (
              <li key={s.label}><b>{s.value}</b><span>{s.label}</span></li>
            ))}
          </ul>
        </div>
      </section>

      <section className="home-section">
        <div className="wrap narrow-wrap">
          <div className="home-head">
            <p className="home-label">Kegiatan</p>
            <h2>Di sini kita ngapain aja?</h2>
          </div>
          <ul className="card-grid">
            {ACTIVITIES.map((a) => (
              <li key={a.name}>
                <span className="card-ic">{a.icon}</span>
                <h3>{a.name}</h3>
                <p>{a.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="home-section on-teal">
        <div className="wrap narrow-wrap">
          <div className="home-head">
            <p className="home-label">Topik</p>
            <h2>Yang lagi sering dibahas</h2>
          </div>
          <div onMouseLeave={() => setHovered(null)}>
            <ul className="topic-cloud">
              {TOPICS.map((t, i) => (
                <li key={t.name}>
                  <button
                    type="button"
                    className={t === active ? 'active' : undefined}
                    aria-pressed={i === picked}
                    onClick={() => setPicked(i)}
                    onMouseEnter={() => setHovered(i)}
                  >
                    {t.name}
                  </button>
                </li>
              ))}
            </ul>
            <p className="topic-detail" aria-live="polite" key={active.name}>
              <b>{active.name}</b>
              {active.body}
            </p>
          </div>
        </div>
      </section>

      <section className="home-section" id="terdekat">
        <div className="wrap narrow-wrap">
          {activities.length > 0 && (
            <>
              <div className="home-head">
                <p className="home-label">Agenda</p>
                <h2>Kegiatan terdekat</h2>
              </div>
              <div className="panel"><AgendaList activities={activities} /></div>
            </>
          )}
          <div className="home-closing on-teal">
            <h2>Buat siapa aja yang mau <span className="hl">survive dan bertumbuh</span> di software engineering.</h2>
            <div className="inline-actions">
              {joinButton}
              <Link className="text-link" to="/agenda">Semua agenda</Link>
            </div>
            <div className="home-social">
              <span>Ikuti juga</span>
              <ul>
                {SOCIALS.filter((s) => s.name !== 'Instagram').map((s) => (
                  <li key={s.name}>
                    <a href={s.url} target="_blank" rel="noopener">{s.icon}{s.name}</a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
