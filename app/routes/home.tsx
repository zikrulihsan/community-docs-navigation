import { useState } from 'react';
import { Link } from 'react-router';
import type { Route } from './+types/home';
import { AgendaList } from '~/components/AgendaList';
import { RecommendationCard } from '~/components/RecommendationCard';
import { Avatar } from '~/components/Avatar';
import { SOCIALS } from '~/components/Socials';
import { ArrowRight, ArrowUpRight, BookIcon, BriefcaseIcon, ChatIcon, MicIcon, UsersIcon, VideoIcon } from '~/components/Icons';
import { getCommunityStats, getPublishedActivities, isActivityUpcoming } from '~/lib/activities';
import { PAST_ACTIVITIES } from '~/lib/past-activities';
import { useAuth } from '~/lib/auth';
import { getPublishedContributions } from '~/lib/contributions';
import type { RecommendationCategory } from '~/lib/database.types';
import { CATEGORIES, directoryPath, getPublishedRecommendations, SUBMIT_PATH } from '~/lib/recommendations';
import { TOPICS } from '~/lib/topics';
import { pageMeta } from '~/lib/site';

export const meta: Route.MetaFunction = () => pageMeta('SWE Growth — komunitas software engineer Indonesia');

const load = async () => {
  const [activities, contributions, recommendations, stats] = await Promise.all([
    getPublishedActivities(),
    getPublishedContributions(),
    getPublishedRecommendations(),
    getCommunityStats(),
  ]);
  return {
    stats: heroStats(stats),
    activities: activities.filter(isActivityUpcoming).slice(0, 3),
    contributions,
    recommendations: recommendations.filter((r) => r.is_featured),
  };
};

export async function loader() {
  return load();
}

export async function clientLoader() {
  return load();
}
clientLoader.hydrate = true as const;

/** Angka persis, pemisah ribuan ala Indonesia (1.024). */
const count = (n: number) => n.toLocaleString('id-ID');

/** Member & sesi dari database (sesi = arsip kegiatan lama + kegiatan di agenda); topik tetap. */
function heroStats(stats: { member_count: number; session_count: number } | null) {
  return [
    stats && { value: count(stats.member_count), label: 'member' },
    { value: count(PAST_ACTIVITIES.length + (stats?.session_count ?? 0)), label: 'sesi komunitas' },
    { value: '10+', label: 'topik diskusi' },
  ].filter((s): s is { value: string; label: string } => Boolean(s));
}

/** Satu kalimat pendek per kartu. */
const ACTIVITIES = [
  { icon: <ChatIcon />, name: 'Ngobrol tiap hari', body: 'Grup WhatsApp per bidang: backend, frontend, infra, managerial.' },
  { icon: <BriefcaseIcon />, name: 'Share peluang', body: 'Loker, referral, dan rekomendasi event dari sesama member.' },
  { icon: <VideoIcon />, name: 'Diskusi online', body: 'Bahas topik yang lagi rame, langsung bareng-bareng.' },
  { icon: <UsersIcon />, name: 'Belajar bareng', body: 'Sesi rutin, satu materi dibahas sampai tuntas.' },
  { icon: <BookIcon />, name: 'Kelas', body: 'Materi runtut dari praktisi, berangkat dari masalah nyata.' },
  { icon: <MicIcon />, name: 'Talkshow', body: 'Cerita perjalanan karier langsung dari praktisi.' },
];


export default function Home({ loaderData: { activities, contributions, recommendations, stats } }: Route.ComponentProps) {
  const { user } = useAuth();
  const [picked, setPicked] = useState(0);
  const [hovered, setHovered] = useState<number | null>(null);
  const active = TOPICS[hovered ?? picked];
  const [recCategory, setRecCategory] = useState<RecommendationCategory | null>(null);
  const recCategories = CATEGORIES.filter((c) => recommendations.some((r) => r.category === c.id));
  const featured = recommendations.filter((r) => !recCategory || r.category === recCategory).slice(0, 6);

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
            {stats.map((s) => (
              <li key={s.label}><b>{s.value}</b><span>{s.label}</span></li>
            ))}
          </ul>
        </div>
      </section>

      {activities.length > 0 && (
        <section className="home-section agenda-band" id="terdekat">
          <div className="wrap narrow-wrap">
            <div className="home-head">
              <p className="home-label">Agenda</p>
              <h2>Kegiatan terdekat</h2>
            </div>
            <div className="panel"><AgendaList activities={activities} /></div>
            <Link className="btn btn-ghost more-link" to="/agenda">Lihat semua agenda <ArrowRight /></Link>
          </div>
        </section>
      )}

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
            <p className="topic-detail" aria-live="polite" key={active.name}>
              <b>{active.name}</b>
              {active.body}
            </p>
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
          </div>
        </div>
      </section>

      {recommendations.length > 0 && (
        <section className="home-section">
          <div className="wrap narrow-wrap">
            <div className="home-head">
              <p className="home-label">Rekomendasi</p>
              <h2>Tempat lain buat grow</h2>
            </div>
            {recCategories.length > 1 && (
              <div className="rec-tabs home-rec-tabs" role="group" aria-label="Kategori rekomendasi">
                <button type="button" aria-pressed={!recCategory} onClick={() => setRecCategory(null)}>Semua</button>
                {recCategories.map((c) => (
                  <button key={c.id} type="button" aria-pressed={recCategory === c.id} onClick={() => setRecCategory(c.id)}>{c.label}</button>
                ))}
              </div>
            )}
            <ul className="rec-grid">
              {featured.map((r) => <RecommendationCard key={r.id} r={r} />)}
            </ul>
            <div className="home-rec-more">
              <Link className="btn btn-ghost" to={directoryPath(recCategory ?? undefined)}>Lihat semua rekomendasi <ArrowRight /></Link>
              <Link className="text-link" to={SUBMIT_PATH}>Punya rekomendasi? Kirim ke kita</Link>
            </div>
          </div>
        </section>
      )}

      {contributions.length > 0 && (
        <section className="home-section contrib-band">
          <div className="wrap narrow-wrap">
            <div className="home-head">
              <p className="home-label">Kontribusi</p>
              <h2>Dari member ke member</h2>
            </div>
            <ul className="contrib-list">
              {contributions.map((c) => (
                <li key={c.id}>
                  {c.icon_url ? (
                    <img className="contrib-ic" src={c.icon_url} alt="" width="40" height="40" loading="lazy" />
                  ) : (
                    <span className="contrib-ic">{c.title.charAt(0).toUpperCase()}</span>
                  )}
                  <div className="contrib-main">
                    <div className="contrib-title">
                      {/* Seluruh baris bisa diklik lewat link judul; link pembuat ada di atasnya. */}
                      <h3><a className="contrib-link" href={c.url} target="_blank" rel="noopener">{c.title}</a></h3>
                      {c.category && <span className="chip">{c.category}</span>}
                    </div>
                    {c.description && <p>{c.description}</p>}
                    {c.maker_name && (
                      c.maker_handle ? (
                        <Link className="contrib-maker" to={`/member/${c.maker_handle}`}>
                          <Avatar name={c.maker_name} src={c.maker_avatar_url} size={20} />
                          oleh {c.maker_name}
                        </Link>
                      ) : (
                        <span className="contrib-maker">oleh {c.maker_name}</span>
                      )
                    )}
                  </div>
                  <span className="contrib-go" aria-hidden="true"><ArrowUpRight /></span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      <section className="home-section">
        <div className="wrap narrow-wrap">
          <div className="home-closing on-teal">
            <h2>Buat siapa aja yang mau <span className="hl">survive dan bertumbuh</span> di software engineering.</h2>
            {joinButton}
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
