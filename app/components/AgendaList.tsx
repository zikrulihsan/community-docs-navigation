import { Link } from 'react-router';
import { activityStatusLabel, type Activity } from '~/lib/activities';
import { useAuth } from '~/lib/auth';
import { formatWibTime, wibDayParts } from '~/lib/format';

/**
 * Agenda publik: judul, tanggal, dan format saja. Detail & pendaftaran ada di
 * portal; tamu yang klik diarahkan masuk dulu.
 */
export function AgendaList({ activities }: { activities: Activity[] }) {
  const { isMember } = useAuth();

  return (
    <ul className="rows agenda-rows">
      {activities.map((a) => {
        const parts = a.starts_at ? wibDayParts(a.starts_at) : null;
        const href = `/portal/agenda/${a.slug}`;
        return (
          <li key={a.id}>
            <span className="date-tile">
              {parts ? <><b>{parts.day}</b><span>{parts.month}</span></> : <span>TBA</span>}
            </span>
            <div className="row-main">
              <Link className="title" to={isMember ? href : `/masuk?next=${encodeURIComponent(href)}`}>{a.title}</Link>
              <span>
                {[a.starts_at ? formatWibTime(a.starts_at) : 'Jadwal menyusul', a.mode, activityStatusLabel[a.status]]
                  .filter(Boolean)
                  .join(' · ')}
              </span>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
