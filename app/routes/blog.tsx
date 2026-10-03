import { Link } from 'react-router';
import type { Route } from './+types/blog';
import { JoinCta } from '~/components/JoinCta';
import { PageHero } from '~/components/PageHero';
import { getPosts } from '~/lib/content.server';
import { formatDate } from '~/lib/format';
import { pageMeta } from '~/lib/site';

export const meta: Route.MetaFunction = () =>
  pageMeta('Blog — SWE Growth', 'Tulisan dari member untuk member — pengalaman nyata soal engineering, karier, dan tumbuh bareng di komunitas.');

export async function loader() {
  return { posts: (await getPosts()).map(({ html: _html, ...p }) => p) };
}

export default function Blog({ loaderData: { posts } }: Route.ComponentProps) {
  return (
    <>
      <PageHero badge="Blog" title="Tulisan dari member, untuk member" lead="Pengalaman nyata dari lapangan — bukan teori yang jauh dari kerjaan sehari-hari." />
      <section className="block">
        <div className="wrap">
          {posts.length === 0 ? (
            <div className="empty-note">Belum ada tulisan. Mau jadi yang pertama? Kabarin admin di grup.</div>
          ) : (
            <div className="card-grid">
              {posts.map((p) => (
                <Link key={p.id} className="card" to={`/blog/${p.id}`}>
                  <h3>{p.title}</h3>
                  <p>{p.description}</p>
                  <span className="spacer"></span>
                  <div className="meta">
                    <time dateTime={p.pubDate}>{formatDate(p.pubDate)}</time>
                    <span>{p.author}</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
      <JoinCta />
    </>
  );
}
