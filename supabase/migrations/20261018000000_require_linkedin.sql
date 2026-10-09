-- LinkedIn wajib untuk semua member (memastikan orang asli). Member lama yang
-- belum mengisinya diminta melengkapi lewat onboarding sebelum masuk portal.
-- Harus sama dengan isProfileComplete() / LINKEDIN_RE di app/lib/profile.ts.
-- Aman dijalankan ulang.

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
        and coalesce(p.linkedin_url, '') ~* '^https://([a-z]+\.)?linkedin\.com/(in|pub)/[^/?#[:space:]]+'
        and p.headline <> ''
        and p.seniority is not null
        and cardinality(p.tech_stack) > 0
    )
    and exists (select 1 from public.member_motivations m where m.user_id = auth.uid())
  );
$$;
