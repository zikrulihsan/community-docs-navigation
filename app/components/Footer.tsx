import { Link } from 'react-router';

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="wrap foot-in">
        <div className="foot-brand">
          <Link className="brand" to="/">
            <img className="brand-logo" src="/assets/swe-growth-logo.png" alt="SWE Growth Community" width="32" height="32" loading="lazy" />
            <span className="b-name"><b>SWE Growth</b></span>
          </Link>
          <div className="foot-note">Komunitas software engineer Indonesia. Bagian dari Ahsan Project.</div>
          <div className="foot-social">
            <a href="https://www.linkedin.com/company/swegrowthid/" target="_blank" rel="noopener" aria-label="LinkedIn">
              <svg viewBox="0 0 24 24" fill="currentColor"><path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9h4v12H3zM10 9h3.8v1.7h.05c.53-1 1.83-2.05 3.77-2.05 4.03 0 4.78 2.65 4.78 6.1V21h-4v-5.4c0-1.29-.02-2.95-1.8-2.95-1.8 0-2.08 1.4-2.08 2.85V21h-4z" /></svg>
            </a>
            <a href="https://x.com/swegrowthid" target="_blank" rel="noopener" aria-label="X">
              <svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.5 3h3l-7.1 8.1L22 21h-6.4l-5-6.5L4.8 21H1.8l7.6-8.7L2 3h6.6l4.5 6.1L17.5 3zm-1.05 16h1.7L7.65 4.8H5.85z" /></svg>
            </a>
            <a href="https://www.instagram.com/swegrowthid" target="_blank" rel="noopener" aria-label="Instagram">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="5.2" /><circle cx="12" cy="12" r="4" /><circle cx="17.3" cy="6.7" r="1.25" fill="currentColor" stroke="none" /></svg>
            </a>
            <a href="https://www.youtube.com/playlist?list=PLgWXFC8NK7WCUpvVLrYL2GsJHhOdHDv7R" target="_blank" rel="noopener" aria-label="YouTube">
              <svg viewBox="0 0 24 24" fill="currentColor"><path d="M23 7.2s-.2-1.6-.9-2.3c-.9-.9-1.8-.9-2.3-1C16.6 3.6 12 3.6 12 3.6h-.01s-4.6 0-7.8.3c-.4.1-1.4.1-2.3 1-.7.7-.9 2.3-.9 2.3S.8 9.1.8 11v1.8c0 1.9.2 3.8.2 3.8s.2 1.6.9 2.3c.9.9 2 .9 2.5 1 1.8.2 7.6.3 7.6.3s4.6 0 7.8-.3c.4-.1 1.4-.1 2.3-1 .7-.7.9-2.3.9-2.3s.2-1.9.2-3.8V11c0-1.9-.2-3.8-.2-3.8zM9.7 15.1V8.4l6.1 3.4-6.1 3.3z" /></svg>
            </a>
          </div>
        </div>
        <div className="foot-links">
          <Link to="/agenda">Agenda</Link>
          <Link to="/code-of-conduct">Code of Conduct</Link>
          <Link to="/masuk?next=/portal">Masuk</Link>
        </div>
      </div>
    </footer>
  );
}
