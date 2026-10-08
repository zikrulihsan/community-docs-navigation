-- Profil member lengkap untuk pendataan.
--
-- Member mengisi kontak (WhatsApp, LinkedIn, GitHub, portfolio), karier
-- (peran, perusahaan, level, lama pengalaman), keahlian, teknologi yang
-- dikuasai, dan riwayat pengalaman kerja. Profil tetap privat: hanya pemilik
-- dan admin yang bisa membaca (lihat 20261004000000_member_portal.sql).
-- Aman dijalankan ulang.

alter table public.profiles
  add column if not exists location text check (char_length(location) <= 80),
  add column if not exists years_experience smallint check (years_experience between 0 and 60),
  add column if not exists portfolio_url text check (portfolio_url ~ '^https://'),
  add column if not exists tech_stack text[] not null default '{}' check (cardinality(tech_stack) <= 30),
  -- [{ role, company, start: 'YYYY-MM', end: 'YYYY-MM' | null, description }]
  add column if not exists experiences jsonb not null default '[]'
    check (jsonb_typeof(experiences) = 'array' and jsonb_array_length(experiences) <= 20);

-- Batas skills dinaikkan dari 15 supaya sama longgarnya dengan tech_stack.
alter table public.profiles drop constraint if exists profiles_skills_check;
alter table public.profiles add constraint profiles_skills_check check (cardinality(skills) <= 30);

-- email tetap tidak bisa diubah member.
revoke update on public.profiles from authenticated;
grant update (full_name, headline, company, avatar_url, whatsapp, onboarded_at,
              seniority, bio, linkedin_url, github_url, skills,
              location, years_experience, portfolio_url, tech_stack, experiences)
  on public.profiles to authenticated;

-- ---------------------------------------------------------------------------
-- Profil lengkap = syarat dapat link grup WhatsApp.
-- Harus sama dengan isProfileComplete() di app/lib/profile.ts.
-- ---------------------------------------------------------------------------

create or replace function public.has_complete_profile()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select public.is_admin() or exists (
    select 1 from public.profiles p
    where p.id = auth.uid()
      and p.full_name <> ''
      and p.whatsapp is not null
      and p.headline <> ''
      and p.seniority is not null
      and cardinality(p.tech_stack) > 0
  );
$$;

revoke all on function public.has_complete_profile() from public;
grant execute on function public.has_complete_profile() to authenticated;

drop policy if exists "Signed-in users read groups" on public.whatsapp_groups;
drop policy if exists "Complete profiles read groups" on public.whatsapp_groups;
create policy "Complete profiles read groups" on public.whatsapp_groups
  for select to authenticated
  using ((select public.has_complete_profile()));
