-- "Dari member ke member": karya member untuk member lain (web dokumentasi,
-- bot komunitas, dll.), dikelola admin dan tampil di landing.
-- Aman dijalankan ulang.

create table if not exists public.member_contributions (
  id uuid primary key default gen_random_uuid(),
  title text not null check (char_length(title) between 2 and 80),
  category text not null default '' check (char_length(category) <= 40),
  description text not null default '' check (char_length(description) <= 300),
  url text not null check (url ~ '^https://'),
  maker_name text not null default '' check (char_length(maker_name) <= 80),
  icon_url text check (icon_url ~ '^https://'),
  sort_order integer not null default 0,
  is_published boolean not null default true,
  created_at timestamptz not null default now()
);

alter table public.member_contributions enable row level security;

drop policy if exists "Published contributions are readable" on public.member_contributions;
create policy "Published contributions are readable" on public.member_contributions
  for select to anon, authenticated
  using (is_published);

drop policy if exists "Admins manage contributions" on public.member_contributions;
create policy "Admins manage contributions" on public.member_contributions
  for all to authenticated
  using ((select public.is_admin()))
  with check ((select public.is_admin()));

grant select on public.member_contributions to anon;
grant select, insert, update, delete on public.member_contributions to authenticated;
