-- Angka di hero landing: jumlah akun member & kegiatan publik (tanpa yang dibatalkan).
-- Hanya angka yang keluar; profiles tetap tertutup untuk publik.
-- Aman dijalankan ulang.

create or replace function public.community_stats()
returns table (member_count bigint, session_count bigint)
language sql
stable
security definer
set search_path = ''
as $$
  select
    (select count(*) from public.profiles),
    (select count(*) from public.activities where is_public and status <> 'cancelled');
$$;

revoke all on function public.community_stats() from public;
grant execute on function public.community_stats() to anon, authenticated;
