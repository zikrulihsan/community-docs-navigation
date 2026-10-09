-- Aktivitas minggu ini di landing: jumlah akun baru & pendaftar per kegiatan.
-- Hanya angka agregat yang keluar (tanpa nama/email), dan angka kecil (< 3)
-- tidak ditampilkan supaya tidak bisa ditebak siapa orangnya.
-- Aman dijalankan ulang.

create or replace function public.community_pulse()
returns table (kind text, slug text, title text, total bigint)
language sql
stable
security definer
set search_path = ''
as $$
  select 'member', null, null, count(*)
  from public.profiles
  where created_at >= now() - interval '7 days'
  having count(*) >= 3

  union all

  select * from (
    select 'registration', a.slug, a.title, count(*)
    from public.activity_registrations r
    join public.activities a on a.id = r.activity_id
    where r.created_at >= now() - interval '7 days'
      and r.status <> 'cancelled'
      and a.is_public
      and a.status not in ('completed', 'cancelled')
      and coalesce(a.ends_at, a.starts_at, now()) >= now()
    group by a.id
    having count(*) >= 3
    order by count(*) desc
    limit 3
  ) top;
$$;

revoke all on function public.community_pulse() from public;
grant execute on function public.community_pulse() to anon, authenticated;
