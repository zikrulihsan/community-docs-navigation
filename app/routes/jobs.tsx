import { Link } from 'react-router';
import type { Route } from './+types/jobs';
import { ArrowUpRight } from '~/components/Icons';
import { JoinCta } from '~/components/JoinCta';
import { PageHero } from '~/components/PageHero';
import { getJobs } from '~/lib/content.server';
import { formatDate } from '~/lib/format';
import { ADMIN_WA, pageMeta } from '~/lib/site';

export const meta: Route.MetaFunction = () =>
  pageMeta('Loker — SWE Growth', 'Info lowongan kerja software engineer yang dikurasi sesuai Code of Conduct komunitas SWE Growth.');

export async function loader() {
  return { jobs: await getJobs() };
}

export default function Jobs({ loaderData: { jobs } }: Route.ComponentProps) {
  return (
    <>
      <PageHero badge="Lowongan Kerja" title="Loker yang sudah dikurasi" lead="Semua lowongan di sini disaring biar jelas, jujur, relevan, dan selaras dengan prinsip komunitas." />
      <section className="block">
        <div className="wrap">
          {jobs.length === 0 ? (
            <div className="empty-note">Belum ada lowongan aktif. Cek lagi nanti, atau pantau grup WhatsApp.</div>
          ) : (
            <div className="job-list">
              {jobs.map((job) => (
                <article key={job.id} className="card hoverable">
                  <div className="job-head">
                    <div>
                      <h3>{job.role}</h3>
                      <p className="company">{job.company}</p>
                    </div>
                    <span className="chip gold">{job.type}</span>
                  </div>
                  <div className="prose job-body" dangerouslySetInnerHTML={{ __html: job.html }} />
                  <div className="meta">
                    <span>📍 {job.location}</span>
                    <time dateTime={job.postedDate}>{formatDate(job.postedDate)}</time>
                  </div>
                  <a className="btn btn-primary apply" href={job.applyUrl} target="_blank" rel="noopener">
                    Lamar
                    <ArrowUpRight />
                  </a>
                </article>
              ))}
            </div>
          )}

          <div className="note">
            <h3>Mau pasang loker?</h3>
            <p>
              Kirim detailnya ke admin lewat <a href={`https://wa.me/${ADMIN_WA}`} target="_blank" rel="noopener">WhatsApp</a>.
              Semua lowongan ditinjau dulu sesuai <Link to="/code-of-conduct">Code of Conduct</Link> komunitas.
            </p>
          </div>
        </div>
      </section>
      <JoinCta />
    </>
  );
}
