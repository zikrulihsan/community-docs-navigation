import { useMemo, useState } from 'react';
import { data, Link, useNavigate, useRevalidator } from 'react-router';
import type { Route } from './+types/lesson';
import { ArrowRight, Check, Lock } from '~/components/Icons';
import { getOptionalUser, loginPath } from '~/lib/auth';
import { getCompletedLessonIds, getCourseOutline, youtubeEmbed } from '~/lib/courses';
import { renderMarkdown } from '~/lib/markdown';
import { hasSupabase, supabase } from '~/lib/supabase';

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
  if (!hasSupabase) throw data(null, { status: 404 });
  const db = supabase();

  const [{ data: course }, outline, user] = await Promise.all([
    db.from('courses').select('id, slug, title').eq('slug', params.slug).maybeSingle(),
    getCourseOutline(params.slug),
    getOptionalUser(),
  ]);
  const meta = outline.find((l) => l.slug === params.lesson);
  if (!course || !meta) throw data(null, { status: 404 });

  // RLS yang memutuskan: tamu hanya dapat isi lesson preview.
  const { data: lesson } = await db.from('course_lessons').select('*').eq('id', meta.id).maybeSingle();
  const completed = user ? await getCompletedLessonIds(outline.map((l) => l.id)) : new Set<string>();

  return { course, outline, lesson, meta, completed, isMember: Boolean(user) };
}

export const meta: Route.MetaFunction = ({ loaderData }) =>
  loaderData ? [{ title: `${loaderData.meta.title} · ${loaderData.course.title} — SWE Growth` }] : [];

export function HydrateFallback() {
  return <div className="loading-block">Memuat materi…</div>;
}

export default function LessonPage({ loaderData }: Route.ComponentProps) {
  const { course, outline, lesson, meta, completed, isMember } = loaderData;
  const navigate = useNavigate();
  const revalidator = useRevalidator();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const index = outline.findIndex((l) => l.id === meta.id);
  const prev = outline[index - 1];
  const next = outline[index + 1];
  const isDone = completed.has(meta.id);
  const html = useMemo(() => (lesson ? renderMarkdown(lesson.body_md) : ''), [lesson]);
  const embed = youtubeEmbed(lesson?.video_url ?? null);
  const lessonPath = (slug: string) => `/courses/${course.slug}/${slug}`;

  const toggleDone = async () => {
    setBusy(true);
    setError(null);
    const db = supabase();
    const { error: saveError } = isDone
      ? await db.from('lesson_progress').delete().eq('lesson_id', meta.id)
      : await db.from('lesson_progress').insert({ lesson_id: meta.id });
    if (saveError && saveError.code !== '23505') {
      setBusy(false);
      setError('Progress belum tersimpan. Coba lagi.');
      return;
    }
    // Pindah lesson / revalidate menjalankan ulang clientLoader → centang di silabus ikut ter-update.
    if (!isDone && next) await navigate(lessonPath(next.slug));
    else await revalidator.revalidate();
    setBusy(false);
  };

  return (
    <section className="block" style={{ paddingTop: 34 }}>
      <div className="wrap lesson-layout">
        <ol className="outline" aria-label={`Silabus ${course.title}`}>
          {outline.map((l) => {
            const open = isMember || l.is_preview;
            const inner = (
              <>
                <span className="num" />
                <span><strong>{l.title}</strong></span>
                {!open && <span className="tag"><Lock /></span>}
              </>
            );
            return (
              <li key={l.id} className={completed.has(l.id) ? 'done' : undefined}>
                <Link
                  to={open ? lessonPath(l.slug) : loginPath(lessonPath(l.slug))}
                  className={open ? undefined : 'locked'}
                  aria-current={l.id === meta.id ? 'page' : undefined}
                >
                  {inner}
                </Link>
              </li>
            );
          })}
        </ol>

        <article className="lesson-main">
          <Link className="back" to={`/courses/${course.slug}`}>← {course.title}</Link>
          <span className="mono muted">Lesson {index + 1} dari {outline.length}</span>
          <h1>{meta.title}</h1>
          {meta.summary && <p className="lead">{meta.summary}</p>}

          {lesson ? (
            <>
              {embed ? (
                <div className="video-frame">
                  <iframe
                    src={embed}
                    title={meta.title}
                    loading="lazy"
                    allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                </div>
              ) : lesson.video_url ? (
                <p><a className="btn btn-ghost" href={lesson.video_url} target="_blank" rel="noopener">Buka video materi ↗</a></p>
              ) : null}
              <div className="prose" dangerouslySetInnerHTML={{ __html: html }} />

              <div className="lesson-foot">
                {isMember ? (
                  <button className={`btn ${isDone ? 'btn-ghost' : 'btn-done'}`} type="button" onClick={toggleDone} disabled={busy}>
                    {isDone ? <>Selesai <Check /> · tandai belum</> : <><Check /> Tandai selesai{next ? ' & lanjut' : ''}</>}
                  </button>
                ) : (
                  <Link className="btn btn-primary" to={loginPath(lessonPath(meta.slug))}>Masuk untuk simpan progress</Link>
                )}
                <div className="lesson-nav">
                  {prev && <Link className="btn btn-ghost sm" to={lessonPath(prev.slug)}>← Sebelumnya</Link>}
                  {next && <Link className="btn btn-ghost sm" to={lessonPath(next.slug)}>Berikutnya <ArrowRight /></Link>}
                </div>
              </div>
              {error && <p className="form-message error" style={{ marginTop: 14 }}>{error}</p>}
            </>
          ) : (
            <div className="panel gate">
              <span className="lock-icon"><Lock /></span>
              <h2>Lesson ini khusus member</h2>
              <p>Masuk gratis pakai Google atau email untuk membuka semua lesson dan menyimpan progress belajarmu.</p>
              <div className="inline-actions">
                <Link className="btn btn-primary" to={loginPath(lessonPath(meta.slug))}>Masuk untuk lanjut</Link>
                <Link className="btn btn-ghost" to={`/courses/${course.slug}`}>Lihat silabus</Link>
              </div>
            </div>
          )}
        </article>
      </div>
    </section>
  );
}
