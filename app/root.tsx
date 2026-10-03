import type { ReactNode } from 'react';
import { isRouteErrorResponse, Link, Links, Meta, Outlet, Scripts, ScrollRestoration } from 'react-router';
import type { Route } from './+types/root';
import { Footer } from './components/Footer';
import { Nav } from './components/Nav';
import { themeInitScript } from './components/ThemeButton';
import { AuthProvider } from './lib/auth';
import { DEFAULT_DESCRIPTION } from './lib/site';
import './styles/global.css';
import './styles/pages.css';
import './styles/wa-chat.css';
import './styles/app.css';

export const links: Route.LinksFunction = () => [
  { rel: 'icon', type: 'image/png', href: '/assets/swe-growth-logo.png' },
  { rel: 'preload', href: '/assets/fonts/hanken-grotesk-400-latin.woff2', as: 'font', type: 'font/woff2', crossOrigin: 'anonymous' },
  { rel: 'preload', href: '/assets/fonts/ubuntu-700-latin.woff2', as: 'font', type: 'font/woff2', crossOrigin: 'anonymous' },
];

export function Layout({ children }: { children: ReactNode }) {
  return (
    <html lang="id" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content={DEFAULT_DESCRIPTION} />
        <Meta />
        <Links />
        {/* Pasang tema sebelum paint supaya tidak ada flash terang/gelap. */}
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

function Shell({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <Nav />
      <main>{children}</main>
      <Footer />
    </AuthProvider>
  );
}

export default function App() {
  return (
    <Shell>
      <Outlet />
    </Shell>
  );
}

/** Ditampilkan di __spa-fallback.html sampai route SPA selesai dimuat. */
export function HydrateFallback() {
  return (
    <Shell>
      <div className="loading-block">Memuat…</div>
    </Shell>
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  const notFound = isRouteErrorResponse(error) && error.status === 404;
  const details = import.meta.env.DEV && error instanceof Error ? error.stack : null;

  return (
    <Shell>
      <title>{notFound ? 'Halaman tidak ditemukan — SWE Growth' : 'Terjadi kesalahan — SWE Growth'}</title>
      <section className="block nf">
        <div className="wrap">
          <p className="mono">{notFound ? 'Error 404' : 'Error'}</p>
          <h1>{notFound ? 'Halamannya nggak ketemu 🧭' : 'Ada yang nggak beres 🛠️'}</h1>
          <p className="sub">
            {notFound
              ? 'Mungkin link-nya sudah berubah, atau halamannya sudah dipindah.'
              : 'Coba muat ulang halaman. Kalau masih error, kabari admin di grup ya.'}
          </p>
          <div className="center-actions">
            <Link className="btn btn-primary" to="/">Kembali ke beranda</Link>
            <Link className="btn btn-ghost" to="/events">Lihat event</Link>
          </div>
          {details && <pre style={{ textAlign: 'left', marginTop: 32, overflowX: 'auto' }}><code>{details}</code></pre>}
        </div>
      </section>
    </Shell>
  );
}
