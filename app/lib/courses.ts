import type { CourseLevel, CourseRow, LessonOutline } from './database.types';
import { supabase } from './supabase';

export type Course = CourseRow;
export type CourseStats = { lesson_count: number; total_minutes: number };

export const levelLabel: Record<CourseLevel, string> = {
  beginner: 'Pemula',
  intermediate: 'Menengah',
  advanced: 'Lanjutan',
  all: 'Semua level',
};

export async function getCourseStats() {
  const { data } = await supabase().rpc('course_stats');
  return new Map((data ?? []).map((s) => [s.course_id, s] as const));
}

export async function getCourseOutline(slug: string): Promise<LessonOutline[]> {
  const { data, error } = await supabase().rpc('course_outline', { p_course_slug: slug });
  if (error) throw error;
  return data ?? [];
}

/** Id lesson yang sudah diselesaikan user dari daftar lesson tertentu. */
export async function getCompletedLessonIds(lessonIds: string[]) {
  if (lessonIds.length === 0) return new Set<string>();
  const { data } = await supabase().from('lesson_progress').select('lesson_id').in('lesson_id', lessonIds);
  return new Set((data ?? []).map((row) => row.lesson_id));
}

export function formatMinutes(total: number) {
  if (!total) return null;
  const h = Math.floor(total / 60);
  const m = total % 60;
  return [h && `${h} jam`, m && `${m} menit`].filter(Boolean).join(' ');
}

/** URL embed untuk YouTube (privacy-enhanced), null kalau bukan YouTube. */
export function youtubeEmbed(url: string | null) {
  if (!url) return null;
  try {
    const u = new URL(url);
    let id: string | null = null;
    if (u.hostname === 'youtu.be') id = u.pathname.slice(1);
    else if (u.hostname.endsWith('youtube.com')) {
      id = u.searchParams.get('v') ?? u.pathname.match(/^\/(?:embed|shorts|live)\/([\w-]+)/)?.[1] ?? null;
    }
    return id && /^[\w-]{6,}$/.test(id) ? `https://www.youtube-nocookie.com/embed/${id}` : null;
  } catch {
    return null;
  }
}

export const slugify = (input: string) =>
  input
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 80);
