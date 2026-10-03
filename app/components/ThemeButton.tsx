import { useEffect, useLayoutEffect, useState } from 'react';

type Theme = 'system' | 'light' | 'dark';
const order: Theme[] = ['system', 'light', 'dark'];

/** Script ini di-inline di <head> supaya tema terpasang sebelum paint (tanpa flash). */
export const themeInitScript = `(function(){try{var p=localStorage.getItem('swe-theme')||'system';var d=p==='system'?(matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'):p;document.documentElement.dataset.theme=p;document.documentElement.dataset.resolved=d;}catch(e){document.documentElement.dataset.theme='system';document.documentElement.dataset.resolved='light';}})();`;

const mq = () => matchMedia('(prefers-color-scheme: dark)');
const resolve = (t: Theme) => (t === 'system' ? (mq().matches ? 'dark' : 'light') : t);

function storedTheme(): Theme {
  try {
    const t = localStorage.getItem('swe-theme');
    return t === 'light' || t === 'dark' ? t : 'system';
  } catch {
    return 'system';
  }
}

export function ThemeButton() {
  // Ikon dipilih lewat CSS dari data-theme di <html>, jadi markup prerender tetap benar.
  const [theme, setTheme] = useState<Theme>('system');

  // Kalau React sampai me-render ulang <html> (mis. hydrate gagal di halaman error),
  // atribut dari script inline hilang — pasang lagi sebelum paint.
  useLayoutEffect(() => {
    const root = document.documentElement;
    if (!root.dataset.theme) {
      const t = storedTheme();
      root.dataset.theme = t;
      root.dataset.resolved = resolve(t);
    }
  });

  useEffect(() => {
    setTheme((document.documentElement.dataset.theme as Theme) || 'system');
    const media = mq();
    const onChange = () => {
      if (document.documentElement.dataset.theme === 'system') {
        document.documentElement.dataset.resolved = resolve('system');
      }
    };
    media.addEventListener('change', onChange);
    return () => media.removeEventListener('change', onChange);
  }, []);

  const cycle = () => {
    const next = order[(order.indexOf(theme) + 1) % order.length]!;
    const root = document.documentElement;
    root.dataset.theme = next;
    root.dataset.resolved = resolve(next);
    try {
      localStorage.setItem('swe-theme', next);
    } catch {}
    setTheme(next);
  };

  return (
    <button type="button" className="theme-btn" onClick={cycle} aria-label={`Tema ${theme}. Klik untuk ganti tema.`}>
      <svg className="ic ic-light" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4.2" /><path d="M12 2.5v2.4M12 19.1v2.4M4.6 4.6l1.7 1.7M17.7 17.7l1.7 1.7M2.5 12h2.4M19.1 12h2.4M4.6 19.4l1.7-1.7M17.7 6.3l1.7-1.7" /></svg>
      <svg className="ic ic-dark" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 13.5A8 8 0 1 1 10.5 4a6.3 6.3 0 0 0 9.5 9.5z" /></svg>
      <svg className="ic ic-system" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="12.5" rx="2" /><path d="M9 20.5h6M12 16.5v4" /></svg>
    </button>
  );
}
