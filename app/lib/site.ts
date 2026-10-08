/** Nomor WhatsApp admin (format internasional, tanpa "+"). Dipakai di link wa.me. */
export const ADMIN_WA = '6282338588078';

export const SITE_NAME = 'SWE Growth';

/** Domain produksi; dipakai untuk URL absolut (preview link butuh og:image absolut). */
export const SITE_URL = 'https://swegrowth.id';

/**
 * Membership berbayar & badge verified belum dibuka ("segera hadir"). Saat
 * dirilis: set true, lalu kembalikan alur bayar di routes/membership.tsx.
 */
export const MEMBERSHIP_LIVE = false;

export type CommunityChannel = {
  id: 'whatsapp' | 'telegram' | 'discord';
  name: string;
  /** null = link belum ada (tombol tampil "Menyusul"). */
  url: string | null;
  /** active = sudah jalan; soon = diaktifkan ke depannya. */
  status: 'active' | 'soon';
  note: string;
};

/**
 * Kanal komunitas yang ditawarkan setelah member selesai daftar (onboarding)
 * dan di portal. Saat Telegram/Discord sudah jalan: ubah status jadi 'active'
 * (Discord: isi url-nya juga).
 */
export const COMMUNITY_CHANNELS: CommunityChannel[] = [
  {
    id: 'whatsapp',
    name: 'WhatsApp',
    url: 'https://chat.whatsapp.com/KljBBOPkaGlHlBnrqY8tnz',
    status: 'active',
    note: 'Tempat ngobrol utama, sudah aktif dari awal. Mulai dari sini.',
  },
  {
    id: 'telegram',
    name: 'Telegram',
    url: 'https://t.me/+-qwYuyEIHgswN2Fl',
    status: 'soon',
    note: 'Segera diaktifkan. Boleh gabung duluan.',
  },
  {
    id: 'discord',
    name: 'Discord',
    url: null,
    status: 'soon',
    note: 'Segera diaktifkan. Link-nya menyusul.',
  },
];

/** Yang disiapkan untuk verified member (tampil di halaman membership "segera hadir"). */
export const MEMBER_BENEFITS = [
  'Badge verified member di profil',
  'Rekaman kegiatan yang sudah lewat',
];

export const adminWaLink = (text?: string) =>
  `https://wa.me/${ADMIN_WA}${text ? `?text=${encodeURIComponent(text)}` : ''}`;

export const DEFAULT_DESCRIPTION =
  'SWE Growth — komunitas software engineer Indonesia. Portal berisi agenda kegiatan, pendaftaran, dan grup WhatsApp komunitas.';

/** Meta standar untuk export `meta` tiap route. */
export const pageMeta = (title: string, description = DEFAULT_DESCRIPTION) => [
  { title },
  { name: 'description', content: description },
  { property: 'og:title', content: title },
  { property: 'og:description', content: description },
  { property: 'og:image', content: `${SITE_URL}/assets/swe-growth-logo.png` },
];
