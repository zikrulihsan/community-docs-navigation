-- Pembuat kontribusi bisa ditautkan ke member terdaftar (link ke /member/:handle).
-- maker_name tetap dipakai untuk pembuat yang bukan member terdaftar.
-- Aman dijalankan ulang.

alter table public.member_contributions
  add column if not exists maker_id uuid references public.profiles (id) on delete set null;

-- Landing membaca lewat fungsi ini karena profiles tertutup untuk publik. Hanya
-- kolom aman yang ikut; handle & foto hanya untuk profil yang memang publik
-- (syarat sama dengan public_profile()).
create or replace function public.published_contributions()
returns table (
  id uuid,
  title text,
  category text,
  description text,
  url text,
  icon_url text,
  maker_name text,
  maker_handle text,
  maker_avatar_url text
)
language sql
stable
security definer
set search_path = ''
as $$
  select c.id, c.title, c.category, c.description, c.url, c.icon_url,
         coalesce(nullif(p.full_name, ''), c.maker_name) as maker_name,
         case when p.onboarded_at is not null and p.full_name <> '' then coalesce(p.username, p.id::text) end as maker_handle,
         case when p.onboarded_at is not null and p.full_name <> '' then p.avatar_url end as maker_avatar_url
  from public.member_contributions c
  left join public.profiles p on p.id = c.maker_id
  where c.is_published
  order by c.sort_order, c.created_at;
$$;

revoke all on function public.published_contributions() from public;
grant execute on function public.published_contributions() to anon, authenticated;
