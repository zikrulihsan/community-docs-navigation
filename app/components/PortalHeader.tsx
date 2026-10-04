import { Link, NavLink } from 'react-router';
import { displayName, useAuth } from '~/lib/auth';
import { formatDate } from '~/lib/format';

export function PortalHeader() {
  const { user, profile, membership, isMember, isAdmin } = useAuth();
  const name = displayName(profile, user);

  return (
    <div className="wrap narrow-wrap">
      <div className="portal-head">
        <h1 className="page-title">
          Halo, {name.split(' ')[0]}
          {isMember && <span className="chip green verified-badge">Verified member</span>}
        </h1>
        <p className="muted">
          {isMember ? (
            membership ? `Aktif sampai ${formatDate(membership.active_until)}` : isAdmin ? 'Akses admin' : null
          ) : (
            <Link className="text-link" to="/portal/membership">
              {membership ? 'Membership berakhir — perpanjang' : 'Jadi verified member'}
            </Link>
          )}
        </p>
      </div>
      <nav className="member-tabs" aria-label="Menu portal">
        <NavLink to="/portal" end>Beranda</NavLink>
        <NavLink to="/portal/profil">Profil</NavLink>
        <NavLink to="/portal/membership">Membership</NavLink>
        {isAdmin && <NavLink to="/admin">Admin</NavLink>}
      </nav>
    </div>
  );
}
