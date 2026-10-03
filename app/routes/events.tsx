import { Link } from 'react-router';
import type { Route } from './+types/events';
import { JoinCta } from '~/components/JoinCta';
import { PageHero } from '~/components/PageHero';
import { activityStatusLabel, getPublishedActivities, isActivityUpcoming } from '~/lib/activities';
import { getEvents } from '~/lib/content.server';
import { formatDate, formatWibDate, formatWibTime, isUpcomingDay } from '~/lib/format';
import { pageMeta } from '~/lib/site';

export const meta: Route.MetaFunction = () =>
  pageMeta('Event & Kelas — SWE Growth', 'Jadwal kelas online, sharing session, dan podcast SWE Growth.');

/** Saat build: event markdown + snapshot activity Supabase untuk HTML prerender. */
export async function loader() {
  const [events, activities] = await Promise.all([getEvents(), getPublishedActivities()]);
  return { events: events.map(({ html: _html, ...e }) => e), activities };
}

/** Di browser: status/kuota activity selalu diambil terbaru dari Supabase. */
export async function clientLoader({ serverLoader }: Route.ClientLoaderArgs) {
  const [built, activities] = await Promise.all([serverLoader(), getPublishedActivities()]);
  return { ...built, activities };
}
clientLoader.hydrate = true as const;

export default function Events({ loaderData }: Route.ComponentProps) {
  const { events, activities } = loaderData;
  const remoteSlugs = new Set(activities.map((a) => a.slug));
  const legacy = events.filter((e) => !remoteSlugs.has(e.id));

  const remoteUpcoming = activities.filter(isActivityUpcoming);
  const remotePast = activities.filter((a) => !isActivityUpcoming(a));
  const legacyUpcoming = legacy.filter((e) => isUpcomingDay(e.date));
  const legacyPast = legacy.filter((e) => !isUpcomingDay(e.date)).reverse();

  return (
    <>
      <PageHero badge="Event" title="Kegiatan yang lagi jalan" lead="Kelas online, sharing session, dan podcast — semuanya gratis buat anggota komunitas." />

      <section className="block">
        <div className="wrap">
          <div className="section-heading">
            <div><span className="eyebrow">Agenda</span><h2 className="section-title">Akan datang</h2></div>
            <p>Mulai dari teaser sampai kelas yang sudah bisa didaftarkan.</p>
          </div>
          {remoteUpcoming.length === 0 && legacyUpcoming.length === 0 ? (
            <div className="empty-note">Belum ada event terjadwal. Pantau grup WhatsApp buat info paling cepat.</div>
          ) : (
            <div className="card-grid">
              {remoteUpcoming.map((a) => (
                <Link key={a.id} className="card activity-card" to={`/events/${a.slug}`}>
                  <span className={`chip${a.status === 'registration_open' ? ' green' : ''}`}>{activityStatusLabel[a.status]}</span>
                  <h3>{a.title}</h3>
                  <p>{a.summary || 'Detail activity segera diumumkan.'}</p>
                  <span className="spacer"></span>
                  <div className="meta">
                    {a.starts_at ? (
                      <>
                        <time dateTime={a.starts_at}>{formatWibDate(a.starts_at)}</time>
                        <span>{formatWibTime(a.starts_at)}</span>
                      </>
                    ) : (
                      <span>Jadwal menyusul</span>
                    )}
                    {a.mode && <span>{a.mode}</span>}
                  </div>
                </Link>
              ))}
              {legacyUpcoming.map((e) => (
                <Link key={e.id} className="card" to={`/events/${e.id}`}>
                  <span className="chip green">{e.mode}</span>
                  <h3>{e.title}</h3>
                  <p>{e.description}</p>
                  <span className="spacer"></span>
                  <div className="meta">
                    <time dateTime={e.date}>{formatDate(e.date)}</time>
                    {e.time && <span>{e.time}</span>}
                    <span>{e.location}</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {(remotePast.length > 0 || legacyPast.length > 0) && (
        <section className="block">
          <div className="wrap">
            <h2 className="section-title">Sudah lewat</h2>
            <div className="card-grid">
              {remotePast.map((a) => (
                <Link key={a.id} className="card" to={`/events/${a.slug}`}>
                  <span className="chip">{activityStatusLabel[a.status]}</span>
                  <h3>{a.title}</h3>
                  <p>{a.summary || 'Detail activity.'}</p>
                </Link>
              ))}
              {legacyPast.map((e) => (
                <Link key={e.id} className="card" to={`/events/${e.id}`}>
                  <span className="chip">selesai</span>
                  <h3>{e.title}</h3>
                  <p>{e.description}</p>
                  <span className="spacer"></span>
                  <div className="meta"><time dateTime={e.date}>{formatDate(e.date)}</time></div>
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
