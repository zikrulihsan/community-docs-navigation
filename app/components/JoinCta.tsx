import { ADMIN_WA, JOIN_URL } from '~/lib/site';
import { ArrowRight } from './Icons';

export function JoinCta({
  title = 'Pintunya sudah di hadapanmu 🚪',
  body = 'Buka pintu untuk ruang tumbuh bersama.\n\nMasuk ke grup, sapa teman-teman di grup, perkenalan, terus ikut kegiatan apa pun yang lagi jalan. Segampang itu.',
}: { title?: string; body?: string }) {
  return (
    <section className="block">
      <div className="wrap">
        <div className="join-card">
          <span className="mono" style={{ opacity: 0.85 }}>Cara gabung</span>
          <h2>{title}</h2>
          <p>{body}</p>
          <div className="join-proof" aria-label="Informasi komunitas">
            <span><b>1024+</b> engineer</span>
            <span aria-hidden="true">•</span>
            <span><b>Gratis</b> selamanya</span>
          </div>
          <div className="join-actions">
            <a className="btn btn-white" href={JOIN_URL} target="_blank" rel="noopener">
              Gabung ke WA Community
              <ArrowRight />
            </a>
            <a className="btn btn-outline-w" href={`https://wa.me/${ADMIN_WA}`} target="_blank" rel="noopener">Tanya - tanya di WA</a>
          </div>
        </div>
      </div>
    </section>
  );
}
