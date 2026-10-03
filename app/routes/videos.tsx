import type { Route } from './+types/videos';
import { JoinCta } from '~/components/JoinCta';
import { PageHero } from '~/components/PageHero';
import { getVideos } from '~/lib/content.server';
import { formatDate } from '~/lib/format';
import { pageMeta } from '~/lib/site';

export const meta: Route.MetaFunction = () =>
  pageMeta('Video — SWE Growth', 'Rekaman sharing session, kelas online, dan podcast SWE Growth. Ketinggalan sesi live? Tonton ulang di sini.');

export async function loader() {
  return { videos: await getVideos() };
}

export default function Videos({ loaderData: { videos } }: Route.ComponentProps) {
  return (
    <>
      <PageHero badge="Video" title="Ketinggalan sesi live? Santai." lead="Sebagian besar kegiatan kami direkam. Tinggal pilih, tonton ulang kapan pun sempat." />
      <section className="block">
        <div className="wrap">
          {videos.length === 0 ? (
            <div className="empty-note">Belum ada rekaman yang diunggah.</div>
          ) : (
            <div className="card-grid">
              {videos.map((v) => (
                <a key={v.id} className="card vid-card" href={v.url} target="_blank" rel="noopener">
                  {v.youtubeId && (
                    <img className="thumb" src={`https://img.youtube.com/vi/${v.youtubeId}/hqdefault.jpg`} alt="" loading="lazy" width="480" height="360" />
                  )}
                  <span className="chip green">{v.category}</span>
                  <h3>{v.title}</h3>
                  <p>{v.description}</p>
                  <span className="spacer"></span>
                  <div className="meta">
                    <time dateTime={v.publishedDate}>{formatDate(v.publishedDate)}</time>
                    <span>Tonton di YouTube →</span>
                  </div>
                </a>
              ))}
            </div>
          )}
        </div>
      </section>
      <JoinCta />
    </>
  );
}
