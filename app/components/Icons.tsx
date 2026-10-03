/** Ikon kecil yang dipakai berulang. Semua stroke-based, ikut currentColor. */
const stroke = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
} as const;

export const ArrowRight = () => (
  <svg {...stroke} strokeWidth={2.2}><path d="M5 12h14M13 6l6 6-6 6" /></svg>
);

export const ArrowUpRight = () => (
  <svg {...stroke} strokeWidth={2.2}><path d="M7 17 17 7M9 7h8v8" /></svg>
);

export const Check = () => (
  <svg {...stroke} strokeWidth={2.6}><path d="m5 12.5 4.2 4.2L19 7" /></svg>
);

export const Lock = () => (
  <svg {...stroke} strokeWidth={2}><rect x="4.5" y="10.5" width="15" height="10" rx="2.5" /><path d="M8 10.5V7.8a4 4 0 0 1 8 0v2.7" /></svg>
);

export const Play = () => (
  <svg {...stroke} strokeWidth={2}><circle cx="12" cy="12" r="9" /><path d="m10 8.5 5.5 3.5-5.5 3.5z" /></svg>
);
