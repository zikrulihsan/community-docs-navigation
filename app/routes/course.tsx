import { data, Link } from 'react-router';
import type { Route } from './+types/course';
import { Lock, Play } from '~/components/Icons';
import { getOptionalUser, loginPath, useAuth } from '~/lib/auth';
import { formatMinutes, getCompletedLessonIds, getCourseOutline, levelLabel } from '~/lib/courses';
import { hasSupabase, supabase } from '~/lib/supabase';

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
  if (!hasSupabase) throw data(null, { status: 404 });
  const { data: course } = await supabase().from('courses').select('*').eq('slug', params.slug).maybeSingle();
  if (!course) throw data(null, { status: 404 });

  const [outline, user] = await Promise.all([getCourseOutline(params.slug), getOptionalUser()]);
  const completed = user ? await getCompletedLessonIds(outline.map((l) => l.id)) : new Set<string>();
  return { course, outline, completed };
}

export const meta: Route.MetaFunction = ({ loaderData }) =>
  loaderData ? [{ title: `${loaderData.course.title} — Course SWE Growth` }, { name: 'description', content: loaderData.course.summary }] : [];

export function HydrateFallback() {
  return <div className="loading-block">Memuat course…</div>;
}

export default function CoursePage({ loaderData: { course, outline, completed } }: Route.ComponentProps) {
  const { user, loading } = useAuth();
  const totalMinutes = outline.reduce((sum, l) => sum + (l.duration_minutes ?? 0), 0);
  const doneCount = outline.filter((l) => completed.has(l.id)).length;
  const pct = outline.length ? Math.round((doneCount / outline.length) * 100) : 0;
  const nextLesson = outline.find((l) => !completed.has(l.id)) ?? outline[0];
  const canOpen = (isPreview: boolean) => Boolean(user) || isPreview;

  return (
    <>
      <header className="page-hero">
        <div className="wrap">
          <Link className="back" to="/courses">← Semua course</Link>
          <span className="badge mono">{levelLabel[course.level]}</span>
          <h1>{course.title}</h1>
          {course.summary && <p className="lead">{course.summary}</p>}
        </div>
      </header>

      <section className="block">
        <div className="wrap course-layout">
          <div>
            {course.description && (
              <div className="prose" style={{ marginBottom: 30 }}>
                {course.description.split(/\n{2,}/).map((para, i) => <p key={i}>{para}</p>)}
              </div>
            )}
            <h2 className="section-title" style={{ marginBottom: 16 }}>Silabus</h2>
            {outline.length === 0 ? (
              <div className="empty-note">Lesson untuk course ini sedang disusun.</div>
            ) : (
              <ol className="outline">
                {outline.map((l) => {
                  const done = completed.has(l.id);
                  const inner = (
                    <>
                      <span className="num" />
                      <span>
                        <strong>{l.title}</strong>
                        {l.summary && <small>{l.summary}</small>}
                      </span>
                      <span className="tag">
                        {!canOpen(l.is_preview) ? <><Lock /> member</> : l.is_preview && !user ? <><Play /> preview</> : l.duration_minutes ? `${l.duration_minutes} mnt` : null}
                      </span>
                    </>
                  );
                  return (
                    <li key={l.id} className={done ? 'done' : undefined}>
                      {canOpen(l.is_preview) ? (
                        <Link to={`/courses/${course.slug}/${l.slug}`}>{inner}</Link>
                      ) : (
                        <Link to={loginPath(`/courses/${course.slug}/${l.slug}`)} className="locked">{inner}</Link>
                      )}
                    </li>
                  );
                })}
              </ol>
            )}
          </div>

          <aside className="course-side">
            <div className="form-card">
              <dl className="facts" style={{ marginBottom: 18 }}>
                <div><dt>Lesson</dt><dd>{outline.length}</dd></div>
                {totalMinutes > 0 && <div><dt>Durasi</dt><dd>{formatMinutes(totalMinutes)}</dd></div>}
                {course.instructor && <div><dt>Mentor</dt><dd>{course.instructor}</dd></div>}
              </dl>
              {user && outline.length > 0 && (
                <div style={{ marginBottom: 18 }}>
                  <div className="progress"><span style={{ width: `${pct}%` }} /></div>
                  <div className="progress-label"><span>{doneCount}/{outline.length} selesai</span><span>{pct}%</span></div>
                </div>
              )}
              {nextLesson && (user || loading) ? (
                <Link className="btn btn-primary" style={{ width: '100%' }} to={`/courses/${course.slug}/${nextLesson.slug}`}>
                  {doneCount === 0 ? 'Mulai belajar' : pct === 100 ? 'Ulas dari awal' : 'Lanjutkan belajar'}
                </Link>
              ) : nextLesson ? (
                <>
                  <Link className="btn btn-primary" style={{ width: '100%' }} to={loginPath(`/courses/${course.slug}`)}>Masuk untuk mulai</Link>
                  {outline.some((l) => l.is_preview) && (
                    <p className="muted" style={{ fontSize: '.85rem', marginTop: 10, textAlign: 'center' }}>
                      atau coba lesson berlabel <em>preview</em> tanpa akun
                    </p>
                  )}
                </>
              ) : null}
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
