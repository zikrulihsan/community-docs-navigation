-- Topik rekomendasi jadi data: admin bisa menambah, mengganti nama, atau menghapus
-- tanpa deploy. recommendations.topics tetap menyimpan nama topik; ganti nama &
-- hapus ikut diterapkan ke rekomendasi yang memakainya.
--
-- Admin juga bisa mengaitkan rekomendasi tambahannya ke member (submitted_by),
-- dan nama member itu ikut tampil di kartu.
-- Aman dijalankan ulang.

create table if not exists public.recommendation_topics (
  name text primary key check (char_length(name) between 2 and 40),
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

insert into public.recommendation_topics (name, sort_order) values
  ('AI terkini', 10), ('CS fundamental', 20), ('English speaking', 30), ('Backend', 40),
  ('Frontend', 50), ('Mobile dev', 60), ('Infra & DevOps', 70), ('Managerial', 80),
  ('Karier & loker', 90), ('System design', 100), ('Personal project', 110), ('Buku', 120),
  ('Hidup sehat', 130)
on conflict (name) do nothing;

alter table public.recommendation_topics enable row level security;

drop policy if exists "Recommendation topics are readable" on public.recommendation_topics;
create policy "Recommendation topics are readable" on public.recommendation_topics
  for select to anon, authenticated
  using (true);

drop policy if exists "Admins manage recommendation topics" on public.recommendation_topics;
create policy "Admins manage recommendation topics" on public.recommendation_topics
  for all to authenticated
  using ((select public.is_admin()))
  with check ((select public.is_admin()));

grant select on public.recommendation_topics to anon;
grant select, insert, update, delete on public.recommendation_topics to authenticated;

-- Ganti nama / hapus topik → rapikan rekomendasi yang memakainya.
create or replace function public.sync_recommendation_topic()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if tg_op = 'DELETE' then
    update public.recommendations set topics = array_remove(topics, old.name) where old.name = any (topics);
  elsif new.name <> old.name then
    update public.recommendations set topics = array_replace(topics, old.name, new.name) where old.name = any (topics);
  end if;
  return null;
end;
$$;

drop trigger if exists recommendation_topics_sync on public.recommendation_topics;
create trigger recommendation_topics_sync after update of name or delete on public.recommendation_topics
  for each row execute function public.sync_recommendation_topic();

-- Rekomendasi hanya boleh memakai topik yang terdaftar.
create or replace function public.check_recommendation_topics()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if exists (
    select 1 from unnest(new.topics) t
    where not exists (select 1 from public.recommendation_topics rt where rt.name = t)
  ) then
    raise exception 'Ada topik yang tidak terdaftar. Muat ulang halaman lalu pilih lagi.' using errcode = '22023';
  end if;
  return new;
end;
$$;

drop trigger if exists recommendations_check_topics on public.recommendations;
create trigger recommendations_check_topics before insert or update of topics on public.recommendations
  for each row execute function public.check_recommendation_topics();

-- Direktori publik: pengusul tampil juga untuk tambahan admin yang dikaitkan ke member.
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
    select r.submitted_by is not null and r.show_recommender
       and p.onboarded_at is not null and coalesce(p.full_name, '') <> '' as visible
  ) v
  where r.status = 'approved'
    and not (r.category = 'acara' and r.event_date < (now() at time zone 'Asia/Jakarta')::date)
  order by r.is_featured desc, r.featured_order, r.created_at desc;
$$;
