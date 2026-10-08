-- Profil member bisa dilihat publik di /member/:handle.
--
-- Tabel profiles tetap tertutup (pemilik & admin); halaman publik membaca lewat
-- public_profile(), yang hanya mengembalikan kolom aman. Nomor WhatsApp, email,
-- dan jawaban kenalan (member_motivations) tidak pernah ikut.
-- Aman dijalankan ulang.

-- Member memilih username sendiri untuk link profil.
grant update (username) on public.profiles to authenticated;

-- handle = username, atau id (untuk member yang belum memilih username).
create or replace function public.public_profile(p_handle text)
returns table (
  id uuid,
  username text,
  full_name text,
  headline text,
  company text,
  seniority public.seniority,
  years_experience smallint,
  location text,
  avatar_url text,
  bio text,
  linkedin_url text,
  github_url text,
  portfolio_url text,
  skills text[],
  tech_stack text[],
  experiences jsonb,
  created_at timestamptz
)
language sql
stable
security definer
set search_path = ''
as $$
  select p.id, p.username, p.full_name, p.headline, p.company, p.seniority, p.years_experience,
         p.location, p.avatar_url, p.bio, p.linkedin_url, p.github_url, p.portfolio_url,
         p.skills, p.tech_stack, p.experiences, p.created_at
  from public.profiles p
  where (p.username = lower(p_handle) or p.id::text = lower(p_handle))
    and p.onboarded_at is not null
    and p.full_name <> ''
  limit 1;
$$;

revoke all on function public.public_profile(text) from public;
grant execute on function public.public_profile(text) to anon, authenticated;
