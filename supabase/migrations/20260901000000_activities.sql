-- Fondasi activity (event/kelas): tabel, enum, dan RLS dasar.
-- Dulu dibuat manual di project lama; file ini membuatnya dari nol untuk
-- database baru. Aman dijalankan ulang.

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

do $$ begin
  create type public.activity_status as enum (
    'coming_soon', 'scheduled', 'registration_open', 'full', 'completed', 'cancelled'
  );
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.registration_status as enum ('confirmed', 'waitlisted', 'cancelled');
exception when duplicate_object then null; end $$;

create table if not exists public.activities (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  title text not null check (char_length(title) between 3 and 140),
  summary text not null default '',
  description text not null default '',
  activity_type text not null default 'event',
  status public.activity_status not null default 'coming_soon',
  mode text check (mode in ('online', 'offline', 'hybrid')),
  location text,
  speaker text,
  capacity integer check (capacity > 0),
  is_public boolean not null default true,
  image_url text,
  starts_at timestamptz,
  ends_at timestamptz,
  registration_opens_at timestamptz,
  registration_closes_at timestamptz,
  timezone text not null default 'Asia/Jakarta',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists activities_public_starts_idx on public.activities (is_public, starts_at);

-- Daftar email admin. Tidak bisa dibaca dari browser sama sekali; dicek lewat is_admin().
create table if not exists public.activity_admin_emails (
  email text primary key check (email = lower(email)),
  created_at timestamptz not null default now()
);

create table if not exists public.activity_interests (
  id uuid primary key default gen_random_uuid(),
  activity_id uuid not null references public.activities (id) on delete cascade,
  email text not null,
  whatsapp text,
  created_at timestamptz not null default now()
);

create unique index if not exists activity_interests_activity_email_idx
  on public.activity_interests (activity_id, lower(email));

create table if not exists public.activity_registrations (
  id uuid primary key default gen_random_uuid(),
  activity_id uuid not null references public.activities (id) on delete cascade,
  name text not null,
  email text not null,
  whatsapp text,
  note text,
  status public.registration_status not null default 'confirmed',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists activity_registrations_activity_email_idx
  on public.activity_registrations (activity_id, lower(email));

drop trigger if exists activities_touch_updated_at on public.activities;
create trigger activities_touch_updated_at
  before update on public.activities
  for each row execute function public.touch_updated_at();

drop trigger if exists activity_registrations_touch_updated_at on public.activity_registrations;
create trigger activity_registrations_touch_updated_at
  before update on public.activity_registrations
  for each row execute function public.touch_updated_at();

alter table public.activities enable row level security;
alter table public.activity_admin_emails enable row level security;
alter table public.activity_interests enable row level security;
alter table public.activity_registrations enable row level security;

drop policy if exists "Public activities are readable" on public.activities;
create policy "Public activities are readable" on public.activities
  for select to anon, authenticated
  using (is_public);

grant select on public.activities to anon, authenticated;
