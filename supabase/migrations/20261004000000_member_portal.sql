-- Portal member berbayar (rilis 1).
--
-- Komunitas WhatsApp tetap gratis; swegrowth.id adalah portal untuk member
-- berbayar. Pembayaran terjadi di goakal, lalu admin mengaktifkan member di
-- /admin dengan tanggal berakhir. Semua isi khusus member dijaga is_member().
-- Aman dijalankan ulang.

-- ---------------------------------------------------------------------------
-- Course internal tidak dipakai (course ada di goakal). Tabelnya masih kosong.
-- ---------------------------------------------------------------------------

drop function if exists public.course_outline(text);
drop function if exists public.course_stats();
drop table if exists public.lesson_progress;
drop table if exists public.course_lessons;
drop table if exists public.courses;

-- ---------------------------------------------------------------------------
-- Profil: email (untuk dicocokkan admin dengan pembayar goakal) + WhatsApp.
-- Profil tidak lagi publik.
-- ---------------------------------------------------------------------------

alter table public.profiles add column if not exists email text;
alter table public.profiles add column if not exists whatsapp text
  check (whatsapp ~ '^\+?[0-9 -]{8,20}$');

update public.profiles p set email = lower(u.email)
from auth.users u
where u.id = p.id and p.email is null;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (
    new.id,
    lower(new.email),
    left(coalesce(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name', ''), 80),
    new.raw_user_meta_data ->> 'avatar_url'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop policy if exists "Onboarded profiles are public" on public.profiles;
drop policy if exists "Members read own profile, admins read all" on public.profiles;
create policy "Members read own profile, admins read all" on public.profiles
  for select to authenticated
  using (id = (select auth.uid()) or (select public.is_admin()));

revoke select on public.profiles from anon;
-- email diisi trigger, tidak bisa diubah member.
revoke update on public.profiles from authenticated;
grant update (full_name, headline, company, avatar_url, whatsapp, onboarded_at)
  on public.profiles to authenticated;

-- ---------------------------------------------------------------------------
-- Membership
-- ---------------------------------------------------------------------------

create table if not exists public.memberships (
  user_id uuid primary key references public.profiles (id) on delete cascade,
  active_until date not null,
  goakal_ref text check (char_length(goakal_ref) <= 120),
  note text check (char_length(note) <= 500),
  activated_by uuid references auth.users (id) on delete set null,
  activated_at timestamptz not null default now()
);

alter table public.memberships enable row level security;

drop policy if exists "Members read own membership" on public.memberships;
create policy "Members read own membership" on public.memberships
  for select to authenticated
  using (user_id = (select auth.uid()) or (select public.is_admin()));

drop policy if exists "Admins manage memberships" on public.memberships;
create policy "Admins manage memberships" on public.memberships
  for all to authenticated
  using ((select public.is_admin()))
  with check ((select public.is_admin()));

grant select, insert, update, delete on public.memberships to authenticated;

-- Member aktif = masa aktif belum lewat (tanggal WIB). Admin selalu dianggap member.
create or replace function public.is_member()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select public.is_admin() or exists (
    select 1 from public.memberships m
    where m.user_id = auth.uid()
      and m.active_until >= (now() at time zone 'Asia/Jakarta')::date
  );
$$;

revoke all on function public.is_member() from public;
grant execute on function public.is_member() to anon, authenticated;

-- ---------------------------------------------------------------------------
-- Kurator (penulis feed, dipakai di rilis 2)
-- ---------------------------------------------------------------------------

create table if not exists public.curators (
  user_id uuid primary key references public.profiles (id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table public.curators enable row level security;

drop policy if exists "Admins manage curators" on public.curators;
create policy "Admins manage curators" on public.curators
  for all to authenticated
  using ((select public.is_admin()))
  with check ((select public.is_admin()));

grant select, insert, delete on public.curators to authenticated;

create or replace function public.is_curator()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select public.is_admin() or exists (select 1 from public.curators c where c.user_id = auth.uid());
$$;

revoke all on function public.is_curator() from public;
grant execute on function public.is_curator() to anon, authenticated;

-- ---------------------------------------------------------------------------
-- Grup WhatsApp khusus member
-- ---------------------------------------------------------------------------

create table if not exists public.whatsapp_groups (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 2 and 80),
  description text not null default '' check (char_length(description) <= 300),
  invite_url text not null check (invite_url ~ '^https://'),
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

alter table public.whatsapp_groups enable row level security;

drop policy if exists "Members read groups" on public.whatsapp_groups;
create policy "Members read groups" on public.whatsapp_groups
  for select to authenticated
  using ((select public.is_member()));

drop policy if exists "Admins manage groups" on public.whatsapp_groups;
create policy "Admins manage groups" on public.whatsapp_groups
  for all to authenticated
  using ((select public.is_admin()))
  with check ((select public.is_admin()));

grant select, insert, update, delete on public.whatsapp_groups to authenticated;

-- ---------------------------------------------------------------------------
-- Info event khusus member: link meeting & rekaman tidak ikut tabel publik.
-- ---------------------------------------------------------------------------

create table if not exists public.activity_member_info (
  activity_id uuid primary key references public.activities (id) on delete cascade,
  meeting_url text check (meeting_url ~ '^https://'),
  recording_url text check (recording_url ~ '^https://'),
  updated_at timestamptz not null default now()
);

alter table public.activity_member_info enable row level security;

drop policy if exists "Members read event info" on public.activity_member_info;
create policy "Members read event info" on public.activity_member_info
  for select to authenticated
  using ((select public.is_member()));

drop policy if exists "Admins manage event info" on public.activity_member_info;
create policy "Admins manage event info" on public.activity_member_info
  for all to authenticated
  using ((select public.is_admin()))
  with check ((select public.is_admin()));

grant select, insert, update, delete on public.activity_member_info to authenticated;

-- ---------------------------------------------------------------------------
-- Daftar / ingatkan event hanya untuk member aktif.
-- ---------------------------------------------------------------------------

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
  v_whatsapp text;
  v_activity public.activities%rowtype;
  v_existing public.activity_registrations%rowtype;
  v_confirmed integer;
  v_status public.registration_status;
begin
  if v_uid is null or v_email is null then
    raise exception 'login_required' using errcode = '28000';
  end if;

  if not public.is_member() then
    raise exception 'membership_required' using errcode = '42501';
  end if;

  select * into v_activity from public.activities
  where id = p_activity_id and is_public
  for update;

  if not found or v_activity.status not in ('registration_open', 'full') then
    raise exception 'registration_closed' using errcode = 'P0001';
  end if;

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

  select nullif(full_name, ''), whatsapp into v_name, v_whatsapp from public.profiles where id = v_uid;
  v_whatsapp := coalesce(nullif(trim(p_whatsapp), ''), v_whatsapp);

  if v_existing.id is not null then
    update public.activity_registrations
    set status = v_status, user_id = v_uid,
        whatsapp = coalesce(v_whatsapp, whatsapp),
        note = coalesce(nullif(trim(p_note), ''), note)
    where id = v_existing.id;
    return query select v_existing.id, v_status;
    return;
  end if;

  return query
  insert into public.activity_registrations (activity_id, user_id, name, email, whatsapp, note, status)
  values (p_activity_id, v_uid, coalesce(v_name, split_part(v_email, '@', 1)), v_email,
          v_whatsapp, nullif(trim(p_note), ''), v_status)
  returning id, status;
end;
$$;

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

  if not public.is_member() then
    raise exception 'membership_required' using errcode = '42501';
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

revoke all on function public.join_activity(uuid, text, text), public.follow_activity(uuid) from public;
grant execute on function public.join_activity(uuid, text, text), public.follow_activity(uuid) to authenticated;
