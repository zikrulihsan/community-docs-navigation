import { Link, NavLink, useNavigate } from 'react-router';
import { seniorityLabel } from './ProfileForm';
import { Avatar } from './Avatar';
import { displayName, useAuth } from '~/lib/auth';

export function MemberHeader() {
  const { user, profile, isAdmin, signOut } = useAuth();
  const navigate = useNavigate();
  const name = displayName(profile, user);

  return (
    <div className="wrap">
      <div className="member-head">
        <Avatar name={name} src={profile?.avatar_url} size={64} />
        <div className="grow">
          <h1>Halo, {name.split(' ')[0]} 👋</h1>
          <p className="sub">
            {[profile?.headline, profile?.seniority && seniorityLabel[profile.seniority]].filter(Boolean).join(' · ') || user?.email}
          </p>
        </div>
        <div className="inline-actions">
          {isAdmin && <Link className="btn btn-ghost sm" to="/admin">Admin</Link>}
          <button
            className="btn btn-ghost sm"
            type="button"
            onClick={async () => {
              await signOut();
              navigate('/', { replace: true });
            }}
          >
            Keluar
          </button>
        </div>
      </div>
      <nav className="member-tabs" aria-label="Menu member">
        <NavLink to="/dashboard" end>Ringkasan</NavLink>
        <NavLink to="/dashboard/profil">Edit profil</NavLink>
        {profile?.username && <NavLink to={`/u/${profile.username}`}>Profil publik</NavLink>}
      </nav>
    </div>
  );
}
