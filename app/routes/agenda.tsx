import type { Route } from './+types/agenda';
import { AgendaList } from '~/components/AgendaList';
import { getPublishedActivities, isActivityUpcoming } from '~/lib/activities';
import { pageMeta } from '~/lib/site';

export const meta: Route.MetaFunction = () =>
  pageMeta('Agenda — SWE Growth', 'Agenda kegiatan SWE Growth. Daftar gratis dengan akun Google.');

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
  return (
    <section className="block">
      <div className="wrap narrow-wrap">
        <h1 className="page-title">Agenda</h1>
        <p className="muted" style={{ marginBottom: 28 }}>
          Pilih kegiatan untuk melihat detail dan mendaftar. Daftarnya gratis, cukup login dengan Google.
        </p>

        {activities.length === 0 ? (
          <p className="muted">Belum ada kegiatan terjadwal.</p>
        ) : (
          <div className="panel"><AgendaList activities={activities} /></div>
        )}

      </div>
    </section>
  );
}
