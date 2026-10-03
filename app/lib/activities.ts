import type { ActivityRow, ActivityStatus } from './database.types';
import { isUpcoming } from './format';
import { anonSupabase, hasSupabase, supabase } from './supabase';

export type Activity = ActivityRow;

export const activityStatusLabel: Record<ActivityStatus, string> = {
  coming_soon: 'coming soon',
  scheduled: 'segera dibuka',
  registration_open: 'pendaftaran dibuka',
  full: 'waitlist tersedia',
  completed: 'selesai',
  cancelled: 'dibatalkan',
};

export const ACTIVITY_STATUSES = Object.keys(activityStatusLabel) as ActivityStatus[];

const isDone = (a: Activity) => a.status === 'completed' || a.status === 'cancelled';

export const isActivityUpcoming = (a: Activity) =>
  !isDone(a) && (!a.starts_at || isUpcoming(new Date(a.starts_at)));

export const canRegister = (a: Activity) => a.status === 'registration_open' || a.status === 'full';

/** Saat build pakai client anonim; di browser pakai client bersesi (admin bisa lihat draft). */
function client() {
  if (typeof window === 'undefined') return anonSupabase();
  return hasSupabase ? supabase() : null;
}

export async function getPublishedActivities(): Promise<Activity[]> {
  const db = client();
  if (!db) return [];

  const { data, error } = await db
    .from('activities')
    .select('*')
    .eq('is_public', true)
    .order('starts_at', { ascending: true, nullsFirst: true });

  if (error) {
    console.error('Tidak dapat mengambil activity dari Supabase:', error.message);
    return [];
  }
  return data;
}

export async function getPublishedActivityBySlug(slug: string): Promise<Activity | null> {
  const db = client();
  if (!db) return null;

  const { data, error } = await db
    .from('activities')
    .select('*')
    .eq('slug', slug)
    .eq('is_public', true)
    .maybeSingle();

  if (error) {
    console.error('Tidak dapat mengambil activity dari Supabase:', error.message);
    return null;
  }
  return data;
}
