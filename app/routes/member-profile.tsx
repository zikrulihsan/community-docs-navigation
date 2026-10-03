import { data, Link } from 'react-router';
import type { Route } from './+types/member-profile';
import { Avatar } from '~/components/Avatar';
import { seniorityLabel } from '~/components/ProfileForm';
import { useAuth } from '~/lib/auth';
import { hasSupabase, supabase } from '~/lib/supabase';

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
  if (!hasSupabase) throw data(null, { status: 404 });
  const { data: profile } = await supabase()
    .from('profiles')
    .select('id, username, full_name, headline, seniority, company, bio, avatar_url, linkedin_url, github_url, skills, created_at')
    .eq('username', params.username.toLowerCase())
    .not('onboarded_at', 'is', null)
    .maybeSingle();
  if (!profile) throw data(null, { status: 404 });
  return { profile };
}

export const meta: Route.MetaFunction = ({ loaderData }) =>
  loaderData
    ? [
        { title: `${loaderData.profile.full_name} (@${loaderData.profile.username}) — SWE Growth` },
        { name: 'description', content: loaderData.profile.headline },
      ]
    : [];

export function HydrateFallback() {
  return <div className="loading-block">Memuat profil…</div>;
}

const memberSince = new Intl.DateTimeFormat('id-ID', { month: 'long', year: 'numeric', timeZone: 'Asia/Jakarta' });

export default function MemberProfile({ loaderData: { profile } }: Route.ComponentProps) {
  const { user } = useAuth();
  const isMe = user?.id === profile.id;

  return (
    <>
      <header className="page-hero">
        <div className="wrap">
          <div className="profile-hero">
            <Avatar name={profile.full_name} src={profile.avatar_url} size={92} />
            <div style={{ flex: 1, minWidth: 220 }}>
              <h1>{profile.full_name}</h1>
              {profile.headline && <p className="headline">{profile.headline}</p>}
              <div className="meta-line">
                <span className="chip">@{profile.username}</span>
                {profile.seniority && <span className="chip green">{seniorityLabel[profile.seniority]}</span>}
                {profile.company && <span className="chip">{profile.company}</span>}
                <span className="chip">member sejak {memberSince.format(new Date(profile.created_at))}</span>
              </div>
            </div>
            {isMe && <Link className="btn btn-ghost" to="/dashboard/profil">Edit profil</Link>}
          </div>
        </div>
      </header>

      <section className="block">
        <div className="wrap" style={{ maxWidth: 820 }}>
          {profile.bio && (
            <div className="prose" style={{ marginBottom: 28 }}>
              {profile.bio.split(/\n{2,}/).map((para, i) => <p key={i}>{para}</p>)}
            </div>
          )}
          {profile.skills.length > 0 && (
            <>
              <h2 className="section-title" style={{ fontSize: '1.2rem', marginBottom: 12 }}>Skill & minat</h2>
              <div className="chips">{profile.skills.map((s) => <span key={s} className="chip">{s}</span>)}</div>
            </>
          )}
          {(profile.linkedin_url || profile.github_url) && (
            <div className="profile-links">
              {profile.linkedin_url && <a className="btn btn-ghost sm" href={profile.linkedin_url} target="_blank" rel="noopener nofollow">LinkedIn ↗</a>}
              {profile.github_url && <a className="btn btn-ghost sm" href={profile.github_url} target="_blank" rel="noopener nofollow">GitHub ↗</a>}
            </div>
          )}
          {!profile.bio && profile.skills.length === 0 && (
            <div className="empty-note">{isMe ? 'Profilmu masih kosong — tambahkan bio dan skill dari dashboard.' : 'Member ini belum menulis apa-apa di profilnya.'}</div>
          )}
        </div>
      </section>
    </>
  );
}
