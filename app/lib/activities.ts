import type { ActivityRow, ActivityStatus, RegistrationStatus } from './database.types';
import { formatWibTime, isUpcoming } from './format';
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

/** Belum selesai: dilihat dari ends_at kalau diisi (program panjang yang sudah mulai tetap tampil). */
export const isActivityUpcoming = (a: Activity) => {
  const until = a.ends_at ?? a.starts_at;
  return !isDone(a) && (!until || isUpcoming(new Date(until)));
};

/** Sudah mulai tapi belum selesai, mis. program yang berjalan beberapa bulan. */
export const isActivityOngoing = (a: Pick<Activity, 'starts_at' | 'ends_at'>, now = new Date()) =>
  Boolean(a.starts_at && a.ends_at && new Date(a.starts_at) <= now && new Date(a.ends_at) > now);

export const canRegister = (a: Activity) => a.status === 'registration_open' || a.status === 'full';

/** Saat build pakai client anonim; di browser pakai client bersesi (admin bisa lihat draft). */
export function client() {
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

/** Angka hero landing dari database (null kalau gagal diambil). */
export async function getCommunityStats() {
  const db = client();
  if (!db) return null;
  const { data, error } = await db.rpc('community_stats').maybeSingle();
  if (error) {
    console.error('Tidak dapat mengambil statistik komunitas:', error.message);
    return null;
  }
  return data;
}

/** Path publik detail event — dibagikan saat publikasi. */
export const activityPath = (a: Pick<Activity, 'slug'>) => `/agenda/${a.slug}`;
export const registerPath = (a: Pick<Activity, 'slug'>) => `/agenda/${a.slug}/daftar`;
export const registeredPath = (a: Pick<Activity, 'slug'>) => `/agenda/${a.slug}/terdaftar`;

const rupiah = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 });
export const priceLabel = (a: Pick<Activity, 'price_idr'>) => (a.price_idr > 0 ? rupiah.format(a.price_idr) : 'Gratis');
export const isPaid = (a: Pick<Activity, 'price_idr'>) => a.price_idr > 0;

/** "linkedin.com/in/ruby-abdullah/" → "ruby-abdullah". */
export const linkedinHandle = (url: string | null) => url?.match(/linkedin\.com\/in\/([^/?#]+)/i)?.[1] ?? null;

/**
 * Foto pembicara: URL manual kalau diisi admin, kalau tidak diambil dari profil
 * LinkedIn lewat unavatar.io (gratis, di-cache 28 hari). Null kalau keduanya tidak ada.
 */
export function speakerPhoto(a: Pick<Activity, 'speaker_photo_url' | 'speaker_linkedin_url'>) {
  if (a.speaker_photo_url) return a.speaker_photo_url;
  const handle = linkedinHandle(a.speaker_linkedin_url);
  return handle ? `https://unavatar.io/linkedin/${encodeURIComponent(handle)}?fallback=false` : null;
}

/** "Hari ini", "Besok", "3 hari lagi" — null kalau sudah lewat atau tanpa tanggal. */
export function countdown(a: Pick<Activity, 'starts_at'>, now = new Date()) {
  if (!a.starts_at) return null;
  const day = (d: Date) => new Date(d.toLocaleDateString('en-CA', { timeZone: 'Asia/Jakarta' })).getTime();
  const days = Math.round((day(new Date(a.starts_at)) - day(now)) / 86_400_000);
  if (days < 0) return null;
  if (days === 0) return 'Hari ini';
  if (days === 1) return 'Besok';
  return `${days} hari lagi`;
}

/** "13.00–14.30 WIB" atau "13.00 WIB" kalau tanpa jam selesai. */
export function timeRange(a: Pick<Activity, 'starts_at' | 'ends_at'>) {
  if (!a.starts_at) return null;
  const start = formatWibTime(a.starts_at).replace(' WIB', '');
  return a.ends_at ? `${start}–${formatWibTime(a.ends_at)}` : `${start} WIB`;
}

export async function fetchPublicStats(activityId: string) {
  const { data } = await supabase().rpc('activity_public_stats', { p_activity_id: activityId }).maybeSingle();
  return data ?? { confirmed: 0, waitlisted: 0 };
}

export type CalendarSyncResult = {
  status?: 'created' | 'updated' | 'unchanged' | 'cancelled' | 'skipped' | 'not_configured';
  invited?: number;
  url?: string;
  error?: string;
  detail?: string;
};

/**
 * Samakan event dengan Google Calendar SWE Growth (edge function calendar-sync):
 * peserta terkonfirmasi jadi tamu, Google yang mengirim undangan. Gagal = tidak
 * mengganggu pendaftaran; admin bisa sinkron ulang dari editor event.
 */
export async function syncCalendar(activityId: string): Promise<CalendarSyncResult> {
  const { data, error } = await supabase().functions.invoke<CalendarSyncResult>('calendar-sync', {
    body: { activity_id: activityId },
  });
  if (error) return { error: error.message };
  return data ?? {};
}

/** Kode pendek untuk ditunjukkan peserta, dari id pendaftaran. */
export const registrationCode = (id: string) => `SWE-${id.replace(/-/g, '').slice(0, 6).toUpperCase()}`;

export const isActiveRegistration = (s: RegistrationStatus | null | undefined) => s === 'confirmed' || s === 'waitlisted';

/** Status pendaftaran akun yang login untuk satu event (null kalau belum pernah). */
export async function fetchMyRegistration(activityId: string, userId: string) {
  const { data } = await supabase()
    .from('activity_registrations')
    .select('*')
    .eq('activity_id', activityId)
    .eq('user_id', userId)
    .maybeSingle();
  return data;
}

const calStamp = (d: Date) => d.toISOString().replace(/[-:]|\.\d{3}/g, '');

/** Link "tambah ke Google Calendar". Tanpa ends_at dianggap 1 jam. */
export function googleCalendarUrl(a: Activity, details: string) {
  if (!a.starts_at) return null;
  const start = new Date(a.starts_at);
  const end = a.ends_at ? new Date(a.ends_at) : new Date(start.getTime() + 60 * 60 * 1000);
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: a.title,
    dates: `${calStamp(start)}/${calStamp(end)}`,
    details,
    location: a.location ?? (a.mode === 'online' ? 'Online' : ''),
  });
  return `https://calendar.google.com/calendar/render?${params}`;
}

export const slugify = (input: string) =>
  input
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 80);
