import { useEffect, useState, type FormEvent, type ReactNode } from 'react';
import { Link, useRevalidator, useSearchParams } from 'react-router';
import type { Route } from './+types/admin';
import { ACTIVITY_STATUSES, activityStatusLabel, slugify } from '~/lib/activities';
import { requireAdmin, useAuth } from '~/lib/auth';
import type {
  ActivityMemberInfoRow,
  ActivityRegistrationRow,
  ActivityStatus,
  MembershipRow,
  ProfileRow,
  WhatsappGroupRow,
} from '~/lib/database.types';
import { formatDate, formatWibDate, formatWibTime, isoDate } from '~/lib/format';
import { supabase } from '~/lib/supabase';

export const meta: Route.MetaFunction = () => [{ title: 'Admin — SWE Growth' }, { name: 'robots', content: 'noindex' }];

export async function clientLoader({ request }: Route.ClientLoaderArgs) {
  await requireAdmin(request);
  const db = supabase();

  const [profiles, memberships, activities, memberInfo, groups] = await Promise.all([
    db.from('profiles').select('*').order('created_at', { ascending: false }),
    db.from('memberships').select('*'),
    db.from('activities').select('*').order('created_at', { ascending: false }),
    db.from('activity_member_info').select('*'),
    db.from('whatsapp_groups').select('*').order('sort_order').order('created_at'),
  ]);
  return {
    profiles: profiles.data ?? [],
    memberships: memberships.data ?? [],
    activities: activities.data ?? [],
    memberInfo: memberInfo.data ?? [],
    groups: groups.data ?? [],
  };
}

export function HydrateFallback() {
  return <div className="loading-block">Memuat admin…</div>;
}

const val = (form: FormData, name: string) => String(form.get(name) ?? '').trim();

/** <input type="datetime-local"> diisi dalam WIB. */
const wibToIso = (local: string) => (local ? new Date(`${local}:00+07:00`).toISOString() : null);

/** Tanggal hari ini menurut WIB, yyyy-mm-dd. */
const todayWib = () => isoDate(new Date(Date.now() + 7 * 60 * 60 * 1000));

function useMutation() {
  const revalidator = useRevalidator();
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<{ kind: 'success' | 'error'; text: string } | null>(null);

  const run = async (fn: () => PromiseLike<{ error: { message: string; code?: string } | null }>, success: string) => {
    setBusy(true);
    setMessage(null);
    const { error } = await fn();
    setBusy(false);
    if (error) {
      setMessage({ kind: 'error', text: error.code === '23505' ? 'Slug sudah dipakai. Ganti slug-nya.' : `Belum tersimpan: ${error.message}` });
      return false;
    }
    setMessage({ kind: 'success', text: success });
    await revalidator.revalidate();
    return true;
  };

  const flash = message && <p className={`form-message ${message.kind}`}>{message.text}</p>;
  return { busy, run, flash };
}

type Tab = 'member' | 'event' | 'grup';
const TABS: { id: Tab; label: string }[] = [
  { id: 'member', label: 'Member' },
  { id: 'event', label: 'Event' },
  { id: 'grup', label: 'Grup WhatsApp' },
];

export default function Admin({ loaderData }: Route.ComponentProps) {
  const { user } = useAuth();
  const [params] = useSearchParams();
  const tab = TABS.find((t) => t.id === params.get('tab'))?.id ?? 'member';

  return (
    <section className="block">
      <div className="wrap admin-wrap">
        <h1 className="page-title">Admin</h1>
        <p className="form-sub">Masuk sebagai {user?.email}. Perubahan langsung berlaku tanpa deploy ulang.</p>

        <nav className="member-tabs" aria-label="Bagian admin">
          {TABS.map((t) => (
            <Link key={t.id} to={t.id === 'member' ? '/admin' : `/admin?tab=${t.id}`} aria-current={tab === t.id ? 'page' : undefined}>
              {t.label}
            </Link>
          ))}
        </nav>

        <div style={{ marginTop: 24 }}>
          {tab === 'member' && <MembersAdmin profiles={loaderData.profiles} memberships={loaderData.memberships} />}
          {tab === 'event' && <ActivitiesAdmin activities={loaderData.activities} memberInfo={loaderData.memberInfo} />}
          {tab === 'grup' && <GroupsAdmin groups={loaderData.groups} />}
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Member
// ---------------------------------------------------------------------------

function MembersAdmin({ profiles, memberships }: { profiles: ProfileRow[]; memberships: MembershipRow[] }) {
  const { user } = useAuth();
  const { busy, run, flash } = useMutation();
  const [query, setQuery] = useState('');
  const [editing, setEditing] = useState<string | null>(null);

  const today = todayWib();
  const membershipOf = new Map(memberships.map((m) => [m.user_id, m]));
  const q = query.trim().toLowerCase();
  const matches = (p: ProfileRow) =>
    !q || [p.full_name, p.email, p.whatsapp, p.company].some((v) => v?.toLowerCase().includes(q));

  const rows = profiles.filter(matches);
  const isActive = (p: ProfileRow) => (membershipOf.get(p.id)?.active_until ?? '') >= today;
  const pending = rows.filter((p) => !isActive(p));
  const active = rows.filter(isActive);

  const save = async (e: FormEvent<HTMLFormElement>, userId: string) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const ok = await run(
      () =>
        supabase().from('memberships').upsert({
          user_id: userId,
          active_until: val(form, 'active_until'),
          goakal_ref: val(form, 'goakal_ref') || null,
          note: val(form, 'note') || null,
          activated_by: user?.id ?? null,
          activated_at: new Date().toISOString(),
        }),
      'Membership disimpan.',
    );
    if (ok) setEditing(null);
  };

  const deactivate = (p: ProfileRow) => {
    if (!confirm(`Akhiri membership ${p.full_name || p.email} hari ini? Akses portal langsung tertutup.`)) return;
    const yesterday = isoDate(new Date(Date.parse(today) - 86_400_000));
    void run(() => supabase().from('memberships').update({ active_until: yesterday }).eq('user_id', p.id), 'Membership diakhiri.');
  };

  const renderRow = (p: ProfileRow) => {
    const m = membershipOf.get(p.id);
    return (
      <li key={p.id}>
        <div className="line">
          <div>
            <strong>{p.full_name || '(tanpa nama)'}</strong>
            <span className="slug">{[p.email, p.whatsapp].filter(Boolean).join(' · ')}</span>
            <span className="slug">
              {m
                ? `${m.active_until >= today ? 'aktif sampai' : 'berakhir'} ${formatDate(m.active_until)}${m.goakal_ref ? ` · ${m.goakal_ref}` : ''}`
                : p.onboarded_at ? 'belum aktif' : 'belum isi data'}
            </span>
          </div>
          <div className="inline-actions">
            <button className="btn btn-ghost sm" type="button" onClick={() => setEditing(editing === p.id ? null : p.id)}>
              {m && m.active_until >= today ? 'Ubah' : m ? 'Perpanjang' : 'Aktifkan'}
            </button>
            {m && m.active_until >= today && (
              <button className="link-btn" type="button" disabled={busy} onClick={() => deactivate(p)}>Akhiri</button>
            )}
          </div>
        </div>
        {editing === p.id && (
          <form className="inline-form" onSubmit={(e) => save(e, p.id)}>
            <Field id={`until-${p.id}`} label="Aktif sampai">
              <input id={`until-${p.id}`} name="active_until" type="date" required min={today} defaultValue={m && m.active_until >= today ? m.active_until : ''} />
            </Field>
            <Field id={`ref-${p.id}`} label="Ref. goakal" optional>
              <input id={`ref-${p.id}`} name="goakal_ref" maxLength={120} defaultValue={m?.goakal_ref ?? ''} placeholder="No. order / invoice" />
            </Field>
            <Field id={`note-${p.id}`} label="Catatan" optional>
              <input id={`note-${p.id}`} name="note" maxLength={500} defaultValue={m?.note ?? ''} />
            </Field>
            <button className="btn btn-primary sm" type="submit" disabled={busy}>Simpan</button>
          </form>
        )}
      </li>
    );
  };

  return (
    <div className="admin-stack">
      <div className="field" style={{ maxWidth: 420 }}>
        <label htmlFor="member-search">Cari nama, email, atau WhatsApp</label>
        <input id="member-search" type="search" value={query} onChange={(e) => setQuery(e.target.value)} />
      </div>
      {flash}
      <div className="panel">
        <h2>Belum aktif ({pending.length})</h2>
        <p className="form-sub">Akun yang sudah login tapi belum punya membership aktif. Cocokkan dengan pembayaran di goakal.</p>
        {pending.length === 0 ? <p className="muted">Tidak ada.</p> : <ul className="admin-list">{pending.map(renderRow)}</ul>}
      </div>
      <div className="panel">
        <h2>Member aktif ({active.length})</h2>
        {active.length === 0 ? <p className="muted">Belum ada.</p> : <ul className="admin-list">{active.map(renderRow)}</ul>}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Event
// ---------------------------------------------------------------------------

type Activities = Route.ComponentProps['loaderData']['activities'];

function ActivitiesAdmin({ activities, memberInfo }: { activities: Activities; memberInfo: ActivityMemberInfoRow[] }) {
  const { busy, run, flash } = useMutation();
  const [openRegs, setOpenRegs] = useState<string | null>(null);
  const [openLinks, setOpenLinks] = useState<string | null>(null);
  const infoOf = new Map(memberInfo.map((i) => [i.activity_id, i]));

  const create = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formEl = e.currentTarget;
    const form = new FormData(formEl);
    const title = val(form, 'title');
    const capacityRaw = val(form, 'capacity');
    const ok = await run(
      () =>
        supabase().from('activities').insert({
          title,
          slug: slugify(val(form, 'slug') || title),
          summary: val(form, 'summary'),
          description: val(form, 'description'),
          status: val(form, 'status') as ActivityStatus,
          mode: val(form, 'mode') as 'online' | 'offline' | 'hybrid',
          starts_at: wibToIso(val(form, 'starts_at')),
          location: val(form, 'location') || null,
          speaker: val(form, 'speaker') || null,
          capacity: capacityRaw ? Number.parseInt(capacityRaw, 10) : null,
          is_public: form.get('is_public') === 'on',
        }),
      'Event dibuat.',
    );
    if (ok) formEl.reset();
  };

  const saveLinks = async (e: FormEvent<HTMLFormElement>, activityId: string) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const ok = await run(
      () =>
        supabase().from('activity_member_info').upsert({
          activity_id: activityId,
          meeting_url: val(form, 'meeting_url') || null,
          recording_url: val(form, 'recording_url') || null,
          updated_at: new Date().toISOString(),
        }),
      'Link member disimpan.',
    );
    if (ok) setOpenLinks(null);
  };

  return (
    <div className="admin-grid">
      <form className="form-card" onSubmit={create}>
        <h2>Tambah event</h2>
        <p className="form-sub">Judul, tanggal, dan format tampil di agenda publik. Detail, pendaftaran, dan link hanya untuk member.</p>
        {flash}
        <Field id="title" label="Judul"><input id="title" name="title" required minLength={3} /></Field>
        <Field id="slug" label="Slug URL" optional><input id="slug" name="slug" placeholder="otomatis dari judul" /></Field>
        <Field id="summary" label="Ringkasan"><textarea id="summary" name="summary" rows={2} maxLength={500} /></Field>
        <Field id="description" label="Detail"><textarea id="description" name="description" rows={5} /></Field>
        <div className="form-grid">
          <Field id="status" label="Status">
            <select id="status" name="status" defaultValue="registration_open">
              {ACTIVITY_STATUSES.map((s) => <option key={s} value={s}>{activityStatusLabel[s]}</option>)}
            </select>
          </Field>
          <Field id="mode" label="Format">
            <select id="mode" name="mode" defaultValue="online">
              <option value="online">Online</option><option value="offline">Offline</option><option value="hybrid">Hybrid</option>
            </select>
          </Field>
          <Field id="starts_at" label="Mulai (WIB)" optional><input id="starts_at" name="starts_at" type="datetime-local" /></Field>
          <Field id="capacity" label="Kapasitas" optional><input id="capacity" name="capacity" type="number" min={1} inputMode="numeric" placeholder="tanpa batas" /></Field>
          <Field id="location" label="Lokasi" optional><input id="location" name="location" placeholder="Kota / venue (bukan link meeting)" /></Field>
          <Field id="speaker" label="Pembicara" optional><input id="speaker" name="speaker" /></Field>
        </div>
        <label className="check-field"><input type="checkbox" name="is_public" defaultChecked /> Tampilkan di agenda</label>
        <button className="btn btn-primary" type="submit" disabled={busy}>Simpan event</button>
      </form>

      <div className="panel">
        <h2>Event tersimpan</h2>
        {activities.length === 0 ? (
          <p className="form-sub">Belum ada event.</p>
        ) : (
          <ul className="admin-list">
            {activities.map((a) => {
              const info = infoOf.get(a.id);
              return (
                <li key={a.id}>
                  <div className="line">
                    <div>
                      <strong>{a.title}{!a.is_public && <span className="muted"> · disembunyikan</span>}</strong>
                      <Link className="slug" to={`/portal/agenda/${a.slug}`}>/portal/agenda/{a.slug}</Link>
                      {a.starts_at && <span className="slug"> · {formatWibDate(a.starts_at)} {formatWibTime(a.starts_at)}</span>}
                    </div>
                    <select
                      aria-label={`Status ${a.title}`}
                      value={a.status}
                      disabled={busy}
                      onChange={(e) =>
                        run(() => supabase().from('activities').update({ status: e.target.value as ActivityStatus }).eq('id', a.id), `Status "${a.title}" diperbarui.`)
                      }
                    >
                      {ACTIVITY_STATUSES.map((s) => <option key={s} value={s}>{activityStatusLabel[s]}</option>)}
                    </select>
                  </div>
                  <div className="inline-actions">
                    <button className="link-btn" type="button" onClick={() => setOpenRegs(openRegs === a.id ? null : a.id)}>
                      {openRegs === a.id ? 'Tutup pendaftar' : 'Pendaftar'}
                    </button>
                    <button className="link-btn" type="button" onClick={() => setOpenLinks(openLinks === a.id ? null : a.id)}>
                      Link meeting & rekaman{info?.meeting_url || info?.recording_url ? ' ✓' : ''}
                    </button>
                  </div>
                  {openRegs === a.id && <Registrants activityId={a.id} />}
                  {openLinks === a.id && (
                    <form className="inline-form" onSubmit={(e) => saveLinks(e, a.id)}>
                      <Field id={`meet-${a.id}`} label="Link meeting" optional>
                        <input id={`meet-${a.id}`} name="meeting_url" type="url" pattern="https://.*" defaultValue={info?.meeting_url ?? ''} placeholder="https://meet.google.com/…" />
                      </Field>
                      <Field id={`rec-${a.id}`} label="Link rekaman" optional>
                        <input id={`rec-${a.id}`} name="recording_url" type="url" pattern="https://.*" defaultValue={info?.recording_url ?? ''} placeholder="https://youtu.be/…" />
                      </Field>
                      <button className="btn btn-primary sm" type="submit" disabled={busy}>Simpan link</button>
                    </form>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}

function Registrants({ activityId }: { activityId: string }) {
  const [rows, setRows] = useState<ActivityRegistrationRow[] | null>(null);

  useEffect(() => {
    let cancelled = false;
    void supabase()
      .from('activity_registrations')
      .select('*')
      .eq('activity_id', activityId)
      .order('created_at')
      .then(({ data }) => !cancelled && setRows(data ?? []));
    return () => {
      cancelled = true;
    };
  }, [activityId]);

  if (!rows) return <div className="registrants">Memuat…</div>;
  if (rows.length === 0) return <div className="registrants">Belum ada pendaftar.</div>;

  const counts = rows.reduce<Record<string, number>>((acc, r) => ({ ...acc, [r.status]: (acc[r.status] ?? 0) + 1 }), {});
  return (
    <div className="registrants">
      <p style={{ marginBottom: 6 }}>
        {counts.confirmed ?? 0} terdaftar · {counts.waitlisted ?? 0} waitlist · {counts.cancelled ?? 0} batal
      </p>
      <table>
        <tbody>
          {rows.map((r) => (
            <tr key={r.id} style={r.status === 'cancelled' ? { opacity: 0.5 } : undefined}>
              <td>{r.name}</td>
              <td>{r.email}</td>
              <td>{r.whatsapp ?? '—'}</td>
              <td>{r.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Grup WhatsApp
// ---------------------------------------------------------------------------

function GroupsAdmin({ groups }: { groups: WhatsappGroupRow[] }) {
  const { busy, run, flash } = useMutation();

  const create = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formEl = e.currentTarget;
    const form = new FormData(formEl);
    const ok = await run(
      () =>
        supabase().from('whatsapp_groups').insert({
          name: val(form, 'name'),
          description: val(form, 'description'),
          invite_url: val(form, 'invite_url'),
          sort_order: Number.parseInt(val(form, 'sort_order') || '0', 10),
        }),
      'Grup ditambahkan. Langsung terlihat di portal member.',
    );
    if (ok) formEl.reset();
  };

  const remove = (g: WhatsappGroupRow) => {
    if (!confirm(`Hapus grup "${g.name}" dari portal?`)) return;
    void run(() => supabase().from('whatsapp_groups').delete().eq('id', g.id), 'Grup dihapus dari portal.');
  };

  return (
    <div className="admin-grid">
      <form className="form-card" onSubmit={create}>
        <h2>Tambah grup</h2>
        <p className="form-sub">Link invite hanya terlihat oleh member aktif.</p>
        {flash}
        <Field id="g_name" label="Nama grup"><input id="g_name" name="name" required minLength={2} maxLength={80} /></Field>
        <Field id="g_desc" label="Keterangan" optional><input id="g_desc" name="description" maxLength={300} /></Field>
        <Field id="g_url" label="Link invite"><input id="g_url" name="invite_url" type="url" required pattern="https://.*" placeholder="https://chat.whatsapp.com/…" /></Field>
        <Field id="g_order" label="Urutan" optional><input id="g_order" name="sort_order" type="number" defaultValue={groups.length + 1} /></Field>
        <button className="btn btn-primary" type="submit" disabled={busy}>Simpan grup</button>
      </form>

      <div className="panel">
        <h2>Grup di portal</h2>
        {groups.length === 0 ? (
          <p className="form-sub">Belum ada grup.</p>
        ) : (
          <ul className="admin-list">
            {groups.map((g) => (
              <li key={g.id}>
                <div className="line">
                  <div>
                    <strong>{g.sort_order}. {g.name}</strong>
                    <span className="slug">{g.invite_url}</span>
                  </div>
                  <button className="link-btn" type="button" disabled={busy} onClick={() => remove(g)}>Hapus</button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function Field({ id, label, optional, children }: { id: string; label: string; optional?: boolean; children: ReactNode }) {
  return (
    <div className="field">
      <label htmlFor={id}>{label}{optional && <small> (opsional)</small>}</label>
      {children}
    </div>
  );
}
