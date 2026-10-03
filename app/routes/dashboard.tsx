import { Link } from 'react-router';
import type { Route } from './+types/dashboard';
import { Avatar } from '~/components/Avatar';
import { MemberHeader } from '~/components/MemberHeader';
import { activityStatusLabel, isActivityUpcoming, type Activity } from '~/lib/activities';
import { displayName, requireUser, useAuth } from '~/lib/auth';
import { getCourseStats, levelLabel, type Course } from '~/lib/courses';
import type { RegistrationStatus } from '~/lib/database.types';
import { formatWibTime, relativeFromNow, wibDayParts } from '~/lib/format';
import { supabase } from '~/lib/supabase';

export const meta: Route.MetaFunction = () => [{ title: 'Dashboard — SWE Growth' }];

type MyEvent = { activity: Activity; status: RegistrationStatus };
type MyCourse = { course: Course; done: number; total: number; lastAt: string };

export async function clientLoader({ request }: Route.ClientLoaderArgs) {
  const user = await requireUser(request);
  const db = supabase();

  const [regs, progress, activities, courses, stats] = await Promise.all([
    db.from('activity_registrations').select('activity_id, status').eq('user_id', user.id).neq('status', 'cancelled'),
    db.from('lesson_progress').select('lesson_id, completed_at').order('completed_at', { ascending: false }),
    db.from('activities').select('*').eq('is_public', true).order('starts_at', { ascending: true, nullsFirst: false }),
    db.from('courses').select('*').eq('is_published', true).order('sort_order'),
    getCourseStats(),
  ]);

  const activityById = new Map((activities.data ?? []).map((a) => [a.id, a]));
  const myEvents: MyEvent[] = (regs.data ?? [])
    .map((r) => ({ activity: activityById.get(r.activity_id)!, status: r.status }))
    .filter((e) => e.activity && isActivityUpcoming(e.activity));
  const registeredIds = new Set((regs.data ?? []).map((r) => r.activity_id));
  const suggestedEvents = (activities.data ?? [])
    .filter((a) => isActivityUpcoming(a) && !registeredIds.has(a.id))
    .slice(0, 3);

  // Progress per course: lesson yang selesai → course-nya.
  const lessonIds = (progress.data ?? []).map((p) => p.lesson_id);
  const lessons = lessonIds.length
    ? (await db.from('course_lessons').select('id, course_id').in('id', lessonIds)).data ?? []
    : [];
  const courseOfLesson = new Map(lessons.map((l) => [l.id, l.course_id]));
  const perCourse = new Map<string, { done: number; lastAt: string }>();
  for (const p of progress.data ?? []) {
    const courseId = courseOfLesson.get(p.lesson_id);
    if (!courseId) continue;
    const entry = perCourse.get(courseId) ?? { done: 0, lastAt: p.completed_at };
    entry.done += 1;
    perCourse.set(courseId, entry);
  }
  const myCourses: MyCourse[] = (courses.data ?? [])
    .filter((c) => perCourse.has(c.id))
    .map((c) => ({ course: c, ...perCourse.get(c.id)!, total: stats.get(c.id)?.lesson_count ?? 0 }))
    .sort((a, b) => b.lastAt.localeCompare(a.lastAt));
  const suggestedCourses = (courses.data ?? []).filter((c) => !perCourse.has(c.id)).slice(0, 3);

  return { myEvents, suggestedEvents, myCourses, suggestedCourses };
}

export function HydrateFallback() {
  return <div className="loading-block">Memuat dashboard…</div>;
}

export default function Dashboard({ loaderData }: Route.ComponentProps) {
  const { myEvents, suggestedEvents, myCourses, suggestedCourses } = loaderData;
  const { user, profile } = useAuth();
  const name = displayName(profile, user);

  const checklist = [
    { label: 'Isi headline & level', done: Boolean(profile?.headline && profile?.seniority) },
    { label: 'Tambahkan skill', done: (profile?.skills.length ?? 0) > 0 },
    { label: 'Tulis bio singkat', done: Boolean(profile?.bio) },
    { label: 'Hubungkan LinkedIn atau GitHub', done: Boolean(profile?.linkedin_url || profile?.github_url) },
  ];
  const profileDone = checklist.every((c) => c.done);

  return (
    <>
      <MemberHeader />
      <section className="block" style={{ paddingTop: 22 }}>
        <div className="wrap dash-grid">
          <div className="dash-col">
            <div className="panel">
              <div className="panel-head">
                <h2>Lanjutkan belajar</h2>
                <Link to="/courses">Semua course →</Link>
              </div>
              {myCourses.length === 0 ? (
                suggestedCourses.length === 0 ? (
                  <div className="empty-note">Course pertama lagi disiapkan mentor komunitas. Nanti muncul di sini.</div>
                ) : (
                  <ul className="rows">
                    {suggestedCourses.map((c) => (
                      <li key={c.id}>
                        <div className="row-main">
                          <Link className="title" to={`/courses/${c.slug}`}>{c.title}</Link>
                          <span>{levelLabel[c.level]}{c.instructor ? ` · ${c.instructor}` : ''}</span>
                        </div>
                        <Link className="btn btn-ghost sm" to={`/courses/${c.slug}`}>Mulai</Link>
                      </li>
                    ))}
                  </ul>
                )
              ) : (
                <ul className="rows">
                  {myCourses.map(({ course, done, total }) => {
                    const pct = total ? Math.round((done / total) * 100) : 0;
                    return (
                      <li key={course.id}>
                        <div className="row-main">
                          <Link className="title" to={`/courses/${course.slug}`}>{course.title}</Link>
                          <div className="progress" style={{ marginTop: 8 }}><span style={{ width: `${pct}%` }} /></div>
                          <div className="progress-label"><span>{done}/{total} lesson</span><span>{pct}%</span></div>
                        </div>
                        <Link className="btn btn-primary sm" to={`/courses/${course.slug}`}>{pct === 100 ? 'Ulas' : 'Lanjut'}</Link>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>

            <div className="panel">
              <div className="panel-head">
                <h2>Event saya</h2>
                <Link to="/events">Cari event →</Link>
              </div>
              {myEvents.length === 0 ? (
                <div className="empty-note">Belum ada event yang kamu ikuti. Yuk pilih satu dari agenda di bawah.</div>
              ) : (
                <EventRows items={myEvents.map((e) => ({ activity: e.activity, tag: e.status === 'confirmed' ? 'terdaftar' : 'waitlist' }))} />
              )}
            </div>

            {suggestedEvents.length > 0 && (
              <div className="panel">
                <div className="panel-head"><h2>Agenda komunitas</h2></div>
                <EventRows items={suggestedEvents.map((a) => ({ activity: a, tag: activityStatusLabel[a.status] }))} />
              </div>
            )}
          </div>

          <div className="dash-col">
            <div className={`panel${profileDone ? '' : ' panel-callout'}`}>
              <div className="profile-mini">
                <Avatar name={name} src={profile?.avatar_url} size={46} />
                <div>
                  <strong>{name}</strong>
                  <span>{profile?.username ? `@${profile.username}` : user?.email}</span>
                </div>
              </div>
              {profileDone ? (
                <p className="muted" style={{ fontSize: '.92rem' }}>Profilmu sudah lengkap. Mantap! 🚀</p>
              ) : (
                <>
                  <h2>Lengkapi profilmu</h2>
                  <p>Profil yang lengkap memudahkan admin mencocokkan mentor & merekomendasikan kegiatan.</p>
                  <ul className="checklist">
                    {checklist.map((c) => <li key={c.label} className={c.done ? 'done' : undefined}>{c.label}</li>)}
                  </ul>
                </>
              )}
              <div className="inline-actions" style={{ marginTop: 16 }}>
                <Link className="btn btn-ghost sm" to="/dashboard/profil">Edit profil</Link>
                {profile?.username && <Link className="btn btn-ghost sm" to={`/u/${profile.username}`}>Lihat publik</Link>}
              </div>
            </div>

            <div className="panel">
              <div className="panel-head"><h2>Butuh arahan?</h2></div>
              <p className="muted" style={{ fontSize: '.92rem', marginBottom: 14 }}>
                Ceritakan kondisimu lewat form Mentor Connect — admin bantu cocokkan dengan mentor yang pas.
              </p>
              <Link className="btn btn-primary sm" to="/mentorship/daftar">Ajukan mentorship</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function EventRows({ items }: { items: { activity: Activity; tag: string }[] }) {
  return (
    <ul className="rows">
      {items.map(({ activity: a, tag }) => {
        const parts = a.starts_at ? wibDayParts(a.starts_at) : null;
        return (
          <li key={a.id}>
            <span className="date-tile">
              {parts ? <><b>{parts.day}</b><span>{parts.month}</span></> : <span>TBA</span>}
            </span>
            <div className="row-main">
              <Link className="title" to={`/events/${a.slug}`}>{a.title}</Link>
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
