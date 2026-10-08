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

/**
 * Link gabung komunitas WhatsApp yang gratis. Kosongkan kalau belum ada link
 * publik — tombolnya otomatis diganti "Tanya admin".
 */
export const WA_COMMUNITY_URL = '';

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
