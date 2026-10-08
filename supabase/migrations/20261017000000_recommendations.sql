-- Rekomendasi tempat grow: acara, komunitas, course, buku, podcast, YouTube,
-- newsletter, dan lainnya. Diisi admin (langsung tayang, "Pilihan SWE Growth")
-- atau diusulkan member (antre, diverifikasi admin dulu).
--
-- Publik membaca lewat published_recommendations(); member mengusulkan lewat
-- submit_recommendation(). Tabelnya sendiri hanya terbaca pemilik usulan & admin.
-- Aman dijalankan ulang.

create table if not exists public.recommendations (
  id uuid primary key default gen_random_uuid(),
  category text not null check (category in ('acara', 'komunitas', 'course', 'buku', 'podcast', 'youtube', 'newsletter', 'lainnya')),
  title text not null check (char_length(title) between 2 and 120),
  url text not null check (url ~ '^https://'),
  reason text not null check (char_length(reason) between 10 and 300),
  organizer text not null default '' check (char_length(organizer) <= 120),
  topics text[] not null default '{}' check (cardinality(topics) <= 5),
  price text check (price in ('gratis', 'berbayar', 'freemium')),
  language text check (language in ('id', 'en')),
  event_date date,
  event_mode text check (event_mode in ('online', 'offline', 'hybrid')),
  location text not null default '' check (char_length(location) <= 80),
  -- Link afiliasi hanya yang resmi milik SWE Growth; hanya admin yang bisa menandai.
  is_affiliate boolean not null default false,
  source text not null default 'admin' check (source in ('admin', 'member')),
  submitted_by uuid references public.profiles (id) on delete set null,
  show_recommender boolean not null default true,
  status text not null default 'approved' check (status in ('pending', 'approved', 'rejected', 'hidden')),
  is_featured boolean not null default false,
  featured_order integer not null default 0,
  reviewed_by uuid references auth.users (id) on delete set null,
  reviewed_at timestamptz,
  reject_reason text check (reject_reason in ('duplikat', 'kurang_relevan', 'link_mati', 'promosi', 'tidak_sesuai_coc')),
  reject_note text not null default '' check (char_length(reject_note) <= 300),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists recommendations_status_idx on public.recommendations (status);
create index if not exists recommendations_submitted_by_idx on public.recommendations (submitted_by);

-- Satu link hanya boleh ada sekali di antre/direktori (yang ditolak boleh diusulkan ulang).
create or replace function public.normalize_recommendation_url(p_url text)
returns text
language sql
immutable
set search_path = ''
as $$
  select lower(regexp_replace(trim(p_url), '/+$', ''));
$$;

create unique index if not exists recommendations_url_unique
  on public.recommendations (public.normalize_recommendation_url(url))
  where status in ('pending', 'approved', 'hidden');

drop trigger if exists recommendations_touch on public.recommendations;
create trigger recommendations_touch before update on public.recommendations
  for each row execute function public.touch_updated_at();

alter table public.recommendations enable row level security;

drop policy if exists "Admins manage recommendations" on public.recommendations;
create policy "Admins manage recommendations" on public.recommendations
  for all to authenticated
  using ((select public.is_admin()))
  with check ((select public.is_admin()));

drop policy if exists "Members read own recommendations" on public.recommendations;
create policy "Members read own recommendations" on public.recommendations
  for select to authenticated
  using (submitted_by = (select auth.uid()));

drop policy if exists "Members withdraw pending recommendations" on public.recommendations;
create policy "Members withdraw pending recommendations" on public.recommendations
  for delete to authenticated
  using (submitted_by = (select auth.uid()) and status = 'pending');

grant select, insert, update, delete on public.recommendations to authenticated;

-- ---------------------------------------------------------------------------
-- Direktori publik: hanya yang tayang, acara yang sudah lewat tidak ikut.
-- Nama, handle, & foto pengusul hanya kalau ia mengizinkan dan profilnya publik.
-- ---------------------------------------------------------------------------

create or replace function public.published_recommendations()
returns table (
  id uuid,
  category text,
  title text,
  url text,
  reason text,
  organizer text,
  topics text[],
  price text,
  language text,
  event_date date,
  event_mode text,
  location text,
  is_affiliate boolean,
  source text,
  is_featured boolean,
  featured_order integer,
  recommender_name text,
  recommender_handle text,
  recommender_avatar_url text,
  created_at timestamptz
)
language sql
stable
security definer
set search_path = ''
as $$
  select r.id, r.category, r.title, r.url, r.reason, r.organizer, r.topics, r.price, r.language,
         r.event_date, r.event_mode, r.location, r.is_affiliate, r.source, r.is_featured, r.featured_order,
         case when v.visible then p.full_name end,
         case when v.visible then coalesce(p.username, p.id::text) end,
         case when v.visible then p.avatar_url end,
         r.created_at
  from public.recommendations r
  left join public.profiles p on p.id = r.submitted_by
  cross join lateral (
    select r.source = 'member' and r.show_recommender
       and p.onboarded_at is not null and coalesce(p.full_name, '') <> '' as visible
  ) v
  where r.status = 'approved'
    and not (r.category = 'acara' and r.event_date < (now() at time zone 'Asia/Jakarta')::date)
  order by r.is_featured desc, r.featured_order, r.created_at desc;
$$;

revoke all on function public.published_recommendations() from public;
grant execute on function public.published_recommendations() to anon, authenticated;

-- ---------------------------------------------------------------------------
-- Cek link sebelum kirim: sudah ada di direktori / sedang antre?
-- ---------------------------------------------------------------------------

create or replace function public.check_recommendation_url(p_url text, p_exclude_id uuid default null)
returns table (title text, status text)
language sql
stable
security definer
set search_path = ''
as $$
  select r.title, r.status
  from public.recommendations r
  where public.normalize_recommendation_url(r.url) = public.normalize_recommendation_url(p_url)
    and r.status in ('pending', 'approved', 'hidden')
    and (p_exclude_id is null or r.id <> p_exclude_id)
  limit 1;
$$;

revoke all on function public.check_recommendation_url(text, uuid) from public;
grant execute on function public.check_recommendation_url(text, uuid) to authenticated;

-- ---------------------------------------------------------------------------
-- Member mengusulkan (atau mengedit usulannya yang masih menunggu).
-- Status selalu pending, tidak bisa featured, tidak bisa menandai afiliasi.
-- ---------------------------------------------------------------------------

create or replace function public.submit_recommendation(
  p_category text,
  p_title text,
  p_url text,
  p_reason text,
  p_organizer text default '',
  p_topics text[] default '{}',
  p_price text default null,
  p_language text default null,
  p_event_date date default null,
  p_event_mode text default null,
  p_location text default '',
  p_show_recommender boolean default true,
  p_id uuid default null
)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_uid uuid := auth.uid();
  v_id uuid;
  v_is_event boolean := p_category = 'acara';
begin
  if v_uid is null then
    raise exception 'Masuk dulu untuk mengirim rekomendasi.' using errcode = '28000';
  end if;
  if not public.has_complete_profile() then
    raise exception 'Lengkapi profil dulu sebelum mengirim rekomendasi.' using errcode = '42501';
  end if;
  if char_length(trim(coalesce(p_reason, ''))) < 30 then
    raise exception 'Ceritakan alasanmu minimal 30 karakter.' using errcode = '22023';
  end if;
  if cardinality(coalesce(p_topics, '{}')) > 3 then
    raise exception 'Pilih maksimal 3 topik.' using errcode = '22023';
  end if;
  if exists (
    select 1 from public.recommendations r
    where public.normalize_recommendation_url(r.url) = public.normalize_recommendation_url(p_url)
      and r.status in ('pending', 'approved', 'hidden')
      and (p_id is null or r.id <> p_id)
  ) then
    raise exception 'Link ini sudah ada di direktori atau sedang direview.' using errcode = '23505';
  end if;

  if p_id is null then
    if (select count(*) from public.recommendations where submitted_by = v_uid and status = 'pending') >= 5 then
      raise exception 'Kamu masih punya 5 rekomendasi yang menunggu review. Tunggu sebagian diproses dulu, ya.' using errcode = '54000';
    end if;

    insert into public.recommendations (
      category, title, url, reason, organizer, topics, price, language,
      event_date, event_mode, location, source, submitted_by, show_recommender, status
    ) values (
      p_category, trim(p_title), trim(p_url), trim(p_reason), trim(coalesce(p_organizer, '')), coalesce(p_topics, '{}'),
      p_price, p_language,
      case when v_is_event then p_event_date end, case when v_is_event then p_event_mode end,
      case when v_is_event then trim(coalesce(p_location, '')) else '' end,
      'member', v_uid, coalesce(p_show_recommender, true), 'pending'
    )
    returning id into v_id;
  else
    update public.recommendations set
      category = p_category, title = trim(p_title), url = trim(p_url), reason = trim(p_reason),
      organizer = trim(coalesce(p_organizer, '')), topics = coalesce(p_topics, '{}'),
      price = p_price, language = p_language,
      event_date = case when v_is_event then p_event_date end,
      event_mode = case when v_is_event then p_event_mode end,
      location = case when v_is_event then trim(coalesce(p_location, '')) else '' end,
      show_recommender = coalesce(p_show_recommender, true)
    where id = p_id and submitted_by = v_uid and status = 'pending'
    returning id into v_id;

    if v_id is null then
      raise exception 'Rekomendasi ini sudah direview, jadi tidak bisa diedit lagi.' using errcode = '42501';
    end if;
  end if;

  return v_id;
end;
$$;

revoke all on function public.submit_recommendation(text, text, text, text, text, text[], text, text, date, text, text, boolean, uuid) from public;
grant execute on function public.submit_recommendation(text, text, text, text, text, text[], text, text, date, text, text, boolean, uuid) to authenticated;
