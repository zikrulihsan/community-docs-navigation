import { Link } from 'react-router';
import type { Route } from './+types/thanks';
import { pageMeta } from '~/lib/site';

export const meta: Route.MetaFunction = () => pageMeta('Terima kasih — SWE Growth', 'Formulir kamu sudah kami terima.');

export default function Thanks() {
  return (
    <section className="block thanks">
      <div className="wrap">
        <span className="tick">✓</span>
        <h1>Terima kasih! 🎉</h1>
        <p>Data kamu sudah masuk. Admin bakal menghubungi lewat email atau WhatsApp — biasanya dalam 1–2 hari kerja.</p>
        <p className="sub">Sambil nunggu, kamu bisa lihat kegiatan lain yang lagi jalan.</p>
        <div className="center-actions">
          <Link className="btn btn-primary" to="/events">Lihat event lain</Link>
          <Link className="btn btn-ghost" to="/">Kembali ke beranda</Link>
        </div>
      </div>
    </section>
  );
}
