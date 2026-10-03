# SWE Growth — Portal Member

Situs [swegrowth.id](https://swegrowth.id). Komunitas WhatsApp SWE Growth gratis; situs ini adalah **portal untuk member
berbayar**. Pembayaran membership lewat goakal, lalu admin mengaktifkan member di `/admin`.

Stack: **React 19 + React Router (framework mode di atas Vite)**, Supabase (Postgres + Auth + RLS), deploy di Netlify.

Prinsip isi: tidak ada data contoh atau angka karangan. Bagian yang datanya kosong tidak ditampilkan.

## Halaman

| URL | Akses | Isi |
| --- | --- | --- |
| `/` | publik | Penjelasan singkat, komunitas WA (gratis) vs portal member, agenda terdekat |
| `/agenda` | publik | Judul & tanggal kegiatan mendatang |
| `/code-of-conduct` | publik | Aturan komunitas |
| `/masuk` | publik | Login Google / magic link |
| `/menunggu` | login | Status membership: cara bayar & kabari admin |
| `/portal` | member aktif | Kegiatan yang diikuti, agenda, grup WhatsApp member |
| `/portal/agenda/:slug` | member aktif | Detail kegiatan, daftar/batal, link meeting & rekaman |
| `/portal/profil` | member aktif | Data akun & masa aktif |
| `/admin` | admin | Aktivasi member, event, grup WhatsApp |

Halaman publik di-prerender saat build; sisanya SPA lewat `__spa-fallback.html` (lihat `netlify.toml`). URL lama
(`/events`, `/blog`, `/jobs`, `/videos`, `/mentorship`, `/courses`, `/dashboard`, `/u/*`) diarahkan 301.

Tidak ada server dan tidak ada secret key di aplikasi. Hak akses dijaga di database: RLS + fungsi `is_admin()`,
`is_member()`, `is_curator()` di `supabase/migrations/`. Link meeting, rekaman, dan grup WhatsApp hanya terbaca oleh
member aktif.

## Menjalankan lokal

Butuh Node ≥ 22.22 (lihat `.nvmrc`).

```bash
cp .env.example .env   # isi VITE_SUPABASE_URL & VITE_SUPABASE_PUBLISHABLE_KEY
npm install
npm run dev        # http://localhost:4321
npm run typecheck
npm run build      # output ke build/client
```

## Setup Supabase

1. Jalankan migration di `supabase/migrations/` **berurutan sesuai nama file** (SQL editor atau `supabase db push`).
   Semuanya aman dijalankan ulang.
2. **Auth → Providers**: Email (magic link) dan Google aktif, sign-up diizinkan.
3. **Auth → URL Configuration**: Site URL `https://swegrowth.id`; Redirect URLs `https://swegrowth.id/auth/callback`
   dan `http://localhost:4321/auth/callback`.
4. **Admin**: tambahkan email ke tabel `activity_admin_emails`.

`app/lib/database.types.ts` ditulis tangan mengikuti migration; perbarui saat skema berubah.

## Alur membership

1. Calon member bayar di goakal (`MEMBERSHIP_URL` di `app/lib/site.ts`).
2. Dia masuk ke swegrowth.id, mengisi nama + WhatsApp, lalu melihat halaman `/menunggu`.
3. Admin membuka `/admin` → tab **Member**, mencocokkan nama/email/WhatsApp dengan pembayaran, lalu mengisi
   **Aktif sampai** (+ nomor order goakal opsional).
4. Saat tanggalnya lewat, akses portal otomatis tertutup dan member diarahkan ke `/menunggu` untuk perpanjang.

## Konfigurasi di `app/lib/site.ts`

- `MEMBERSHIP_URL` — halaman membership di goakal.
- `WA_COMMUNITY_URL` — link gabung grup WhatsApp gratis. Kosong = tombol diganti "Minta link ke admin".
- `MEMBER_BENEFITS` — daftar yang didapat member di landing page. Hanya tulis yang sudah benar-benar tersedia.
- `ADMIN_WA` — nomor WhatsApp admin.

## Deploy

Netlify membaca `netlify.toml`: `npm run build`, publish `build/client`, Node 22. Set `VITE_SUPABASE_URL` dan
`VITE_SUPABASE_PUBLISHABLE_KEY` di environment Netlify. Agenda di halaman publik ikut diperbarui di browser, jadi
event baru tampil tanpa deploy ulang.
