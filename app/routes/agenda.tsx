import { Link } from 'react-router';
import type { Route } from './+types/agenda';
import { AgendaList } from '~/components/AgendaList';
import { getPublishedActivities, isActivityUpcoming } from '~/lib/activities';
import { useAuth } from '~/lib/auth';
import { MEMBERSHIP_URL, pageMeta } from '~/lib/site';

export const meta: Route.MetaFunction = () =>
  pageMeta('Agenda — SWE Growth', 'Agenda kegiatan SWE Growth. Pendaftaran untuk member.');

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
  const { isMember } = useAuth();

  return (
    <section className="block">
      <div className="wrap narrow-wrap">
        <h1 className="page-title">Agenda</h1>
        <p className="muted" style={{ marginBottom: 28 }}>
          {isMember
            ? 'Pilih kegiatan untuk melihat detail dan mendaftar.'
            : 'Detail dan pendaftaran kegiatan tersedia untuk member.'}
        </p>

        {activities.length === 0 ? (
          <p className="muted">Belum ada kegiatan terjadwal.</p>
        ) : (
          <div className="panel"><AgendaList activities={activities} /></div>
        )}

        {!isMember && (
          <div className="inline-actions" style={{ marginTop: 24 }}>
            <a className="btn btn-primary sm" href={MEMBERSHIP_URL} target="_blank" rel="noopener">Jadi member</a>
            <Link className="btn btn-ghost sm" to="/masuk?next=/portal">Masuk</Link>
          </div>
        )}
      </div>
    </section>
  );
}
