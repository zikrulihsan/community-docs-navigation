-- Alur pendaftaran event yang lebih rapi.
--
-- - Harga per event (0 = gratis). Event berbayar belum bisa didaftar sampai
--   pembayaran tersedia.
-- - Pertanyaan pendaftaran per event (registration_fields), jawabannya di
--   activity_registrations.answers.
-- - join_activity() baru: nama & WhatsApp dari form (terisi dari profil),
--   validasi pertanyaan wajib, isi profil yang masih kosong.
-- - Link meeting baru terbuka 1 jam sebelum acara (admin selalu bisa lihat).
-- Aman dijalankan ulang.

-- ---------------------------------------------------------------------------
-- Kolom baru
-- ---------------------------------------------------------------------------

alter table public.activities
  add column if not exists price_idr integer not null default 0 check (price_idr >= 0),
  -- [{ id, label, type: 'text' | 'textarea' | 'select', required, options?: text[] }]
  add column if not exists registration_fields jsonb not null
    default '[{"id": "pertanyaan", "label": "Pertanyaan untuk pembicara", "type": "textarea", "required": false}]'
    check (jsonb_typeof(registration_fields) = 'array' and jsonb_array_length(registration_fields) <= 10);

alter table public.activity_registrations
  add column if not exists answers jsonb not null default '{}' check (jsonb_typeof(answers) = 'object');

-- ---------------------------------------------------------------------------
-- Daftar
-- ---------------------------------------------------------------------------

drop function if exists public.join_activity(uuid, text, text);

create or replace function public.join_activity(
  p_activity_id uuid,
  p_name text,
  p_whatsapp text,
  p_answers jsonb default '{}'
)
returns table (registration_id uuid, registration_status public.registration_status)
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_uid uuid := auth.uid();
  v_email text := lower(auth.jwt() ->> 'email');
  v_name text;
  v_whatsapp text := nullif(trim(p_whatsapp), '');
  v_answers jsonb := '{}';
  v_field jsonb;
  v_value text;
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

  if v_activity.price_idr > 0 then
    raise exception 'payment_required' using errcode = 'P0001';
  end if;

  if v_whatsapp is null or v_whatsapp !~ '^\+?[0-9 -]{8,20}$' then
    raise exception 'whatsapp_required' using errcode = '22023';
  end if;

  select left(coalesce(nullif(trim(p_name), ''), nullif(p.full_name, ''), split_part(v_email, '@', 1)), 80)
  into v_name
  from public.profiles p where p.id = v_uid;

  -- Simpan hanya jawaban untuk pertanyaan event ini; yang wajib harus diisi.
  for v_field in select * from jsonb_array_elements(v_activity.registration_fields) loop
    v_value := left(trim(coalesce(p_answers ->> (v_field ->> 'id'), '')), 2000);
    if coalesce((v_field ->> 'required')::boolean, false) and v_value = '' then
      raise exception 'answer_required' using errcode = '22023';
    end if;
    if v_value <> '' then
      v_answers := v_answers || jsonb_build_object(v_field ->> 'id', v_value);
    end if;
  end loop;

  -- Data dari form melengkapi profil yang masih kosong.
  update public.profiles
  set full_name = case when full_name = '' then v_name else full_name end,
      whatsapp = coalesce(whatsapp, v_whatsapp)
  where id = v_uid;

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

  if v_existing.id is not null then
    update public.activity_registrations
    set status = v_status, user_id = v_uid, name = v_name, whatsapp = v_whatsapp,
        answers = v_answers, note = v_answers ->> 'pertanyaan'
    where id = v_existing.id;
    return query select v_existing.id, v_status;
    return;
  end if;

  return query
  insert into public.activity_registrations (activity_id, user_id, name, email, whatsapp, answers, note, status)
  values (p_activity_id, v_uid, v_name, v_email, v_whatsapp, v_answers, v_answers ->> 'pertanyaan', v_status)
  returning id, status;
end;
$$;

revoke all on function public.join_activity(uuid, text, text, jsonb) from public;
grant execute on function public.join_activity(uuid, text, text, jsonb) to authenticated;

-- ---------------------------------------------------------------------------
-- Link kegiatan: meeting untuk peserta terkonfirmasi mulai 1 jam sebelum acara.
-- meeting_opens_at memberi tahu kapan link-nya terbuka.
-- ---------------------------------------------------------------------------

drop function if exists public.activity_links(uuid);

create or replace function public.activity_links(p_activity_id uuid)
returns table (
  meeting_url text,
  recording_url text,
  has_meeting boolean,
  has_recording boolean,
  meeting_opens_at timestamptz
)
language sql
stable
security definer
set search_path = ''
as $$
  select
    case
      when public.is_admin() then i.meeting_url
      when exists (
        select 1 from public.activity_registrations r
        where r.activity_id = p_activity_id and r.user_id = auth.uid() and r.status = 'confirmed'
      ) and (a.starts_at is null or now() >= a.starts_at - interval '1 hour') then i.meeting_url
    end,
    case when public.is_member() then i.recording_url end,
    i.meeting_url is not null,
    i.recording_url is not null,
    a.starts_at - interval '1 hour'
  from public.activities a
  left join public.activity_member_info i on i.activity_id = a.id
  where a.id = p_activity_id and auth.uid() is not null;
$$;

revoke all on function public.activity_links(uuid) from public;
grant execute on function public.activity_links(uuid) to authenticated;
