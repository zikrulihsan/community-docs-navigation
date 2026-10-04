import { useState, type FormEvent } from 'react';
import { data, Link, useRevalidator } from 'react-router';
import type { Route } from './+types/portal-event';
import { PortalHeader } from '~/components/PortalHeader';
import { activityStatusLabel, canRegister, getPublishedActivityBySlug, type Activity } from '~/lib/activities';
import { requireUser } from '~/lib/auth';
import type { RegistrationStatus } from '~/lib/database.types';
import { formatWibDate, formatWibTime } from '~/lib/format';
import { supabase } from '~/lib/supabase';

export const meta: Route.MetaFunction = ({ loaderData }) => [
  { title: `${loaderData?.activity.title ?? 'Agenda'} — SWE Growth` },
  { name: 'robots', content: 'noindex' },
];

export async function clientLoader({ request, params }: Route.ClientLoaderArgs) {
  const user = await requireUser(request);
  const activity = await getPublishedActivityBySlug(params.slug);
  if (!activity) throw data(null, { status: 404 });

  const db = supabase();
  const [info, reg, interest] = await Promise.all([
    db.rpc('activity_links', { p_activity_id: activity.id }).maybeSingle(),
    db.from('activity_registrations').select('status').eq('activity_id', activity.id).eq('user_id', user.id).maybeSingle(),
    db.from('activity_interests').select('id').eq('activity_id', activity.id).eq('user_id', user.id).maybeSingle(),
  ]);

  return {
    activity,
    info: info.data,
    registration: reg.data?.status ?? null,
    following: Boolean(interest.data),
  };
}

export function HydrateFallback() {
  return <div className="loading-block">Memuat…</div>;
}

type Links = { meeting_url: string | null; recording_url: string | null; has_recording: boolean };

export default function PortalEvent({ loaderData }: Route.ComponentProps) {
  const { activity: a, info } = loaderData;

  return (
    <>
      <PortalHeader />
      <section className="block" style={{ paddingTop: 8 }}>
        <div className="wrap narrow-wrap">
          <Link className="back" to="/portal">← Portal</Link>
          <span className="chip" style={{ marginBottom: 10 }}>{activityStatusLabel[a.status]}</span>
          <h2 className="detail-title">{a.title}</h2>
          {a.summary && <p className="lead">{a.summary}</p>}

          <div className="detail-grid">
            <div>
              <dl className="facts">
                <div><dt>Tanggal</dt><dd>{a.starts_at ? formatWibDate(a.starts_at) : 'Segera diumumkan'}</dd></div>
                {a.starts_at && <div><dt>Waktu</dt><dd>{formatWibTime(a.starts_at)}</dd></div>}
                {a.mode && <div><dt>Format</dt><dd>{a.mode}</dd></div>}
                {a.location && <div><dt>Lokasi</dt><dd>{a.location}</dd></div>}
                {a.speaker && <div><dt>Pembicara</dt><dd>{a.speaker}</dd></div>}
                {a.capacity && <div><dt>Kapasitas</dt><dd>{a.capacity} orang</dd></div>}
              </dl>
              {a.description && (
                <div className="prose" style={{ marginTop: 24 }}>
                  {a.description.split(/\n{2,}/).map((para, i) => <p key={i}>{para}</p>)}
                </div>
              )}
            </div>
            <div>
              <Action activity={a} info={info} registration={loaderData.registration} following={loaderData.following} />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

const errorText = (message: string) =>
  message.includes('registration_closed')
    ? 'Pendaftaran sudah ditutup.'
    : 'Belum berhasil. Coba lagi sebentar lagi.';

function Action({
  activity,
  info,
  registration,
  following,
}: {
  activity: Activity;
  info: Links | null;
  registration: RegistrationStatus | null;
  following: boolean;
}) {
  const revalidator = useRevalidator();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const run = async (fn: () => PromiseLike<{ error: { message: string } | null }>) => {
    setBusy(true);
    setError(null);
    const { error: rpcError } = await fn();
    setBusy(false);
    if (rpcError) {
      setError(errorText(rpcError.message));
      return;
    }
    await revalidator.revalidate();
  };

  const done = activity.status === 'completed' || activity.status === 'cancelled';
  if (done) {
    return (
      <div className="form-card">
        <h3>{activity.status === 'cancelled' ? 'Kegiatan dibatalkan' : 'Kegiatan sudah selesai'}</h3>
        {info?.recording_url ? (
          <a className="btn btn-primary" href={info.recording_url} target="_blank" rel="noopener">Tonton rekaman</a>
        ) : info?.has_recording ? (
          <>
            <p className="form-sub">Rekaman kegiatan ini tersedia untuk verified member.</p>
            <Link className="btn btn-ghost sm" to="/portal/membership">Jadi verified member</Link>
          </>
        ) : (
          <p className="form-sub">Belum ada rekaman untuk kegiatan ini.</p>
        )}
      </div>
    );
  }

  if (activity.status === 'coming_soon') {
    return (
      <div className="form-card">
        <h3>Jadwal belum dibuka</h3>
        {following ? (
          <p className="form-message success">Kamu akan dikabari saat pendaftaran dibuka.</p>
        ) : (
          <>
            <p className="form-sub">Kami kabari lewat email saat jadwal atau pendaftaran dibuka.</p>
            {error && <p className="form-message error">{error}</p>}
            <button className="btn btn-primary" type="button" disabled={busy}
              onClick={() => run(() => supabase().rpc('follow_activity', { p_activity_id: activity.id }))}>
              Ingatkan aku
            </button>
          </>
        )}
      </div>
    );
  }

  if (registration === 'confirmed' || registration === 'waitlisted') {
    return (
      <div className="form-card">
        <h3>{registration === 'confirmed' ? 'Kamu terdaftar' : 'Kamu ada di waitlist'}</h3>
        {registration === 'confirmed' ? (
          info?.meeting_url ? (
            <a className="btn btn-primary" href={info.meeting_url} target="_blank" rel="noopener" style={{ marginBottom: 14 }}>Buka link meeting</a>
          ) : (
            <p className="form-sub">Link meeting akan muncul di halaman ini sebelum acara dimulai.</p>
          )
        ) : (
          <p className="form-sub">Kapasitas utama penuh. Kamu otomatis naik jika ada peserta yang batal.</p>
        )}
        {error && <p className="form-message error">{error}</p>}
        <button className="link-btn" type="button" disabled={busy}
          onClick={() => {
            if (confirm('Batalkan pendaftaran untuk kegiatan ini?')) {
              void run(() => supabase().rpc('cancel_activity_registration', { p_activity_id: activity.id }));
            }
          }}>
          Batalkan pendaftaran
        </button>
      </div>
    );
  }

  if (!canRegister(activity)) {
    return (
      <div className="form-card">
        <h3>Pendaftaran belum dibuka</h3>
        <p className="form-sub">Pantau halaman ini untuk informasi berikutnya.</p>
      </div>
    );
  }

  const isFull = activity.status === 'full';
  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const note = String(new FormData(e.currentTarget).get('note') ?? '');
    void run(() => supabase().rpc('join_activity', { p_activity_id: activity.id, p_note: note }));
  };

  return (
    <form className="form-card" onSubmit={onSubmit}>
      <h3>{isFull ? 'Masuk waitlist' : 'Daftar'}</h3>
      <p className="form-sub">
        {isFull ? 'Kapasitas utama penuh; kamu masuk antrean.' : 'Data akunmu (nama, email, WhatsApp) dipakai untuk pendaftaran.'}
      </p>
      {registration === 'cancelled' && <p className="form-message">Kamu pernah membatalkan pendaftaran ini. Boleh daftar lagi.</p>}
      {error && <p className="form-message error">{error}</p>}
      <div className="field">
        <label htmlFor="note">Pertanyaan untuk pembicara <small>(opsional)</small></label>
        <textarea id="note" name="note" rows={3} maxLength={1000}></textarea>
      </div>
      <button className="btn btn-primary" type="submit" disabled={busy}>
        {busy ? 'Menyimpan…' : isFull ? 'Masuk waitlist' : 'Daftar sekarang'}
      </button>
    </form>
  );
}
