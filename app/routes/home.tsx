import { Link } from 'react-router';
import type { Route } from './+types/home';
import { AgendaList } from '~/components/AgendaList';
import { getPublishedActivities, isActivityUpcoming } from '~/lib/activities';
import { useAuth } from '~/lib/auth';
import { adminWaLink, MEMBER_BENEFITS, MEMBERSHIP_URL, pageMeta, WA_COMMUNITY_URL } from '~/lib/site';

export const meta: Route.MetaFunction = () => pageMeta('SWE Growth — komunitas software engineer Indonesia');

const upcoming = async () => (await getPublishedActivities()).filter(isActivityUpcoming).slice(0, 3);

export async function loader() {
  return { activities: await upcoming() };
}

export async function clientLoader() {
  return { activities: await upcoming() };
}
clientLoader.hydrate = true as const;

export default function Home({ loaderData: { activities } }: Route.ComponentProps) {
  const { user, isMember } = useAuth();

  return (
    <>
      <section className="block intro">
        <div className="wrap narrow-wrap">
          <h1>Komunitas software engineer Indonesia.</h1>
          <p className="lead">
            SWE Growth adalah tempat software engineer belajar dan saling bantu. Grup WhatsApp-nya terbuka gratis.
            Portal member di situs ini untuk yang ingin akses agenda dan grup khusus member.
          </p>
          <div className="inline-actions">
            {isMember ? (
              <Link className="btn btn-primary" to="/portal">Buka portal</Link>
            ) : (
              <>
                <a className="btn btn-primary" href={MEMBERSHIP_URL} target="_blank" rel="noopener">Jadi member</a>
                <Link className="btn btn-ghost" to={user ? '/menunggu' : '/masuk?next=/portal'}>
                  {user ? 'Status membership' : 'Masuk'}
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      <section className="block">
        <div className="wrap narrow-wrap">
          <div className="offer-grid">
            <div className="panel">
              <p className="offer-price">Gratis</p>
              <h2>Komunitas WhatsApp</h2>
              <p className="muted">Diskusi sehari-hari dengan sesama engineer: tanya jawab, berbagi pengalaman, info kegiatan.</p>
              {WA_COMMUNITY_URL ? (
                <a className="btn btn-ghost sm" href={WA_COMMUNITY_URL} target="_blank" rel="noopener">Gabung grup</a>
              ) : (
                <a className="btn btn-ghost sm" href={adminWaLink('Halo admin, saya mau gabung komunitas WhatsApp SWE Growth.')} target="_blank" rel="noopener">
                  Minta link ke admin
                </a>
              )}
            </div>
            <div className="panel">
              <p className="offer-price">Member</p>
              <h2>Portal member</h2>
              <ul className="plain-list">
                {MEMBER_BENEFITS.map((b) => <li key={b}>{b}</li>)}
              </ul>
              <a className="btn btn-primary sm" href={MEMBERSHIP_URL} target="_blank" rel="noopener">Daftar membership</a>
            </div>
          </div>
        </div>
      </section>

      {activities.length > 0 && (
        <section className="block">
          <div className="wrap narrow-wrap">
            <div className="panel-head">
              <h2 className="section-title">Agenda terdekat</h2>
              <Link className="text-link" to="/agenda">Semua agenda</Link>
            </div>
            <div className="panel"><AgendaList activities={activities} /></div>
          </div>
        </section>
      )}
    </>
  );
}
