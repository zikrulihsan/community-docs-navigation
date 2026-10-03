import { useEffect, useState, type FormEvent } from 'react';
import { data, Link, useLocation, useRevalidator } from 'react-router';
import type { Route } from './+types/event-detail';
import { activityStatusLabel, canRegister, getPublishedActivityBySlug, type Activity } from '~/lib/activities';
import { loginPath, useAuth } from '~/lib/auth';
import { getEvent } from '~/lib/content.server';
import type { RegistrationStatus } from '~/lib/database.types';
import { formatDate, formatWibDate, formatWibTime, isUpcomingDay } from '~/lib/format';
import { pageMeta } from '~/lib/site';
import { supabase } from '~/lib/supabase';

export const meta: Route.MetaFunction = ({ loaderData }) => {
  if (!loaderData) return pageMeta('Event tidak ditemukan — SWE Growth');
  const { activity, entry } = loaderData;
  const title = activity?.title ?? entry!.title;
  const description = activity?.summary || activity?.description || entry?.description;
  return pageMeta(`${title} — SWE Growth`, description);
};

/** Saat build: activity Supabase diutamakan, fallback ke event markdown. */
export async function loader({ params }: Route.LoaderArgs) {
  const activity = await getPublishedActivityBySlug(params.slug);
  const entry = activity ? null : await getEvent(params.slug);
  if (!activity && !entry) throw data(null, { status: 404 });
  return { activity, entry };
}

/**
 * Di browser: ambil activity terbaru. Activity yang dibuat setelah deploy belum
 * punya HTML prerender — untuk slug seperti itu serverLoader gagal dan kita
 * cukup pakai data dari Supabase.
 */
export async function clientLoader({ params, serverLoader }: Route.ClientLoaderArgs) {
  const activity = await getPublishedActivityBySlug(params.slug);
  if (activity) return { activity, entry: null };
  try {
    return await serverLoader();
  } catch {
    throw data(null, { status: 404 });
  }
}
clientLoader.hydrate = true as const;

export default function EventDetail({ loaderData }: Route.ComponentProps) {
  const { activity, entry } = loaderData;

  const title = activity?.title ?? entry!.title;
  const description = activity?.summary || activity?.description || entry!.description;
  const mode = activity?.mode ?? entry?.mode;
  const location = activity?.location ?? entry?.location;
  const speaker = activity?.speaker ?? entry?.speaker;

  return (
    <>
      <header className="page-hero">
        <div className="wrap">
          <Link className="back" to="/events">← Semua event</Link>
          <span className={`chip${!activity || activity.status === 'registration_open' ? ' green' : ''}`} style={{ marginBottom: 12 }}>
            {activity ? activityStatusLabel[activity.status] : mode}
          </span>
          <h1>{title}</h1>
          <p className="lead">{description}</p>
        </div>
      </header>

      <section className="block">
        <div className="wrap detail-grid">
          <div>
            <dl className="facts">
              <div>
                <dt>Tanggal</dt>
                <dd>
                  {activity?.starts_at ? (
                    <time dateTime={activity.starts_at}>{formatWibDate(activity.starts_at)}</time>
                  ) : entry ? (
                    <time dateTime={entry.date}>{formatDate(entry.date)}</time>
                  ) : (
                    'Segera diumumkan'
                  )}
                </dd>
              </div>
              {(activity?.starts_at || entry?.time) && (
                <div><dt>Waktu</dt><dd>{activity?.starts_at ? formatWibTime(activity.starts_at) : entry!.time}</dd></div>
              )}
              {mode && <div><dt>Format</dt><dd>{mode}</dd></div>}
              {location && <div><dt>Lokasi</dt><dd>{location}</dd></div>}
              {speaker && <div><dt>Pembicara</dt><dd>{speaker}</dd></div>}
              {activity?.capacity && <div><dt>Kapasitas</dt><dd>{activity.capacity} orang</dd></div>}
            </dl>
            <div className="prose">
              {activity?.description && activity.description.split(/\n{2,}/).map((para, i) => <p key={i}>{para}</p>)}
              {entry && <div dangerouslySetInnerHTML={{ __html: entry.html }} />}
            </div>
          </div>
          <div>
            {activity ? (
              <ActivityAction activity={activity} />
            ) : (
              <LegacyRegistration title={title} upcoming={isUpcomingDay(entry!.date)} open={entry!.registrationOpen} url={entry!.registrationUrl} />
            )}
          </div>
        </div>
      </section>
    </>
  );
}

type MemberState = { registration: RegistrationStatus | null; following: boolean };

function useMemberState(activityId: string) {
  const { user } = useAuth();
  const [state, setState] = useState<MemberState | null>(null);

  useEffect(() => {
    if (!user) {
      setState(null);
      return;
    }
    let cancelled = false;
    void (async () => {
      const db = supabase();
      const [reg, interest] = await Promise.all([
        db.from('activity_registrations').select('status').eq('activity_id', activityId).eq('user_id', user.id).maybeSingle(),
        db.from('activity_interests').select('id').eq('activity_id', activityId).eq('user_id', user.id).maybeSingle(),
      ]);
      if (!cancelled) setState({ registration: reg.data?.status ?? null, following: Boolean(interest.data) });
    })();
    return () => {
      cancelled = true;
    };
  }, [user, activityId]);

  return [state, setState] as const;
}

function ActivityAction({ activity }: { activity: Activity }) {
  const { loading, user } = useAuth();
  const { pathname } = useLocation();
  const revalidator = useRevalidator();
  const [member, setMember] = useMemberState(activity.id);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isComingSoon = activity.status === 'coming_soon';
  const open = canRegister(activity);
  const isFull = activity.status === 'full';

  if (!isComingSoon && !open) {
    const done = activity.status === 'completed' || activity.status === 'cancelled';
    return (
      <div className="form-card">
        <h3>{done ? 'Event sudah selesai' : 'Pendaftaran belum dibuka'}</h3>
        <p className="form-sub">
          {done
            ? 'Rekaman biasanya kami unggah ke halaman video beberapa hari setelah acara.'
            : 'Pantau halaman ini atau grup WhatsApp untuk informasi berikutnya.'}
        </p>
        <Link className="btn btn-ghost" to="/videos">Lihat rekaman</Link>
      </div>
    );
  }

  if (loading || (user && !member)) {
    return <div className="form-card"><p className="muted">Memeriksa status pendaftaranmu…</p></div>;
  }

  if (!user) {
    return (
      <div className="form-card">
        <h3>{isComingSoon ? 'Mau diingatkan?' : isFull ? 'Gabung waitlist' : 'Daftar activity ini'}</h3>
        <p className="form-sub">
          Masuk dulu pakai akun Google atau email — gratis, sekali klik. Pendaftaranmu nanti tersimpan di dashboard.
        </p>
        <Link className="btn btn-primary" to={loginPath(pathname)}>
          {isComingSoon ? 'Masuk & ingatkan aku' : 'Masuk untuk daftar'}
        </Link>
      </div>
    );
  }

  const run = async (fn: () => Promise<void>) => {
    setBusy(true);
    setError(null);
    try {
      await fn();
    } catch (e) {
      setError(e instanceof Error && e.message === 'registration_closed'
        ? 'Pendaftaran sudah ditutup.'
        : 'Belum berhasil. Coba lagi sebentar lagi.');
    } finally {
      setBusy(false);
    }
  };

  if (isComingSoon) {
    return (
      <div className="form-card">
        <h3>Ingatkan aku</h3>
        {member!.following ? (
          <p className="form-message success">Sip, kami kabari lewat email ketika jadwal atau pendaftaran dibuka.</p>
        ) : (
          <>
            <p className="form-sub">Kami kabari lewat email ({user.email}) ketika jadwal atau pendaftaran dibuka.</p>
            {error && <p className="form-message error">{error}</p>}
            <button
              className="btn btn-primary"
              type="button"
              disabled={busy}
              onClick={() =>
                run(async () => {
                  const { error: rpcError } = await supabase().rpc('follow_activity', { p_activity_id: activity.id });
                  if (rpcError) throw new Error(rpcError.message);
                  setMember({ ...member!, following: true });
                })
              }
            >
              Ingatkan aku
            </button>
          </>
        )}
      </div>
    );
  }

  const registration = member!.registration;
  if (registration && registration !== 'cancelled') {
    return (
      <div className="form-card">
        <h3>{registration === 'confirmed' ? 'Kamu sudah terdaftar 🎉' : 'Kamu ada di waitlist'}</h3>
        <p className="form-sub">
          {registration === 'confirmed'
            ? 'Detail acara akan kami kirim lewat email/WhatsApp. Jadwalnya juga muncul di dashboard-mu.'
            : 'Kapasitas utama sudah penuh — kami kabari kalau ada kursi kosong.'}
        </p>
        {error && <p className="form-message error">{error}</p>}
        <div className="inline-actions">
          <Link className="btn btn-primary" to="/dashboard">Buka dashboard</Link>
          <button
            className="link-btn"
            type="button"
            disabled={busy}
            onClick={() =>
              run(async () => {
                if (!confirm('Batalkan pendaftaran untuk activity ini?')) return;
                const { error: rpcError } = await supabase().rpc('cancel_activity_registration', { p_activity_id: activity.id });
                if (rpcError) throw new Error(rpcError.message);
                setMember({ ...member!, registration: 'cancelled' });
              })
            }
          >
            Batalkan
          </button>
        </div>
      </div>
    );
  }

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    void run(async () => {
      const { data: rows, error: rpcError } = await supabase().rpc('join_activity', {
        p_activity_id: activity.id,
        p_whatsapp: String(form.get('whatsapp') ?? ''),
        p_note: String(form.get('note') ?? ''),
      });
      if (rpcError) throw new Error(rpcError.message.includes('registration_closed') ? 'registration_closed' : rpcError.message);
      setMember({ ...member!, registration: rows?.[0]?.registration_status ?? 'confirmed' });
      void revalidator.revalidate();
    });
  };

  return (
    <form className="form-card" onSubmit={onSubmit}>
      <h3>{isFull ? 'Gabung waitlist' : 'Daftar activity ini'}</h3>
      <p className="form-sub">
        {isFull
          ? 'Kapasitas utama sudah penuh; kami beri kabar bila ada kursi.'
          : `Daftar sebagai ${user.email}. Detail acara kami kirim ke emailmu.`}
      </p>
      {registration === 'cancelled' && <p className="form-message">Kamu pernah membatalkan pendaftaran ini — boleh daftar lagi.</p>}
      {error && <p className="form-message error">{error}</p>}
      <div className="field">
        <label htmlFor="whatsapp">Nomor WhatsApp <small>(opsional)</small></label>
        <input id="whatsapp" name="whatsapp" type="tel" autoComplete="tel" placeholder="08..." />
      </div>
      <div className="field">
        <label htmlFor="note">Pertanyaan <small>(opsional)</small></label>
        <textarea id="note" name="note" rows={3}></textarea>
      </div>
      <button className="btn btn-primary" type="submit" disabled={busy}>
        {busy ? 'Menyimpan…' : isFull ? 'Masuk waitlist' : 'Daftar sekarang'}
      </button>
    </form>
  );
}

/** Event markdown lama: tetap pakai Netlify Forms (HTML prerender) atau link eksternal. */
function LegacyRegistration({ title, upcoming, open, url }: { title: string; upcoming: boolean; open: boolean; url?: string }) {
  if (!(open && upcoming)) {
    return (
      <div className="form-card">
        <h3>{upcoming ? 'Pendaftaran belum dibuka' : 'Event sudah selesai'}</h3>
        <p className="form-sub">
          {upcoming
            ? 'Pantau halaman ini atau grup WhatsApp untuk informasi berikutnya.'
            : 'Rekaman biasanya kami unggah ke halaman video beberapa hari setelah acara.'}
        </p>
        <Link className="btn btn-ghost" to="/videos">Lihat rekaman</Link>
      </div>
    );
  }

  if (url) {
    return (
      <div className="form-card">
        <h3>Daftar event ini</h3>
        <p className="form-sub">Pendaftaran dibuka lewat halaman eksternal.</p>
        <a className="btn btn-primary" href={url} target="_blank" rel="noopener">Buka form pendaftaran</a>
      </div>
    );
  }

  return (
    <form className="form-card" name="event-registration" method="POST" action="/terima-kasih" data-netlify="true" netlify-honeypot="bot-field">
      <input type="hidden" name="form-name" value="event-registration" />
      <input type="hidden" name="event" value={title} />
      <p className="hidden"><label>Jangan diisi: <input name="bot-field" /></label></p>
      <h3>Daftar event ini</h3>
      <p className="form-sub">Isi data singkat, link acara kami kirim ke emailmu.</p>
      <div className="field"><label htmlFor="name">Nama</label><input id="name" name="name" type="text" required autoComplete="name" /></div>
      <div className="field"><label htmlFor="email">Email</label><input id="email" name="email" type="email" required autoComplete="email" /></div>
      <div className="field"><label htmlFor="whatsapp">Nomor WhatsApp</label><input id="whatsapp" name="whatsapp" type="tel" required autoComplete="tel" placeholder="08..." /></div>
      <button className="btn btn-primary" type="submit">Daftar sekarang</button>
    </form>
  );
}
