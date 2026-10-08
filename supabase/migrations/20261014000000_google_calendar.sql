-- Sinkron event ke Google Calendar (akun Gmail SWE Growth).
--
-- Edge function calendar-sync membuat/memperbarui event Google untuk tiap
-- kegiatan dan menyamakan daftar tamu dengan peserta terkonfirmasi. Kolom ini
-- hanya ditulis fungsi itu (service role); admin & peserta cukup membaca.
-- Aman dijalankan ulang.

alter table public.activities
  add column if not exists google_event_id text,
  add column if not exists google_event_url text check (google_event_url ~ '^https://'),
  add column if not exists calendar_synced_at timestamptz;
