/** Nomor WhatsApp admin (format internasional, tanpa "+"). Dipakai di link wa.me. */
export const ADMIN_WA = '6282338588078';

export const SITE_NAME = 'SWE Growth';
export const JOIN_URL = 'https://goakal.com/ahsanprojectsbw/swegrowthmember/c79qf/apply';
export const DEFAULT_DESCRIPTION =
  'SWE Growth — komunitas software engineer Indonesia. Tumbuh bareng lewat mentorship, event, kelas, dan diskusi komunitas.';

/** Meta standar untuk export `meta` tiap route. */
export const pageMeta = (title: string, description = DEFAULT_DESCRIPTION) => [
  { title },
  { name: 'description', content: description },
  { property: 'og:title', content: title },
  { property: 'og:description', content: description },
  { property: 'og:image', content: '/assets/swe-growth-logo.png' },
];
