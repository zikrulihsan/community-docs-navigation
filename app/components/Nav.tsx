import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router';
import { displayName, useAuth } from '~/lib/auth';
import { MEMBERSHIP_URL } from '~/lib/site';
import { Avatar } from './Avatar';
import { ThemeButton } from './ThemeButton';


export function Nav() {
  const [open, setOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const { pathname } = useLocation();
  const { loading, user, profile, isMember, isAdmin } = useAuth();
  const links = [
    ...(isMember ? [{ to: '/portal', label: 'Portal' }] : []),
    { to: '/agenda', label: 'Agenda' },
    { to: '/code-of-conduct', label: 'Code of Conduct' },
    ...(isAdmin ? [{ to: '/admin', label: 'Admin' }] : []),
  ];

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (!navRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('click', onClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('click', onClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const name = displayName(profile, user);

  return (
    <nav className={`site-nav${open ? ' menu-open' : ''}`} ref={navRef}>
      <div className="wrap nav-in">
        <Link className="brand" to="/" aria-label="SWE Growth Community">
          <img className="brand-logo" src="/assets/swe-growth-logo.png" alt="SWE Growth Community" width="38" height="38" />
          <span className="b-name"><b>swe growth</b></span>
        </Link>
        <div className="nav-links" id="navLinks">
          {links.map((l) => (
            <NavLink key={l.to} className="lk" to={l.to}>{l.label}</NavLink>
          ))}
        </div>
        <div className="nav-cta">
          <ThemeButton />
          {/* Saat prerender sesi belum diketahui: sisakan tempat supaya layout tidak lompat. */}
          {loading ? (
            <span className="nav-account-slot" aria-hidden="true" />
          ) : user ? (
            <Link className="nav-account" to={isMember ? '/portal/profil' : '/menunggu'} aria-label={`Akun ${name}`}>
              <Avatar name={name} src={profile?.avatar_url} size={34} />
              <span>{isMember ? name.split(' ')[0] : 'Status member'}</span>
            </Link>
          ) : (
            <>
              <Link className="btn btn-ghost nav-login" to="/masuk?next=/portal">Masuk</Link>
              <a className="btn btn-primary" href={MEMBERSHIP_URL} target="_blank" rel="noopener">Jadi member</a>
            </>
          )}
          <button
            type="button"
            className="nav-burger"
            aria-label={open ? 'Tutup menu' : 'Buka menu'}
            aria-expanded={open}
            aria-controls="navLinks"
            onClick={(e) => {
              e.stopPropagation();
              setOpen((v) => !v);
            }}
          >
            <svg className="ic-open" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 7h16M4 12h16M4 17h16" /></svg>
            <svg className="ic-close" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 6l12 12M18 6L6 18" /></svg>
          </button>
        </div>
      </div>
    </nav>
  );
}
