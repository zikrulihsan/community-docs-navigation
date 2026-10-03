import { Link } from 'react-router';
import type { Route } from './+types/mentorship';
import { ArrowRight } from '~/components/Icons';
import { JoinCta } from '~/components/JoinCta';
import { PageHero } from '~/components/PageHero';
import { getMentors } from '~/lib/content.server';
import { pageMeta } from '~/lib/site';

export const meta: Route.MetaFunction = () =>
  pageMeta('Mentorship — SWE Growth', 'Program mentorship SWE Growth. Lihat daftar mentor, lalu hubungi admin untuk dicocokkan — gratis untuk anggota komunitas.');

export async function loader() {
  return { mentors: await getMentors() };
}

/** Form Mentor Connect; nama mentor dikirim lewat query biar pilihannya terisi otomatis. */
const formLink = (mentor?: string) =>
  mentor ? `/mentorship/daftar?mentor=${encodeURIComponent(mentor)}` : '/mentorship/daftar';

const steps = [
  {
    n: '1',
    t: 'Lihat daftar mentor',
    d: 'Cek siapa yang topiknya paling nyambung sama masalahmu. Belum nemu yang cocok? Nggak apa-apa, lanjut ke langkah 2.',
  },
  {
    n: '2',
    t: 'Isi form Mentor Connect',
    d: 'Ceritakan kondisi dan problemmu di formulir. Sekali kirim, jawabannya langsung jadi pesan WhatsApp ke admin.',
  },
  {
    n: '3',
    t: 'Admin cocokkan',
    d: 'Admin menghubungkan kamu dengan mentor yang pas dan bantu atur jadwal sesinya.',
  },
];

export default function Mentorship({ loaderData: { mentors } }: Route.ComponentProps) {
  return (
    <>
      <PageHero
        badge="Mentorship"
        title="Nggak perlu jalan sendirian"
        lead="Belajar dari yang sudah lebih dulu lewat jalan yang sama. Isi form Mentor Connect, nanti kami cocokkan dengan mentor yang pas. Batch saat ini berjalan 2 bulan dengan sesi seminggu sekali."
      />

      <section className="block">
        <div className="wrap">
          <h2 className="section-title">Cara kerjanya</h2>
          <div className="card-grid">
            {steps.map((s) => (
              <div key={s.n} className="card">
                <span className="step-n">{s.n}</span>
                <h3>{s.t}</h3>
                <p>{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="block">
        <div className="wrap">
          <h2 className="section-title">Daftar mentor</h2>
          {mentors.length === 0 ? (
            <div className="empty-note">
              Daftar mentor lagi disusun. Sementara, isi <Link to="/mentorship/daftar">form Mentor Connect</Link> aja dulu ya — admin bantu carikan.
            </div>
          ) : (
            <div className="card-grid">
              {mentors.map((m) => (
                <div key={m.id} className="card">
                  <span className={m.available ? 'chip green' : 'chip'}>{m.available ? 'tersedia' : 'sedang penuh'}</span>
                  <h3>{m.name}</h3>
                  <p>{m.role}{m.company ? ` · ${m.company}` : ''}</p>
                  <div className="topics">
                    {m.topics.map((t) => <span key={t} className="chip">{t}</span>)}
                  </div>
                  <span className="spacer"></span>
                  <div className="card-actions">
                    {m.available ? (
                      <Link className="btn btn-primary sm" to={formLink(m.name)}>
                        Ajukan ke mentor ini
                        <ArrowRight />
                      </Link>
                    ) : (
                      <span className="unavailable">Lagi penuh — coba mentor lain dulu ya</span>
                    )}
                    {m.linkedin && (
                      <a className="mentor-link" href={m.linkedin} target="_blank" rel="noopener">LinkedIn →</a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="block">
        <div className="wrap">
          <div className="no-pref">
            <div>
              <h2>Belum ada preferensi mentor?</h2>
              <p>
                Santai, itu normal. Isi aja formulirnya dan ceritakan apa yang lagi ganjel —
                nanti kami carikan mentor yang paling nyambung sama kondisimu.
              </p>
            </div>
            <Link className="btn btn-primary" to={formLink()}>
              Isi form mentorship
              <ArrowRight />
            </Link>
          </div>
        </div>
      </section>

      <JoinCta />
    </>
  );
}
