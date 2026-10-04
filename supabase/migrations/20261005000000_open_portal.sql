-- Portal terbuka untuk semua akun.
--
-- Siapa pun yang login bisa memakai portal: agenda, pendaftaran kegiatan, dan
-- grup WhatsApp. Membership berbayar sekarang berarti "verified member":
-- badge di portal plus isi khusus verified (rekaman kegiatan).
-- Aman dijalankan ulang.

-- Grup WhatsApp: semua akun yang login.
drop policy if exists "Members read groups" on public.whatsapp_groups;
drop policy if exists "Signed-in users read groups" on public.whatsapp_groups;
create policy "Signed-in users read groups" on public.whatsapp_groups
  for select to authenticated
  using (true);

-- Daftar / ingatkan kegiatan: semua akun yang login (cek is_member() dibuang).
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

-- Link kegiatan: link meeting untuk peserta terkonfirmasi (dan verified/admin),
-- rekaman hanya untuk verified member (has_recording supaya akun lain tahu
-- rekamannya ada). Tabelnya sendiri tetap khusus verified.
create or replace function public.activity_links(p_activity_id uuid)
returns table (meeting_url text, recording_url text, has_recording boolean)
language sql
stable
security definer
set search_path = ''
as $$
  select
    case
      when public.is_member() or exists (
        select 1 from public.activity_registrations r
        where r.activity_id = p_activity_id and r.user_id = auth.uid() and r.status = 'confirmed'
      ) then i.meeting_url
    end,
    case when public.is_member() then i.recording_url end,
    i.recording_url is not null
  from public.activity_member_info i
  where i.activity_id = p_activity_id and auth.uid() is not null;
$$;

revoke all on function public.activity_links(uuid) from public;
grant execute on function public.activity_links(uuid) to authenticated;
