import { Link } from 'react-router';
import type { Route } from './+types/portal';
import { PortalHeader } from '~/components/PortalHeader';
import { activityPath, activityStatusLabel, isActivityUpcoming, registeredPath, type Activity } from '~/lib/activities';
import { requireUser } from '~/lib/auth';
import type { RegistrationStatus } from '~/lib/database.types';
import { formatWibTime, relativeFromNow, wibDayParts } from '~/lib/format';
import { supabase } from '~/lib/supabase';

export const meta: Route.MetaFunction = () => [{ title: 'Portal — SWE Growth' }, { name: 'robots', content: 'noindex' }];

export async function clientLoader({ request }: Route.ClientLoaderArgs) {
  const user = await requireUser(request);
  const db = supabase();

  const [regs, activities, groups] = await Promise.all([
    db.from('activity_registrations').select('activity_id, status').eq('user_id', user.id).neq('status', 'cancelled'),
    db.from('activities').select('*').eq('is_public', true).order('starts_at', { ascending: true, nullsFirst: false }),
    db.from('whatsapp_groups').select('*').order('sort_order').order('created_at'),
  ]);

  const upcoming = (activities.data ?? []).filter(isActivityUpcoming);
  const statusById = new Map((regs.data ?? []).map((r) => [r.activity_id, r.status]));

  return {
    mine: upcoming
      .filter((a) => statusById.has(a.id))
      .map((a) => ({ activity: a, status: statusById.get(a.id)! })),
    others: upcoming.filter((a) => !statusById.has(a.id)),
    groups: groups.data ?? [],
  };
}

export function HydrateFallback() {
  return <div className="loading-block">Memuat portal…</div>;
}

const registrationLabel: Record<RegistrationStatus, string> = {
  confirmed: 'terdaftar',
  waitlisted: 'waitlist',
  cancelled: 'batal',
};

export default function Portal({ loaderData }: Route.ComponentProps) {
  const { mine, others, groups } = loaderData;
  const empty = mine.length === 0 && others.length === 0 && groups.length === 0;

  return (
    <>
      <PortalHeader />
      <section className="block" style={{ paddingTop: 8 }}>
        <div className="wrap narrow-wrap portal-stack">
          {empty && <p className="muted">Belum ada agenda atau grup. Saat admin menambahkannya, semuanya muncul di halaman ini.</p>}

          {mine.length > 0 && (
            <div className="panel">
              <div className="panel-head"><h2>Kegiatan yang kamu ikuti</h2></div>
              <EventRows items={mine.map((m) => ({ activity: m.activity, tag: registrationLabel[m.status], href: registeredPath(m.activity) }))} />
            </div>
          )}

          {others.length > 0 && (
            <div className="panel">
              <div className="panel-head"><h2>Agenda</h2></div>
              <EventRows items={others.map((a) => ({ activity: a, tag: activityStatusLabel[a.status], href: activityPath(a) }))} />
            </div>
          )}

          {groups.length > 0 && (
            <div className="panel">
              <div className="panel-head"><h2>Grup WhatsApp member</h2></div>
              <ul className="rows">
                {groups.map((g) => (
                  <li key={g.id}>
                    <div className="row-main">
                      <strong>{g.name}</strong>
                      {g.description && <span>{g.description}</span>}
                    </div>
                    <a className="btn btn-ghost sm" href={g.invite_url} target="_blank" rel="noopener">Gabung</a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </section>
    </>
  );
}

function EventRows({ items }: { items: { activity: Activity; tag: string; href: string }[] }) {
  return (
    <ul className="rows">
      {items.map(({ activity: a, tag, href }) => {
        const parts = a.starts_at ? wibDayParts(a.starts_at) : null;
        return (
          <li key={a.id}>
            <span className="date-tile">
              {parts ? <><b>{parts.day}</b><span>{parts.month}</span></> : <span>TBA</span>}
            </span>
            <div className="row-main">
              <Link className="title" to={href}>{a.title}</Link>
              <span>
                {[a.starts_at && `${relativeFromNow(a.starts_at)} · ${formatWibTime(a.starts_at)}`, a.mode].filter(Boolean).join(' · ') || 'Jadwal menyusul'}
              </span>
            </div>
            <span className="chip">{tag}</span>
          </li>
        );
      })}
    </ul>
  );
}
