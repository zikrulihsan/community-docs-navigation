import { Link } from 'react-router';
import type { Route } from './+types/agenda';
import { AgendaList } from '~/components/AgendaList';
import { getPublishedActivities, isActivityUpcoming } from '~/lib/activities';
import { useAuth } from '~/lib/auth';
import { pageMeta } from '~/lib/site';

export const meta: Route.MetaFunction = () =>
  pageMeta('Agenda — SWE Growth', 'Agenda kegiatan SWE Growth. Masuk untuk mendaftar.');

/** Saat build: snapshot agenda untuk HTML prerender. */
export async function loader() {
  return { activities: (await getPublishedActivities()).filter(isActivityUpcoming) };
}

/** Di browser: selalu ambil agenda terbaru. */
export async function clientLoader() {
  return { activities: (await getPublishedActivities()).filter(isActivityUpcoming) };
}
clientLoader.hydrate = true as const;

export default function Agenda({ loaderData: { activities } }: Route.ComponentProps) {
  const { user } = useAuth();

  return (
    <section className="block">
      <div className="wrap narrow-wrap">
        <h1 className="page-title">Agenda</h1>
        <p className="muted" style={{ marginBottom: 28 }}>
          {user
            ? 'Pilih kegiatan untuk melihat detail dan mendaftar.'
            : 'Masuk dulu untuk melihat detail dan mendaftar. Akunnya gratis.'}
        </p>

        {activities.length === 0 ? (
          <p className="muted">Belum ada kegiatan terjadwal.</p>
        ) : (
          <div className="panel"><AgendaList activities={activities} /></div>
        )}

        {!user && (
          <div className="inline-actions" style={{ marginTop: 24 }}>
            <Link className="btn btn-primary sm" to="/masuk?next=/agenda">Masuk</Link>
          </div>
        )}
      </div>
    </section>
  );
}
