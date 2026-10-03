import { data, Link } from 'react-router';
import type { Route } from './+types/blog-post';
import { getPost } from '~/lib/content.server';
import { formatDate } from '~/lib/format';
import { pageMeta } from '~/lib/site';

export const meta: Route.MetaFunction = ({ loaderData }) =>
  loaderData ? pageMeta(`${loaderData.post.title} — SWE Growth`, loaderData.post.description) : [];

export async function loader({ params }: Route.LoaderArgs) {
  const post = await getPost(params.slug);
  if (!post) throw data(null, { status: 404 });
  return { post };
}

export default function BlogPost({ loaderData: { post } }: Route.ComponentProps) {
  return (
    <>
      <header className="page-hero">
        <div className="wrap">
          <Link className="back" to="/blog">← Semua tulisan</Link>
          <h1>{post.title}</h1>
          <div className="post-meta">
            <time dateTime={post.pubDate}>{formatDate(post.pubDate)}</time>
            <span>·</span>
            <span>{post.author}</span>
          </div>
        </div>
      </header>
      <section className="block">
        <div className="wrap">
          <article className="prose" dangerouslySetInnerHTML={{ __html: post.html }} />
        </div>
      </section>
    </>
  );
}
