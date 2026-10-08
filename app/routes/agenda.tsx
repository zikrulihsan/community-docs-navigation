import type { Route } from './+types/agenda';
import { AgendaList } from '~/components/AgendaList';
import { getPublishedActivities, isActivityUpcoming } from '~/lib/activities';
import { PAST_ACTIVITIES } from '~/lib/past-activities';
import { pageMeta } from '~/lib/site';

const monthFmt = new Intl.DateTimeFormat('id-ID', { month: 'short', year: 'numeric' });

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

        <details className="past-activities">
          <summary>Kegiatan sebelumnya ({PAST_ACTIVITIES.length}+ sejak 2024)</summary>
          <ul>
            {PAST_ACTIVITIES.map((a) => (
              <li key={`${a.month}-${a.title}`}>
                <time>{monthFmt.format(new Date(`${a.month}-01T00:00:00`))}</time>
                {a.title}
              </li>
            ))}
          </ul>
          <p>
            Dirangkum dari arsip media SWE Growth:{' '}
            <a href="https://x.com/swegrowthid" target="_blank" rel="noreferrer">X</a> dan{' '}
            <a href="https://www.youtube.com/@segrowthid" target="_blank" rel="noreferrer">YouTube</a>.
          </p>
        </details>
      </div>
    </section>
  );
}
