import { useEffect, useState, type FormEvent, type ReactNode } from 'react';
import { Link, useRevalidator, useSearchParams } from 'react-router';
import type { Route } from './+types/admin';
import { ACTIVITY_STATUSES, activityStatusLabel } from '~/lib/activities';
import { requireAdmin, useAuth } from '~/lib/auth';
import { levelLabel, slugify } from '~/lib/courses';
import type { ActivityRegistrationRow, ActivityStatus, CourseLevel, LessonRow } from '~/lib/database.types';
import { formatWibDate, formatWibTime } from '~/lib/format';
import { supabase } from '~/lib/supabase';

export const meta: Route.MetaFunction = () => [{ title: 'Admin — SWE Growth' }, { name: 'robots', content: 'noindex' }];

export async function clientLoader({ request }: Route.ClientLoaderArgs) {
  await requireAdmin(request);
  const url = new URL(request.url);
  const courseId = url.searchParams.get('course');
  const db = supabase();

  const [activities, courses, lessons] = await Promise.all([
    db.from('activities').select('*').order('created_at', { ascending: false }),
    db.from('courses').select('*').order('sort_order').order('created_at'),
    courseId
      ? db.from('course_lessons').select('*').eq('course_id', courseId).order('position').order('created_at')
      : Promise.resolve({ data: [] as LessonRow[] }),
  ]);
  return { activities: activities.data ?? [], courses: courses.data ?? [], lessons: lessons.data ?? [] };
}

export function HydrateFallback() {
  return <div className="loading-block">Memuat admin…</div>;
}

const val = (form: FormData, name: string) => String(form.get(name) ?? '').trim();

/** <input type="datetime-local"> diisi dalam WIB. */
const wibToIso = (local: string) => (local ? new Date(`${local}:00+07:00`).toISOString() : null);

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

export default function Admin({ loaderData }: Route.ComponentProps) {
  const { user } = useAuth();
  const [params] = useSearchParams();
  const tab = params.get('tab') === 'course' ? 'course' : 'activity';

  return (
    <section className="block">
      <div className="wrap admin-wrap">
        <span className="eyebrow">Admin workspace</span>
        <h1 style={{ margin: '4px 0 6px' }}>Kelola platform</h1>
        <p className="form-sub">Masuk sebagai {user?.email}. Perubahan langsung tampil di situs tanpa deploy ulang.</p>

        <nav className="member-tabs" aria-label="Bagian admin">
          <Link to="/admin" aria-current={tab === 'activity' ? 'page' : undefined}>Event & activity</Link>
          <Link to="/admin?tab=course" aria-current={tab === 'course' ? 'page' : undefined}>Course & materi</Link>
        </nav>

        <div style={{ marginTop: 24 }}>
          {tab === 'activity' ? <ActivitiesAdmin activities={loaderData.activities} /> : <CoursesAdmin {...loaderData} />}
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Activities
// ---------------------------------------------------------------------------

type Activities = Route.ComponentProps['loaderData']['activities'];

function ActivitiesAdmin({ activities }: { activities: Activities }) {
  const { busy, run, flash } = useMutation();
  const [openRegs, setOpenRegs] = useState<string | null>(null);

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
          activity_type: val(form, 'activity_type') || 'event',
          status: val(form, 'status') as ActivityStatus,
          mode: val(form, 'mode') as 'online' | 'offline' | 'hybrid',
          starts_at: wibToIso(val(form, 'starts_at')),
          location: val(form, 'location') || null,
          speaker: val(form, 'speaker') || null,
          capacity: capacityRaw ? Number.parseInt(capacityRaw, 10) : null,
          is_public: form.get('is_public') === 'on',
        }),
      'Activity dibuat dan langsung muncul sesuai status publiknya.',
    );
    if (ok) formEl.reset();
  };

  return (
    <div className="admin-grid">
      <form className="form-card" onSubmit={create}>
        <h2>Tambah activity</h2>
        <p className="form-sub">Untuk teaser, pilih <em>coming soon</em> dan biarkan jadwal kosong.</p>
        {flash}
        <Field id="title" label="Judul"><input id="title" name="title" required minLength={3} /></Field>
        <Field id="slug" label="Slug URL" optional><input id="slug" name="slug" placeholder="otomatis dari judul" /></Field>
        <Field id="summary" label="Ringkasan"><textarea id="summary" name="summary" rows={2} maxLength={500} /></Field>
        <Field id="description" label="Detail"><textarea id="description" name="description" rows={5} /></Field>
        <div className="form-grid">
          <Field id="status" label="Status">
            <select id="status" name="status" defaultValue="coming_soon">
              {ACTIVITY_STATUSES.map((s) => <option key={s} value={s}>{activityStatusLabel[s]}</option>)}
            </select>
          </Field>
          <Field id="activity_type" label="Tipe">
            <select id="activity_type" name="activity_type" defaultValue="event">
              <option value="event">Event</option><option value="class">Kelas</option><option value="workshop">Workshop</option>
              <option value="mentorship">Mentorship</option><option value="other">Lainnya</option>
            </select>
          </Field>
          <Field id="mode" label="Mode">
            <select id="mode" name="mode" defaultValue="online">
              <option value="online">Online</option><option value="offline">Offline</option><option value="hybrid">Hybrid</option>
            </select>
          </Field>
          <Field id="starts_at" label="Mulai (WIB)" optional><input id="starts_at" name="starts_at" type="datetime-local" /></Field>
          <Field id="location" label="Lokasi / link"><input id="location" name="location" placeholder="Akan diumumkan" /></Field>
          <Field id="speaker" label="Pembicara"><input id="speaker" name="speaker" /></Field>
          <Field id="capacity" label="Kapasitas"><input id="capacity" name="capacity" type="number" min={1} inputMode="numeric" placeholder="Kosong = tanpa batas" /></Field>
        </div>
        <label className="check-field"><input type="checkbox" name="is_public" defaultChecked /> Tampilkan ke publik</label>
        <button className="btn btn-primary" type="submit" disabled={busy}>Simpan activity</button>
      </form>

      <div className="panel">
        <h2>Activity tersimpan</h2>
        {activities.length === 0 ? (
          <p className="form-sub">Belum ada. Activity pertama bisa langsung dibuat dari form ini.</p>
        ) : (
          <ul className="admin-list">
            {activities.map((a) => (
              <li key={a.id}>
                <div className="line">
                  <div>
                    <strong>{a.title}{!a.is_public && <span className="muted"> · draft</span>}</strong>
                    <Link className="slug" to={`/events/${a.slug}`}>/events/{a.slug}</Link>
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
                    {openRegs === a.id ? 'Tutup pendaftar' : 'Lihat pendaftar'}
                  </button>
                </div>
                {openRegs === a.id && <Registrants activityId={a.id} />}
              </li>
            ))}
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
// Courses
// ---------------------------------------------------------------------------

function CoursesAdmin({ courses, lessons }: Route.ComponentProps['loaderData']) {
  const [params, setParams] = useSearchParams();
  const selectedId = params.get('course');
  const selected = courses.find((c) => c.id === selectedId) ?? null;
  const { busy, run, flash } = useMutation();

  const createCourse = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formEl = e.currentTarget;
    const form = new FormData(formEl);
    const title = val(form, 'title');
    const ok = await run(
      () =>
        supabase().from('courses').insert({
          title,
          slug: slugify(val(form, 'slug') || title),
          summary: val(form, 'summary'),
          description: val(form, 'description'),
          level: val(form, 'level') as CourseLevel,
          instructor: val(form, 'instructor') || null,
          cover_url: val(form, 'cover_url') || null,
          is_published: false,
        }),
      'Course dibuat sebagai draft. Tambahkan lesson, lalu terbitkan.',
    );
    if (ok) formEl.reset();
  };

  return (
    <div className="admin-grid">
      <div className="dash-col">
        <div className="panel">
          <h2>Course</h2>
          {flash}
          {courses.length === 0 ? (
            <p className="form-sub">Belum ada course.</p>
          ) : (
            <ul className="admin-list">
              {courses.map((c) => (
                <li key={c.id}>
                  <div className="line">
                    <div>
                      <strong>{c.title}{!c.is_published && <span className="muted"> · draft</span>}</strong>
                      <Link className="slug" to={`/courses/${c.slug}`}>/courses/{c.slug}</Link>
                    </div>
                    <div className="inline-actions">
                      <button
                        className={`btn btn-ghost sm${c.id === selectedId ? ' selected' : ''}`}
                        type="button"
                        onClick={() => setParams({ tab: 'course', course: c.id })}
                      >
                        Lesson
                      </button>
                      <button
                        className="btn btn-ghost sm"
                        type="button"
                        disabled={busy}
                        onClick={() =>
                          run(
                            () => supabase().from('courses').update({ is_published: !c.is_published }).eq('id', c.id),
                            c.is_published ? `"${c.title}" dikembalikan ke draft.` : `"${c.title}" sudah terbit.`,
                          )
                        }
                      >
                        {c.is_published ? 'Jadikan draft' : 'Terbitkan'}
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <form className="form-card" onSubmit={createCourse}>
          <h2>Course baru</h2>
          <p className="form-sub">Dibuat sebagai draft — hanya admin yang bisa melihat sampai diterbitkan.</p>
          <Field id="c_title" label="Judul"><input id="c_title" name="title" required minLength={3} /></Field>
          <Field id="c_slug" label="Slug URL" optional><input id="c_slug" name="slug" placeholder="otomatis dari judul" /></Field>
          <Field id="c_summary" label="Ringkasan"><textarea id="c_summary" name="summary" rows={2} maxLength={300} /></Field>
          <Field id="c_description" label="Deskripsi"><textarea id="c_description" name="description" rows={4} /></Field>
          <div className="form-grid">
            <Field id="c_level" label="Level">
              <select id="c_level" name="level" defaultValue="all">
                {(Object.keys(levelLabel) as CourseLevel[]).map((l) => <option key={l} value={l}>{levelLabel[l]}</option>)}
              </select>
            </Field>
            <Field id="c_instructor" label="Mentor"><input id="c_instructor" name="instructor" /></Field>
          </div>
          <Field id="c_cover" label="URL cover" optional><input id="c_cover" name="cover_url" type="url" placeholder="https://…" /></Field>
          <button className="btn btn-primary" type="submit" disabled={busy}>Buat course</button>
        </form>
      </div>

      {selected ? (
        <LessonsAdmin key={selected.id} courseId={selected.id} courseTitle={selected.title} lessons={lessons} />
      ) : (
        <div className="panel"><p className="form-sub">Pilih <strong>Lesson</strong> pada salah satu course untuk mengelola materinya.</p></div>
      )}
    </div>
  );
}

function LessonsAdmin({ courseId, courseTitle, lessons }: { courseId: string; courseTitle: string; lessons: LessonRow[] }) {
  const [editing, setEditing] = useState<LessonRow | 'new' | null>(null);
  const { busy, run, flash } = useMutation();

  const save = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const title = val(form, 'title');
    const duration = val(form, 'duration_minutes');
    const row = {
      title,
      slug: slugify(val(form, 'slug') || title),
      summary: val(form, 'summary'),
      body_md: String(form.get('body_md') ?? ''),
      video_url: val(form, 'video_url') || null,
      duration_minutes: duration ? Number.parseInt(duration, 10) : null,
      position: Number.parseInt(val(form, 'position') || '0', 10),
      is_preview: form.get('is_preview') === 'on',
      is_published: form.get('is_published') === 'on',
    };
    const ok = await run(
      () =>
        editing === 'new'
          ? supabase().from('course_lessons').insert({ ...row, course_id: courseId })
          : supabase().from('course_lessons').update(row).eq('id', (editing as LessonRow).id),
      editing === 'new' ? 'Lesson ditambahkan.' : 'Lesson diperbarui.',
    );
    if (ok) setEditing(null);
  };

  const remove = (lesson: LessonRow) => {
    if (!confirm(`Hapus lesson "${lesson.title}"? Progress member untuk lesson ini ikut terhapus.`)) return;
    void run(() => supabase().from('course_lessons').delete().eq('id', lesson.id), 'Lesson dihapus.');
  };

  if (editing) {
    const l = editing === 'new' ? null : editing;
    const nextPosition = lessons.length ? Math.max(...lessons.map((x) => x.position)) + 1 : 1;
    return (
      <form className="form-card" onSubmit={save}>
        <h2>{l ? 'Edit lesson' : 'Lesson baru'}</h2>
        <p className="form-sub">{courseTitle}</p>
        {flash}
        <Field id="l_title" label="Judul"><input id="l_title" name="title" required minLength={3} defaultValue={l?.title} /></Field>
        <div className="form-grid">
          <Field id="l_slug" label="Slug" optional><input id="l_slug" name="slug" defaultValue={l?.slug} placeholder="otomatis dari judul" /></Field>
          <Field id="l_position" label="Urutan"><input id="l_position" name="position" type="number" defaultValue={l?.position ?? nextPosition} /></Field>
          <Field id="l_video" label="URL video" optional><input id="l_video" name="video_url" type="url" defaultValue={l?.video_url ?? ''} placeholder="https://youtu.be/…" /></Field>
          <Field id="l_duration" label="Durasi (menit)" optional><input id="l_duration" name="duration_minutes" type="number" min={1} defaultValue={l?.duration_minutes ?? ''} /></Field>
        </div>
        <Field id="l_summary" label="Ringkasan"><input id="l_summary" name="summary" defaultValue={l?.summary} /></Field>
        <Field id="l_body" label="Materi (markdown)">
          <textarea id="l_body" name="body_md" rows={14} defaultValue={l?.body_md} style={{ fontFamily: 'var(--font-mono)', fontSize: '.85rem' }} />
        </Field>
        <label className="check-field"><input type="checkbox" name="is_preview" defaultChecked={l?.is_preview ?? false} /> Preview — bisa dibuka tanpa login</label>
        <label className="check-field"><input type="checkbox" name="is_published" defaultChecked={l?.is_published ?? true} /> Tampilkan di course</label>
        <div className="inline-actions">
          <button className="btn btn-primary" type="submit" disabled={busy}>Simpan lesson</button>
          <button className="btn btn-ghost" type="button" onClick={() => setEditing(null)}>Batal</button>
        </div>
      </form>
    );
  }

  return (
    <div className="panel">
      <div className="panel-head">
        <h2>Lesson · {courseTitle}</h2>
        <button className="btn btn-primary sm" type="button" onClick={() => setEditing('new')}>Tambah lesson</button>
      </div>
      {flash}
      {lessons.length === 0 ? (
        <p className="form-sub">Belum ada lesson.</p>
      ) : (
        <ul className="admin-list">
          {lessons.map((l) => (
            <li key={l.id}>
              <div className="line">
                <div>
                  <strong>{l.position}. {l.title}</strong>
                  <span className="slug">
                    {l.slug}
                    {l.is_preview && ' · preview'}
                    {!l.is_published && ' · disembunyikan'}
                  </span>
                </div>
                <div className="inline-actions">
                  <button className="btn btn-ghost sm" type="button" onClick={() => setEditing(l)}>Edit</button>
                  <button className="link-btn" type="button" onClick={() => remove(l)} disabled={busy}>Hapus</button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
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
