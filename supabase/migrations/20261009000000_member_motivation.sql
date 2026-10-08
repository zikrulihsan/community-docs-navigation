-- Jawaban "kenalan" saat onboarding (dulu ada di form goakal): masalah karier,
-- apa yang bisa membantu, alasan bergabung, dan harapan.
--
-- Tabel terpisah dari profiles supaya tetap hanya terbaca pemilik & admin,
-- meskipun nanti sebagian profil dibuka untuk sesama member.
-- Link grup WhatsApp baru terbuka setelah kenalan + profil lengkap.
-- Aman dijalankan ulang.

create table if not exists public.member_motivations (
  user_id uuid primary key default auth.uid() references public.profiles (id) on delete cascade,
  career_problem text not null check (char_length(trim(career_problem)) between 1 and 2000),
  help_wanted text not null check (char_length(trim(help_wanted)) between 1 and 2000),
  join_reason text not null check (char_length(trim(join_reason)) between 1 and 2000),
  expectations text not null default '' check (char_length(expectations) <= 2000),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists member_motivations_touch_updated_at on public.member_motivations;
create trigger member_motivations_touch_updated_at
  before update on public.member_motivations
  for each row execute function public.touch_updated_at();

alter table public.member_motivations enable row level security;

drop policy if exists "Members read own motivation, admins read all" on public.member_motivations;
create policy "Members read own motivation, admins read all" on public.member_motivations
  for select to authenticated
  using (user_id = (select auth.uid()) or (select public.is_admin()));

drop policy if exists "Members write own motivation" on public.member_motivations;
create policy "Members write own motivation" on public.member_motivations
  for insert to authenticated
  with check (user_id = (select auth.uid()));

drop policy if exists "Members update own motivation" on public.member_motivations;
create policy "Members update own motivation" on public.member_motivations
  for update to authenticated
  using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));

grant select, insert on public.member_motivations to authenticated;
grant update (career_problem, help_wanted, join_reason, expectations) on public.member_motivations to authenticated;

-- Harus sama dengan isOnboarded() di app/lib/profile.ts.
create or replace function public.has_complete_profile()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select public.is_admin() or (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid()
        and p.full_name <> ''
        and p.whatsapp is not null
        and p.headline <> ''
        and p.seniority is not null
        and cardinality(p.tech_stack) > 0
    )
    and exists (select 1 from public.member_motivations m where m.user_id = auth.uid())
  );
$$;
