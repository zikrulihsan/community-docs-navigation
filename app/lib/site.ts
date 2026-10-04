/** Nomor WhatsApp admin (format internasional, tanpa "+"). Dipakai di link wa.me. */
export const ADMIN_WA = '6282338588078';

export const SITE_NAME = 'SWE Growth';

/** Form membership berbayar di goakal. */
export const MEMBERSHIP_URL = 'https://goakal.com/ahsanprojectsbw/swegrowthmember/c79qf/apply';

/**
 * Link gabung komunitas WhatsApp yang gratis. Kosongkan kalau belum ada link
 * publik — tombolnya otomatis diganti "Tanya admin".
 */
export const WA_COMMUNITY_URL = '';

/** Isi portal untuk semua akun yang login. */
export const PORTAL_FEATURES = [
  'Detail agenda kegiatan dan pendaftaran langsung dari portal',
  'Link meeting muncul di portal setelah kamu terdaftar',
  'Link grup WhatsApp komunitas',
];

/** Yang benar-benar didapat verified member saat ini. Tambah baris saat fitur baru dirilis. */
export const MEMBER_BENEFITS = [
  'Badge verified member di portal',
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
  { property: 'og:image', content: '/assets/swe-growth-logo.png' },
];
