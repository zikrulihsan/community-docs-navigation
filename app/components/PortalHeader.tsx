import { NavLink } from 'react-router';
import { displayName, useAuth } from '~/lib/auth';
import { formatDate } from '~/lib/format';

export function PortalHeader() {
  const { user, profile, membership, isAdmin } = useAuth();
  const name = displayName(profile, user);

  return (
    <div className="wrap narrow-wrap">
      <div className="portal-head">
        <h1 className="page-title">Halo, {name.split(' ')[0]}</h1>
        <p className="muted">
          {membership
            ? `Member aktif sampai ${formatDate(membership.active_until)}`
            : isAdmin
              ? 'Akses admin'
              : null}
        </p>
      </div>
      <nav className="member-tabs" aria-label="Menu portal">
        <NavLink to="/portal" end>Beranda</NavLink>
        <NavLink to="/portal/profil">Profil</NavLink>
        {isAdmin && <NavLink to="/admin">Admin</NavLink>}
      </nav>
    </div>
  );
}
