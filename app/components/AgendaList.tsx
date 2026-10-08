import { Link } from 'react-router';
import { activityPath, activityStatusLabel, type Activity } from '~/lib/activities';
import { formatWibTime, wibDayParts } from '~/lib/format';

/** Agenda publik: tiap baris membuka detail event publik (daftar dari sana). */
export function AgendaList({ activities }: { activities: Activity[] }) {
  return (
    <ul className="rows agenda-rows">
      {activities.map((a) => {
        const parts = a.starts_at ? wibDayParts(a.starts_at) : null;
        return (
          <li key={a.id}>
            <span className="date-tile">
              {parts ? <><b>{parts.day}</b><span>{parts.month}</span></> : <span>TBA</span>}
            </span>
            <div className="row-main">
              <Link className="title" to={activityPath(a)}>{a.title}</Link>
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
