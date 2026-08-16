# SWE Growth — Platform Komunitas

Website komunitas [SWE Growth](https://swegrowth.netlify.app) — dari landing page jadi platform lengkap:
mentorship, event + pendaftaran, video, blog, dan info lowongan kerja.

Dibangun dengan [Astro](https://astro.build) dan di-deploy ke Netlify sebagai situs statis.

## Kenapa Astro

Semua halaman di-render jadi HTML statis saat build — **nol JavaScript framework** yang dikirim ke browser.
Yang tersisa cuma ~1KB script inline buat theme switcher dan menu mobile. Font di-host sendiri, CSS satu file
ter-cache lintas halaman. Hasilnya halaman 8–19KB yang langsung tampil.

## Menjalankan lokal

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # output ke dist/
npm run preview  # cek hasil build
```

## Struktur

```
src/
├── content/          # semua konten (markdown & yaml) — ini yang biasanya kamu edit
│   ├── events/       # event & kelas          (.md)
│   ├── blog/         # tulisan komunitas      (.md)
│   ├── jobs/         # lowongan kerja         (.md)
│   ├── videos/       # rekaman & playlist     (.yaml)
│   └── mentors/      # daftar mentor          (.yaml)
├── content.config.ts # skema tiap koleksi konten
├── pages/            # rute halaman
├── layouts/          # kerangka HTML + theme script
├── components/       # Nav, Footer, JoinCta, PageHero
└── styles/global.css # design token & komponen bersama
```

## Menambah konten

Nama file jadi URL-nya. Contoh `src/content/events/kelas-git.md` → `/events/kelas-git`.

### Event baru

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

Pendaftaran event dan pengajuan mentorship pakai **Netlify Forms** — nggak perlu backend.
Netlify mendeteksi form saat deploy, dan hasilnya masuk ke dashboard Netlify (Forms).

Ada dua form:

| Nama form            | Dipakai di            |
| -------------------- | --------------------- |
| `event-registration` | halaman detail event  |
| `mentorship-request` | halaman mentorship    |

Keduanya diarahkan ke `/terima-kasih` setelah submit, dan pakai honeypot `bot-field` buat menyaring spam.

## Deploy

Netlify membaca `netlify.toml`: build dengan `npm run build`, publish folder `dist`.
Cukup connect repo ini ke Netlify — nggak ada konfigurasi manual yang perlu diisi.

URL lama dari situs sebelumnya (`/code-of-conduct.html`) sudah diarahkan lewat redirect 301.

## Kontribusi

Konten dikelola lewat file — siapa pun di komunitas bisa bantu lewat pull request.
Semua kontribusi mengikuti [Code of Conduct](https://swegrowth.netlify.app/code-of-conduct) komunitas.
