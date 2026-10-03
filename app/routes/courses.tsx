import { Link } from 'react-router';
import type { Route } from './+types/courses';
import { JoinCta } from '~/components/JoinCta';
import { PageHero } from '~/components/PageHero';
import { getOptionalUser } from '~/lib/auth';
import { formatMinutes, getCourseStats, levelLabel } from '~/lib/courses';
import { pageMeta } from '~/lib/site';
import { hasSupabase, supabase } from '~/lib/supabase';

export const meta: Route.MetaFunction = () =>
  pageMeta('Course — SWE Growth', 'Materi belajar terstruktur dari mentor komunitas SWE Growth. Gratis untuk member, progress tersimpan otomatis.');

export async function clientLoader() {
  if (!hasSupabase) return { courses: [], stats: new Map(), done: new Map<string, number>() };
  const db = supabase();
  const [{ data: courses }, stats, user] = await Promise.all([
    db.from('courses').select('*').eq('is_published', true).order('sort_order').order('created_at'),
    getCourseStats(),
    getOptionalUser(),
  ]);

  // Untuk member: jumlah lesson selesai per course.
  const done = new Map<string, number>();
  if (user) {
    const { data: progress } = await db.from('lesson_progress').select('lesson_id, course_lessons(course_id)');
    for (const row of progress ?? []) {
      const courseId = (row.course_lessons as unknown as { course_id: string } | null)?.course_id;
      if (courseId) done.set(courseId, (done.get(courseId) ?? 0) + 1);
    }
  }
  return { courses: courses ?? [], stats, done };
}

export function HydrateFallback() {
  return (
    <>
      <PageHero badge="Course" title="Belajar terstruktur, bareng komunitas" lead="Memuat course…" />
      <div className="loading-block" />
    </>
  );
}

export default function Courses({ loaderData: { courses, stats, done } }: Route.ComponentProps) {
  return (
    <>
      <PageHero
        badge="Course"
        title="Belajar terstruktur, bareng komunitas"
        lead="Materi berseri dari mentor & member senior. Lesson pertama bisa dicoba tanpa akun; masuk untuk membuka semuanya dan menyimpan progress."
      />
      <section className="block">
        <div className="wrap">
          {courses.length === 0 ? (
            <div className="empty-note">Course pertama lagi disiapkan. Pantau grup WhatsApp untuk pengumumannya.</div>
          ) : (
            <div className="card-grid">
              {courses.map((c) => {
                const s = stats.get(c.id);
                const total = s?.lesson_count ?? 0;
                const finished = done.get(c.id) ?? 0;
                return (
                  <Link key={c.id} className="card course-card" to={`/courses/${c.slug}`}>
                    <span className="cover" style={c.cover_url ? { backgroundImage: `url(${JSON.stringify(c.cover_url)})` } : undefined}>
                      {!c.cover_url && 'swe growth · course'}
                    </span>
                    <span className="chip green">{levelLabel[c.level]}</span>
                    <h3>{c.title}</h3>
                    <p>{c.summary}</p>
                    <span className="spacer"></span>
                    {finished > 0 && total > 0 && (
                      <div className="progress"><span style={{ width: `${Math.round((finished / total) * 100)}%` }} /></div>
                    )}
                    <div className="meta">
                      <span>{total} lesson</span>
                      {s && formatMinutes(s.total_minutes) && <span>{formatMinutes(s.total_minutes)}</span>}
                      {c.instructor && <span>{c.instructor}</span>}
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>
      <JoinCta />
    </>
  );
}
