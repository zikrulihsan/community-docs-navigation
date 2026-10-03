# SWE Growth — Platform Komunitas

Website komunitas [SWE Growth](https://swegrowth.id). Awalnya landing page, sekarang mulai jadi **platform member**
(arahnya mirip jointaro.com). Isinya: akun member, dashboard, course dengan progress belajar, event dengan pendaftaran
berbasis akun, plus konten editorial (blog, loker, video, mentor).

Stack: **React 19 + React Router 8 (framework mode di atas Vite)**, Supabase (Postgres + Auth + RLS), deploy di Netlify.

## Arsitektur

Tidak ada server runtime. Semuanya file statis di Netlify:

| Bagian | Cara render | Sumber data |
| --- | --- | --- |
| Landing, blog, loker, video, mentor, CoC | **Prerender** saat build (HTML penuh, bagus untuk SEO) | `content/` (markdown/YAML) |
| Event & detail event | Prerender + **refresh live** di browser (`clientLoader`) | `content/events` + tabel `activities` |
| Course, lesson, profil publik `/u/:username` | SPA | Supabase |
| Masuk, onboarding, dashboard, admin | SPA, wajib login | Supabase |

Path tanpa file prerender (mis. activity yang dibuat setelah deploy) dilayani `__spa-fallback.html` lewat redirect di
`netlify.toml`.

Karena tidak ada server, **tidak ada secret key di aplikasi**. Hak akses sepenuhnya dijaga di database: RLS + fungsi
`SECURITY DEFINER` di `supabase/migrations/`. Tamu hanya bisa membaca lesson berlabel *preview*, member hanya bisa
membaca/menulis datanya sendiri, dan admin adalah user yang emailnya ada di `activity_admin_emails`.

## Menjalankan lokal

Butuh Node ≥ 22.22 (lihat `.nvmrc`).

```bash
cp .env.example .env   # isi VITE_SUPABASE_URL & VITE_SUPABASE_PUBLISHABLE_KEY
npm install
npm run dev        # http://localhost:4321
npm run typecheck  # typegen route + tsc
npm run build      # output ke build/client
```

Tanpa `.env`, halaman konten tetap jalan; fitur member menampilkan pesan "belum dikonfigurasi".

## Setup Supabase (sekali)

1. **Jalankan migration** di `supabase/migrations/` **berurutan sesuai nama file**: `20260901000000_activities.sql`
   (tabel activity, pendaftar, minat, daftar admin) lalu `20261001000000_member_platform.sql`. Bisa lewat SQL editor
   di dashboard atau `supabase db push`. Keduanya aman dijalankan ulang. Isi migration kedua: `profiles` (dibuat otomatis untuk tiap user
   baru), `courses`, `course_lessons`, `lesson_progress`, kolom `user_id` di pendaftaran/minat activity, dan RPC
   `join_activity`, `cancel_activity_registration` (otomatis menaikkan waitlist), `follow_activity`,
   `course_outline`, `course_stats`, `is_admin`.
2. **Auth → Providers**: aktifkan Email (magic link) dan Google, serta izinkan sign-up user baru.
3. **Auth → URL Configuration**: Site URL `https://swegrowth.id`; Redirect URLs `https://swegrowth.id/auth/callback`
   dan `http://localhost:4321/auth/callback`.
4. **Admin**: tambahkan email ke tabel `activity_admin_emails`, login lewat `/masuk`, lalu buka `/admin`.
5. Setelah migration, regenerate tipe: `npx supabase gen types typescript --project-id <project-ref> > app/lib/database.types.ts`.

Di Netlify, set `VITE_SUPABASE_URL` dan `VITE_SUPABASE_PUBLISHABLE_KEY` (env lama `SUPABASE_SECRET_KEY` & `PUBLIC_SITE_URL`
sudah tidak dipakai, sebaiknya dihapus).

## Struktur

```
app/
├── root.tsx            # <html>, Nav/Footer, AuthProvider, error page
├── routes.ts           # peta URL → file route
├── routes/             # satu file per halaman
├── components/         # Nav, Footer, WaChat, ProfileForm, MemberHeader, …
├── lib/
│   ├── content.server.ts  # baca & validasi content/ (hanya saat build)
│   ├── supabase.ts        # client browser
│   ├── auth.tsx           # sesi, profil, requireUser/requireAdmin
│   └── activities.ts, courses.ts, format.ts, …
└── styles/             # global.css (design token), pages.css, app.css, wa-chat.css
content/                # konten editorial — ini yang biasanya kamu edit
supabase/migrations/    # skema & RLS
```

## Mengelola course & event

Dari `/admin`:

- **Event & activity**: buat activity (bisa sebagai teaser *coming soon*), ubah status, lihat daftar pendaftar.
  Member mendaftar pakai akunnya; kapasitas penuh → waitlist, dan saat ada yang batal, waitlist paling awal naik otomatis.
- **Course & materi**: buat course (draft), tambah lesson (markdown + URL YouTube opsional), tandai lesson *preview*
  agar bisa dibuka tanpa login, lalu terbitkan.

Activity baru langsung tampil di `/events` tanpa deploy. Supaya halaman detailnya juga punya HTML prerender (SEO),
cukup trigger deploy ulang. Bisa diotomatiskan dengan Netlify build hook.

## Menambah konten editorial

Nama file jadi URL-nya. Contoh `content/events/kelas-git.md` → `/events/kelas-git`.

### Event (markdown)

```markdown
---
title: "Kelas Online: Judul Kelas"
description: "Ringkasan satu-dua kalimat."
date: 2026-12-01
time: "19.30 – 21.00 WIB"
mode: online              # online | offline | hybrid
location: "Google Meet"
speaker: "Nama Pembicara"  # opsional
registrationOpen: true
# registrationUrl: "https://..."  # opsional, kalau pakai form eksternal
---

Detail acara ditulis di sini pakai markdown.
```

Event otomatis masuk ke bagian **Akan datang** atau **Sudah lewat** berdasarkan tanggalnya.
Kalau `registrationOpen: true` dan tanggalnya belum lewat, form pendaftaran muncul otomatis.

### Tulisan blog

```markdown
---
title: "Judul Tulisan"
description: "Ringkasan buat kartu & SEO."
pubDate: 2026-08-16
author: "Nama Penulis"
---
```

### Lowongan kerja

```markdown
---
role: "Backend Engineer"
company: "Nama Perusahaan"
location: "Remote (Indonesia)"
type: full-time           # full-time | part-time | contract | freelance | internship
applyUrl: "https://..."
postedDate: 2026-08-16
active: true              # set false buat menyembunyikan tanpa menghapus
---
```

### Video (`.yaml`)

```yaml
title: "Judul Video"
description: "Ringkasan singkat."
url: "https://www.youtube.com/watch?v=..."
youtubeId: "xxxxxxxxxxx"   # opsional, biar thumbnail muncul
category: "Sharing Session"
publishedDate: 2026-08-16
```

### Mentor (`.yaml`)

```yaml
name: "Nama Mentor"
role: "Senior Backend Engineer"
company: "Nama Perusahaan"   # opsional
topics: ["Backend", "System Design"]
linkedin: "https://linkedin.com/in/..."  # opsional
available: true
```

Kalau format frontmatter-nya salah, `npm run build` bakal gagal dengan pesan yang jelas —
jadi konten rusak nggak akan sampai ke production.

## Formulir

Event lama berbasis markdown tetap memakai **Netlify Forms** (`event-registration`, diarahkan ke `/terima-kasih`,
honeypot `bot-field`). Activity dari admin memakai pendaftaran akun member.

## Alur mentorship

`/mentorship` menampilkan daftar mentor (`content/mentors/*.yaml`, diinput manual oleh admin). Form Mentor Connect di
`/mentorship/daftar` merangkum jawaban jadi pesan WhatsApp ke admin; tidak ada yang disimpan di server. Nomor admin
diatur lewat `ADMIN_WA` di `app/lib/site.ts`.

## Deploy

Netlify membaca `netlify.toml`: `npm run build`, publish `build/client`, Node 22. URL lama (`/code-of-conduct.html`,
`/admin/login`) diarahkan lewat redirect 301.

## Kontribusi

Konten dikelola lewat file, jadi siapa pun di komunitas bisa bantu lewat pull request.
Semua kontribusi mengikuti [Code of Conduct](https://swegrowth.id/code-of-conduct) komunitas.
