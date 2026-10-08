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

export const CalendarIcon = () => (
  <svg {...stroke} strokeWidth={2}><rect x="3.5" y="5" width="17" height="15.5" rx="2.5" /><path d="M3.5 10h17M8 3v4M16 3v4" /></svg>
);

export const ClockIcon = () => (
  <svg {...stroke} strokeWidth={2}><circle cx="12" cy="12" r="8.5" /><path d="M12 7.5V12l3 2" /></svg>
);

export const PinIcon = () => (
  <svg {...stroke} strokeWidth={2}><path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11z" /><circle cx="12" cy="10" r="2.4" /></svg>
);

export const UsersIcon = () => (
  <svg {...stroke} strokeWidth={2}><circle cx="9" cy="8.5" r="3.5" /><path d="M2.5 20c.6-3.4 3.2-5.5 6.5-5.5s5.9 2.1 6.5 5.5M16 5.2a3.5 3.5 0 0 1 0 6.6M18.5 14.8c1.6.8 2.7 2.6 3 5.2" /></svg>
);
