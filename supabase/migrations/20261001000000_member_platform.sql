-- Member platform fase 1: profil member, course + lesson, progress belajar,
-- dan pendaftaran event berbasis akun.
--
-- Situs sekarang SPA tanpa server, jadi semua akses lewat publishable key.
-- Batas aksesnya sepenuhnya dijaga RLS + fungsi SECURITY DEFINER di bawah —
-- tidak ada lagi secret key di aplikasi.

-- ---------------------------------------------------------------------------
-- Helpers
-- ---------------------------------------------------------------------------

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- Admin = user yang login dengan email yang terdaftar di activity_admin_emails.
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.activity_admin_emails a
    where a.email = lower(coalesce(auth.jwt() ->> 'email', ''))
  );
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to anon, authenticated;

-- ---------------------------------------------------------------------------
-- Profiles
-- ---------------------------------------------------------------------------

do $$ begin
  create type public.seniority as enum ('student', 'junior', 'mid', 'senior', 'staff', 'manager');
exception when duplicate_object then null; end $$;

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  username text unique check (username ~ '^[a-z0-9_]{3,30}$'),
  full_name text not null default '' check (char_length(full_name) <= 80),
  headline text not null default '' check (char_length(headline) <= 120),
  seniority public.seniority,
  company text check (char_length(company) <= 80),
  bio text not null default '' check (char_length(bio) <= 1000),
  avatar_url text,
  linkedin_url text check (linkedin_url ~ '^https://'),
  github_url text check (github_url ~ '^https://'),
  skills text[] not null default '{}' check (cardinality(skills) <= 15),
  onboarded_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists profiles_touch_updated_at on public.profiles;
create trigger profiles_touch_updated_at
  before update on public.profiles
  for each row execute function public.touch_updated_at();

alter table public.profiles enable row level security;

drop policy if exists "Onboarded profiles are public" on public.profiles;
create policy "Onboarded profiles are public" on public.profiles
  for select to anon, authenticated
  using (onboarded_at is not null or id = (select auth.uid()));

drop policy if exists "Members update their own profile" on public.profiles;
create policy "Members update their own profile" on public.profiles
  for update to authenticated
  using (id = (select auth.uid()))
  with check (id = (select auth.uid()));

grant select on public.profiles to anon, authenticated;
grant update (username, full_name, headline, seniority, company, bio, avatar_url,
              linkedin_url, github_url, skills, onboarded_at)
  on public.profiles to authenticated;

-- Setiap user baru (Google / magic link) otomatis punya baris profil.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (
    new.id,
    left(coalesce(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name', ''), 80),
    new.raw_user_meta_data ->> 'avatar_url'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- User yang sudah ada sebelumnya (mis. admin) ikut dapat profil.
insert into public.profiles (id) select id from auth.users on conflict (id) do nothing;

-- ---------------------------------------------------------------------------
-- Courses & lessons
-- ---------------------------------------------------------------------------

create table if not exists public.courses (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  title text not null check (char_length(title) between 3 and 140),
  summary text not null default '',
  description text not null default '',
  level text not null default 'all' check (level in ('beginner', 'intermediate', 'advanced', 'all')),
  instructor text,
  cover_url text,
  is_published boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.course_lessons (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.courses (id) on delete cascade,
  slug text not null check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  title text not null check (char_length(title) between 3 and 140),
  summary text not null default '',
  body_md text not null default '',
  video_url text check (video_url ~ '^https://'),
  duration_minutes integer check (duration_minutes > 0),
  position integer not null default 0,
  is_preview boolean not null default false,
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (course_id, slug)
);

create index if not exists course_lessons_course_position_idx
  on public.course_lessons (course_id, position);

drop trigger if exists courses_touch_updated_at on public.courses;
create trigger courses_touch_updated_at
  before update on public.courses
  for each row execute function public.touch_updated_at();

drop trigger if exists course_lessons_touch_updated_at on public.course_lessons;
create trigger course_lessons_touch_updated_at
  before update on public.course_lessons
  for each row execute function public.touch_updated_at();

alter table public.courses enable row level security;
alter table public.course_lessons enable row level security;

drop policy if exists "Published courses are public" on public.courses;
create policy "Published courses are public" on public.courses
  for select to anon, authenticated
  using (is_published or (select public.is_admin()));

drop policy if exists "Admins manage courses" on public.courses;
create policy "Admins manage courses" on public.courses
  for all to authenticated
  using ((select public.is_admin()))
  with check ((select public.is_admin()));

-- Isi lesson: tamu hanya lesson preview, member semua lesson yang terbit.
-- Daftar judul lesson (outline) untuk tamu disediakan lewat course_outline().
drop policy if exists "Lesson content by membership" on public.course_lessons;
create policy "Lesson content by membership" on public.course_lessons
  for select to anon, authenticated
  using (
    (select public.is_admin())
    or (
      is_published
      and (is_preview or (select auth.uid()) is not null)
      and exists (select 1 from public.courses c where c.id = course_id and c.is_published)
    )
  );

drop policy if exists "Admins manage lessons" on public.course_lessons;
create policy "Admins manage lessons" on public.course_lessons
  for all to authenticated
  using ((select public.is_admin()))
  with check ((select public.is_admin()));

grant select on public.courses, public.course_lessons to anon, authenticated;
grant insert, update, delete on public.courses, public.course_lessons to authenticated;

-- Outline (tanpa isi materi) supaya halaman course bisa menampilkan silabus ke tamu.
create or replace function public.course_outline(p_course_slug text)
returns table (
  id uuid, slug text, title text, summary text,
  duration_minutes integer, "position" integer, is_preview boolean
)
language sql
stable
security definer
set search_path = ''
as $$
  select l.id, l.slug, l.title, l.summary, l.duration_minutes, l.position, l.is_preview
  from public.course_lessons l
  join public.courses c on c.id = l.course_id
  where c.slug = p_course_slug and c.is_published and l.is_published
  order by l.position, l.created_at;
$$;

create or replace function public.course_stats()
returns table (course_id uuid, lesson_count integer, total_minutes integer)
language sql
stable
security definer
set search_path = ''
as $$
  select l.course_id, count(*)::integer, coalesce(sum(l.duration_minutes), 0)::integer
  from public.course_lessons l
  join public.courses c on c.id = l.course_id
  where c.is_published and l.is_published
  group by l.course_id;
$$;

revoke all on function public.course_outline(text), public.course_stats() from public;
grant execute on function public.course_outline(text), public.course_stats() to anon, authenticated;

-- ---------------------------------------------------------------------------
-- Learning progress
-- ---------------------------------------------------------------------------

create table if not exists public.lesson_progress (
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  lesson_id uuid not null references public.course_lessons (id) on delete cascade,
  completed_at timestamptz not null default now(),
  primary key (user_id, lesson_id)
);

create index if not exists lesson_progress_lesson_idx on public.lesson_progress (lesson_id);

alter table public.lesson_progress enable row level security;

drop policy if exists "Members read their own progress" on public.lesson_progress;
create policy "Members read their own progress" on public.lesson_progress
  for select to authenticated
  using (user_id = (select auth.uid()));

-- exists() di sini berjalan dengan RLS user → hanya lesson yang memang bisa ia baca.
drop policy if exists "Members record their own progress" on public.lesson_progress;
create policy "Members record their own progress" on public.lesson_progress
  for insert to authenticated
  with check (
    user_id = (select auth.uid())
    and exists (select 1 from public.course_lessons l where l.id = lesson_id)
  );

drop policy if exists "Members reset their own progress" on public.lesson_progress;
create policy "Members reset their own progress" on public.lesson_progress
  for delete to authenticated
  using (user_id = (select auth.uid()));

grant select, insert, delete on public.lesson_progress to authenticated;

-- ---------------------------------------------------------------------------
-- Activities: dikelola admin langsung dari SPA, pendaftaran berbasis akun
-- ---------------------------------------------------------------------------

drop policy if exists "Admins manage activities" on public.activities;
create policy "Admins manage activities" on public.activities
  for all to authenticated
  using ((select public.is_admin()))
  with check ((select public.is_admin()));

grant select, insert, update on public.activities to authenticated;

alter table public.activity_registrations
  add column if not exists user_id uuid references auth.users (id) on delete set null;
alter table public.activity_interests
  add column if not exists user_id uuid references auth.users (id) on delete set null;

create unique index if not exists activity_registrations_activity_user_idx
  on public.activity_registrations (activity_id, user_id) where user_id is not null;
create index if not exists activity_registrations_user_idx
  on public.activity_registrations (user_id);
create index if not exists activity_interests_user_idx
  on public.activity_interests (user_id);

drop policy if exists "Members read their own registrations" on public.activity_registrations;
create policy "Members read their own registrations" on public.activity_registrations
  for select to authenticated
  using (user_id = (select auth.uid()) or (select public.is_admin()));

drop policy if exists "Members read their own interests" on public.activity_interests;
create policy "Members read their own interests" on public.activity_interests
  for select to authenticated
  using (user_id = (select auth.uid()) or (select public.is_admin()));

grant select on public.activity_registrations, public.activity_interests to authenticated;

-- Daftar ke activity sebagai member. Nama & email diambil dari akun, jadi
-- tidak bisa dipakai untuk mendaftarkan orang lain.
create or replace function public.join_activity(p_activity_id uuid, p_whatsapp text default null, p_note text default null)
returns table (registration_id uuid, registration_status public.registration_status)
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_uid uuid := auth.uid();
  v_email text := lower(auth.jwt() ->> 'email');
  v_name text;
  v_activity public.activities%rowtype;
  v_existing public.activity_registrations%rowtype;
  v_confirmed integer;
  v_status public.registration_status;
begin
  if v_uid is null or v_email is null then
    raise exception 'login_required' using errcode = '28000';
  end if;

  select * into v_activity from public.activities
  where id = p_activity_id and is_public
  for update;

  if not found or v_activity.status not in ('registration_open', 'full') then
    raise exception 'registration_closed' using errcode = 'P0001';
  end if;

  -- Sudah pernah daftar (via akun ini, atau dulu sebagai tamu dengan email yang sama).
  select * into v_existing from public.activity_registrations r
  where r.activity_id = p_activity_id
    and (r.user_id = v_uid or lower(r.email) = v_email)
  order by r.created_at
  limit 1;

  if found and v_existing.status <> 'cancelled' then
    update public.activity_registrations set user_id = v_uid
    where id = v_existing.id and user_id is null;
    return query select v_existing.id, v_existing.status;
    return;
  end if;

  select count(*) into v_confirmed from public.activity_registrations
  where activity_id = p_activity_id and status = 'confirmed';

  v_status := case
    when v_activity.capacity is null or v_confirmed < v_activity.capacity then 'confirmed'
    else 'waitlisted'
  end::public.registration_status;

  select nullif(full_name, '') into v_name from public.profiles where id = v_uid;

  -- Pernah daftar lalu batal: aktifkan lagi baris yang sama.
  if v_existing.id is not null then
    update public.activity_registrations
    set status = v_status, user_id = v_uid,
        whatsapp = coalesce(nullif(trim(p_whatsapp), ''), whatsapp),
        note = coalesce(nullif(trim(p_note), ''), note)
    where id = v_existing.id;
    return query select v_existing.id, v_status;
    return;
  end if;

  return query
  insert into public.activity_registrations (activity_id, user_id, name, email, whatsapp, note, status)
  values (p_activity_id, v_uid, coalesce(v_name, split_part(v_email, '@', 1)), v_email,
          nullif(trim(p_whatsapp), ''), nullif(trim(p_note), ''), v_status)
  returning id, status;
end;
$$;

-- Batal daftar. Kalau yang batal memegang kursi, waitlist paling awal naik jadi confirmed.
create or replace function public.cancel_activity_registration(p_activity_id uuid)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_previous public.registration_status;
begin
  perform 1 from public.activities where id = p_activity_id for update;

  update public.activity_registrations r
  set status = 'cancelled'
  from (
    select id, status from public.activity_registrations
    where activity_id = p_activity_id and user_id = auth.uid() and status <> 'cancelled'
  ) old
  where r.id = old.id
  returning old.status into v_previous;

  if v_previous = 'confirmed' then
    update public.activity_registrations
    set status = 'confirmed'
    where id = (
      select id from public.activity_registrations
      where activity_id = p_activity_id and status = 'waitlisted'
      order by created_at
      limit 1
    );
  end if;
end;
$$;

-- "Ingatkan aku" untuk activity berstatus coming soon.
create or replace function public.follow_activity(p_activity_id uuid)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_uid uuid := auth.uid();
  v_email text := lower(auth.jwt() ->> 'email');
begin
  if v_uid is null or v_email is null then
    raise exception 'login_required' using errcode = '28000';
  end if;

  if not exists (select 1 from public.activities where id = p_activity_id and is_public) then
    raise exception 'activity_not_found' using errcode = 'P0002';
  end if;

  update public.activity_interests set user_id = v_uid
  where activity_id = p_activity_id and lower(email) = v_email and user_id is null;

  if not exists (
    select 1 from public.activity_interests
    where activity_id = p_activity_id and user_id = v_uid
  ) then
    insert into public.activity_interests (activity_id, user_id, email)
    values (p_activity_id, v_uid, v_email);
  end if;
end;
$$;

revoke all on function public.join_activity(uuid, text, text),
                       public.cancel_activity_registration(uuid),
                       public.follow_activity(uuid) from public;
grant execute on function public.join_activity(uuid, text, text),
                          public.cancel_activity_registration(uuid),
                          public.follow_activity(uuid) to authenticated;
