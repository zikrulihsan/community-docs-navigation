-- Poin "Yang akan dibahas" di halaman event (seperti "kisi-kisi obrolan" di poster).
-- Aman dijalankan ulang.

alter table public.activities
  add column if not exists highlights text[] not null default '{}' check (cardinality(highlights) <= 8);
