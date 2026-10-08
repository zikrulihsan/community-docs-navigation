-- Event: data pembicara, langkah berikutnya custom, dan statistik publik.
-- Aman dijalankan ulang.

-- Pembicara: nama tetap di kolom `speaker`. Foto diambil otomatis dari
-- LinkedIn (lihat speakerPhoto() di app/lib/activities.ts) kecuali diisi manual.
alter table public.activities
  add column if not exists speaker_title text check (char_length(speaker_title) <= 120),
  add column if not exists speaker_linkedin_url text check (speaker_linkedin_url ~ '^https://'),
  add column if not exists speaker_photo_url text check (speaker_photo_url ~ '^https://'),
  -- Langkah tambahan di halaman "terdaftar": [{ title, url, description }]
  add column if not exists next_steps jsonb not null default '[]'
    check (jsonb_typeof(next_steps) = 'array' and jsonb_array_length(next_steps) <= 10);

-- Jumlah peserta untuk halaman publik (tanpa data pribadi).
create or replace function public.activity_public_stats(p_activity_id uuid)
returns table (confirmed integer, waitlisted integer)
language sql
stable
security definer
set search_path = ''
as $$
  select
    count(*) filter (where r.status = 'confirmed')::integer,
    count(*) filter (where r.status = 'waitlisted')::integer
  from public.activities a
  left join public.activity_registrations r on r.activity_id = a.id
  where a.id = p_activity_id and a.is_public;
$$;

revoke all on function public.activity_public_stats(uuid) from public;
grant execute on function public.activity_public_stats(uuid) to anon, authenticated;
