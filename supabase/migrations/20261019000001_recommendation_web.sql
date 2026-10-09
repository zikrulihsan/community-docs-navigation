-- Kategori rekomendasi baru: web (blog, dokumentasi, roadmap, tools online).
-- Aman dijalankan ulang.

alter table public.recommendations drop constraint if exists recommendations_category_check;
alter table public.recommendations add constraint recommendations_category_check
  check (category in ('acara', 'komunitas', 'course', 'buku', 'podcast', 'youtube', 'newsletter', 'web', 'lainnya'));
