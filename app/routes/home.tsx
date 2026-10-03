import { Link } from 'react-router';
import type { Route } from './+types/home';
import { JoinCta } from '~/components/JoinCta';
import { ArrowRight } from '~/components/Icons';
import { WaChat } from '~/components/WaChat';
import { getEvents, getPosts } from '~/lib/content.server';
import { formatDate, isUpcomingDay } from '~/lib/format';
import { JOIN_URL, pageMeta } from '~/lib/site';

export const meta: Route.MetaFunction = () => pageMeta('SWE Growth — tumbuh bareng sebagai software engineer');

export async function loader() {
  const events = (await getEvents()).filter((e) => isUpcomingDay(e.date)).slice(0, 2);
  const posts = (await getPosts()).slice(0, 2);
  return {
    events: events.map(({ html: _html, ...e }) => e),
    posts: posts.map(({ html: _html, ...p }) => p),
  };
}

const pillars = [
  {
    href: '/mentorship', title: 'Mentorship', tone: 'green',
    body: 'Belajar langsung dari yang sudah lebih dulu jalan. Cocokkan topik, lalu ngobrol.',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M7 18.5a4.5 4.5 0 1 1 1.5-8.74A5.5 5.5 0 0 1 19 12v.5a4 4 0 0 1-4 4h-2l-3.5 3v-3.2"/><path d="M8.5 12.5h.01M12 12.5h.01M15.5 12.5h.01"/></svg>',
  },
  {
    href: '/events', title: 'Event & Kelas', tone: 'blue',
    body: 'Kelas online, sharing session, dan podcast. Daftar langsung dari web.',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="16" rx="3"/><path d="M8 3v4M16 3v4M3 10h18M8 14h3M8 17h7"/></svg>',
  },
  {
    href: '/courses', title: 'Course', tone: 'gold',
    body: 'Materi belajar terstruktur dari mentor komunitas. Progress-mu tersimpan otomatis.',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M6.5 4H18a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1H6.5A2.5 2.5 0 0 1 4 16.5v-10A2.5 2.5 0 0 1 6.5 4z"/><path d="M4 16.5A2.5 2.5 0 0 1 6.5 14H19"/></svg>',
  },
  {
    href: '/videos', title: 'Video', tone: 'coral',
    body: 'Ketinggalan sesi live? Semua rekaman ada di sini.',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="16" rx="3"/><path d="m10 8 6 4-6 4V8Z"/></svg>',
  },
  {
    href: '/blog', title: 'Blog', tone: 'gold',
    body: 'Tulisan dari member untuk member — pengalaman nyata, bukan teori doang.',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M5 3h10l4 4v14H5z"/><path d="M14 3v5h5M8 12h8M8 16h6"/></svg>',
  },
  {
    href: '/jobs', title: 'Loker', tone: 'blue',
    body: 'Info lowongan yang sudah dikurasi sesuai nilai komunitas.',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="7" width="18" height="13" rx="3"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 12h18M10 12v2h4v-2"/></svg>',
  },
  {
    href: '/code-of-conduct', title: 'Code of Conduct', tone: 'green',
    body: 'Aturan main biar ruang belajar ini nyaman buat semua.',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3 20 6v5c0 5-3.4 8.6-8 10-4.6-1.4-8-5-8-10V6z"/><path d="m8.5 12 2.2 2.2 4.8-5"/></svg>',
  },
];

export default function Home({ loaderData }: Route.ComponentProps) {
  const { events, posts } = loaderData;

  return (
    <>
      <header className="hero">
        <div className="wrap hero-grid">
          <div className="hero-copy">
            <span className="badge mono">Komunitas Software Engineer 🇮🇩</span>
            <h1 className="hero-title">Bareng-bareng <span>bertumbuh</span> sebagai Software Engineer.</h1>
            <p className="hero-sub">Tumbuh sebagai engineer itu capek kalau jalan sendirian. Di sini kita belajar, berbagi, dan ngelewatin prosesnya bareng.</p>
            <div className="hero-actions">
              <a className="btn btn-primary" href={JOIN_URL} target="_blank" rel="noopener">
                Gabung komunitas
                <ArrowRight />
              </a>
              <Link className="btn btn-ghost" to="/events">Lihat event terdekat</Link>
            </div>
            <div className="hero-meta">
              <div className="stat"><span className="num">1024+</span><span className="mono">anggota</span></div>
              <div className="vr"></div>
              <div className="stat"><span className="num">gratis</span><span className="mono">selamanya</span></div>
              <div className="vr"></div>
              <div className="stat"><span className="num">8</span><span className="mono">ruang diskusi</span></div>
            </div>
          </div>

          <div className="hero-visual">
            <span className="hero-live" aria-hidden="true">community://live</span>
            <WaChat />
          </div>
        </div>
      </header>

      <section className="block pillars-block">
        <div className="wrap">
          <div className="section-head">
            <h2 className="section-title">Satu komunitas, banyak cara buat tumbuh.</h2>
            <p>Pilih jalur yang paling relevan buat fase kariermu sekarang—semuanya terhubung dalam ekosistem yang sama.</p>
          </div>
          <div className="card-grid">
            {pillars.map((p, i) => (
              <Link key={p.href} className="card pillar-card" to={p.href} data-tone={p.tone}>
                <span className="card-index">{String(i + 1).padStart(2, '0')}</span>
                <span className="card-icon" dangerouslySetInnerHTML={{ __html: p.icon }} />
                <h3>{p.title}</h3>
                <p>{p.body}</p>
                <span className="spacer"></span>
                <span className="card-link">Jelajahi <span aria-hidden="true">→</span></span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {events.length > 0 && (
        <section className="block surface-band">
          <div className="wrap">
            <div className="section-head">
              <h2 className="section-title">Event terdekat</h2>
              <Link className="text-link" to="/events">Lihat semua event →</Link>
            </div>
            <div className="card-grid">
              {events.map((e) => (
                <Link key={e.id} className="card content-card" to={`/events/${e.id}`}>
                  <span className="chip green">{e.mode}</span>
                  <h3>{e.title}</h3>
                  <p>{e.description}</p>
                  <span className="spacer"></span>
                  <div className="meta">
                    <time dateTime={e.date}>{formatDate(e.date)}</time>
                    {e.time && <span>{e.time}</span>}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {posts.length > 0 && (
        <section className="block">
          <div className="wrap">
            <div className="section-head">
              <h2 className="section-title">Tulisan terbaru</h2>
              <Link className="text-link" to="/blog">Baca semua tulisan →</Link>
            </div>
            <div className="card-grid">
              {posts.map((p) => (
                <Link key={p.id} className="card content-card article-card" to={`/blog/${p.id}`}>
                  <span className="chip">Dari komunitas</span>
                  <h3>{p.title}</h3>
                  <p>{p.description}</p>
                  <span className="spacer"></span>
                  <div className="meta">
                    <time dateTime={p.pubDate}>{formatDate(p.pubDate)}</time>
                    <span>{p.author}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <JoinCta />
    </>
  );
}
