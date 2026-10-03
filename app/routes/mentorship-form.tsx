import { useEffect, useRef, useState, type FormEvent } from 'react';
import { Link, useSearchParams } from 'react-router';
import type { Route } from './+types/mentorship-form';
import { ArrowRight } from '~/components/Icons';
import { PageHero } from '~/components/PageHero';
import { useAuth } from '~/lib/auth';
import { getMentors } from '~/lib/content.server';
import { ADMIN_WA, pageMeta } from '~/lib/site';

/**
 * Form "SWE Growth Mentor Connect".
 * Tidak ada backend: jawaban dirangkai jadi satu pesan lalu dikirim ke
 * WhatsApp admin lewat link wa.me.
 */

export const meta: Route.MetaFunction = () =>
  pageMeta(
    'Form mentorship — SWE Growth',
    'Formulir SWE Growth Mentor Connect. Isi kondisi dan kebutuhanmu, lalu kirim langsung ke admin lewat WhatsApp untuk dicocokkan dengan mentor yang pas.',
  );

export async function loader() {
  const mentors = (await getMentors())
    .filter((m) => m.available)
    .map((m) => m.name)
    .sort((a, b) => a.localeCompare(b));
  return { mentors };
}

/** Pertanyaan mengikuti urutan form Mentor Connect. */
const questions = [
  {
    id: 'kondisi',
    label: 'Boleh jelaskan kondisimu saat ini?',
    hint: 'Role saat ini, pekerjaan saat ini, dan kesibukan apa saja yang sedang dilakukan.',
    rows: 4,
  },
  {
    id: 'masalah',
    label: 'Apa permasalahan atau areas of improvement yang ingin kamu dapatkan solusinya?',
    hint: 'Khusus di dunia software engineering — makin spesifik, makin gampang kami carikan mentornya.',
    rows: 4,
  },
  {
    id: 'motivasi',
    label: 'Kenapa tertarik mengikuti mentoring?',
    hint: 'Dan bagaimana kamu melihat mentoring bisa membantu mencapai tujuanmu sebagai software engineer.',
    rows: 4,
  },
  {
    id: 'kriteria',
    label: 'Bagaimana kriteria mentor yang kamu harapkan?',
    hint: 'Misalnya bidang keahlian, level pengalaman, atau gaya mentoring yang cocok buatmu.',
    rows: 3,
  },
];

const NO_PREF = 'Belum ada preferensi, mohon dibantu carikan';

export default function MentorshipForm({ loaderData: { mentors } }: Route.ComponentProps) {
  const [params] = useSearchParams();
  const { profile } = useAuth();
  const formRef = useRef<HTMLFormElement>(null);
  const [showError, setShowError] = useState(false);

  // Datang dari kartu mentor di /mentorship? Pilihannya kita isi otomatis.
  // Query baru terbaca setelah hydrate (HTML-nya prerender), jadi diisi lewat effect.
  const wanted = params.get('mentor');
  useEffect(() => {
    const select = formRef.current?.elements.namedItem('mentor') as HTMLSelectElement | null;
    if (select && wanted && mentors.includes(wanted)) select.value = wanted;
  }, [wanted, mentors]);

  // Member yang sudah login: isi nama dari profil (masih bisa diubah).
  useEffect(() => {
    const nameInput = formRef.current?.elements.namedItem('nama') as HTMLInputElement | null;
    if (nameInput && !nameInput.value && profile?.full_name) nameInput.value = profile.full_name;
  }, [profile]);

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;

    if (!form.checkValidity()) {
      setShowError(true);
      const firstInvalid = form.querySelector<HTMLElement>(':invalid');
      firstInvalid?.focus();
      firstInvalid?.scrollIntoView({ block: 'center', behavior: 'smooth' });
      return;
    }
    setShowError(false);

    const data = new FormData(form);
    const val = (name: string) => String(data.get(name) ?? '').trim();
    const block = (label: string, answer: string) => `*${label}*\n${answer}`;
    const text = [
      'Halo admin SWE Growth 👋',
      'Saya mau ikut *SWE Growth Mentor Connect*. Berikut jawaban formulirnya:',
      '',
      block('Nama', val('nama')),
      '',
      block('Nomor WA aktif', val('wa')),
      '',
      block('Mentor yang dituju', val('mentor') || NO_PREF),
      '',
      block('Kondisi saat ini', val('kondisi')),
      '',
      block('Permasalahan / areas of improvement', val('masalah')),
      '',
      block('Kenapa tertarik mengikuti mentoring', val('motivasi')),
      '',
      block('Kriteria mentor yang diharapkan', val('kriteria')),
      '',
      block('Komitmen waktu', val('waktu')),
      '',
      block('Siap konsisten & inisiatif', val('konsisten')),
      '',
      'Terima kasih!',
    ].join('\n');

    const url = `https://wa.me/${ADMIN_WA}?text=${encodeURIComponent(text)}`;
    const tab = window.open(url, '_blank', 'noopener');
    if (!tab) location.href = url; // popup diblokir (umum di browser mobile)
  };

  return (
    <>
      <PageHero
        badge="Mentor Connect"
        title="Form pendaftaran mentorship"
        lead="Kami bantu carikan mentor yang cocok buat perkembangan kariermu — dan bantu mentor dapat mentee yang tepat dan berkomitmen. Isi formulir di bawah ini ya."
      />

      <section className="block">
        <div className="wrap form-wrap">
          <Link className="back" to="/mentorship">← Kembali ke halaman mentorship</Link>

          <div className="notice">
            Setelah tombol kirim ditekan, jawabanmu langsung terangkum jadi pesan WhatsApp ke admin —
            tinggal tekan <em>send</em> di aplikasi WhatsApp.
          </div>

          <form className="form-card wide" ref={formRef} onSubmit={onSubmit} noValidate>
            <h3>Data kamu</h3>
            <p className="form-sub">Tanda <span className="req">*</span> berarti wajib diisi.</p>

            <div className="field">
              <label htmlFor="nama">Nama <span className="req">*</span></label>
              <input id="nama" name="nama" type="text" required autoComplete="name" placeholder="Nama lengkap" />
            </div>

            <div className="field">
              <label htmlFor="wa">Nomor WA aktif <span className="req">*</span></label>
              <p className="field-hint">Kami akan menghubungimu via WA kalau terpilih di sesi mentorship.</p>
              <input id="wa" name="wa" type="tel" required autoComplete="tel" placeholder="08..." />
            </div>

            {mentors.length > 0 && (
              <div className="field">
                <label htmlFor="mentor">Mentor yang dituju (opsional)</label>
                <p className="field-hint">Belum ada preferensi? Biarkan saja — nanti kami cocokkan.</p>
                <select id="mentor" name="mentor" defaultValue="">
                  <option value="">{NO_PREF}</option>
                  {mentors.map((name) => <option key={name} value={name}>{name}</option>)}
                </select>
              </div>
            )}

            <h3 className="group-title">Ceritakan kebutuhanmu</h3>

            {questions.map((q) => (
              <div key={q.id} className="field">
                <label htmlFor={q.id}>{q.label} <span className="req">*</span></label>
                <p className="field-hint">{q.hint}</p>
                <textarea id={q.id} name={q.id} rows={q.rows} required></textarea>
              </div>
            ))}

            <h3 className="group-title">Komitmen</h3>

            <div className="field">
              <label htmlFor="waktu">Seberapa banyak waktu yang kamu komitmenkan untuk aktivitas mentoring? <span className="req">*</span></label>
              <input id="waktu" name="waktu" type="text" required placeholder="misal: 3 jam per minggu, di luar sesi rutin" />
            </div>

            <div className="field">
              <label htmlFor="konsisten">Apakah kamu siap untuk bisa konsisten dan inisiatif dalam proses mentoring? <span className="req">*</span></label>
              <select id="konsisten" name="konsisten" required defaultValue="">
                <option value="">Pilih jawaban</option>
                <option value="Siap, saya berkomitmen konsisten dan inisiatif">Siap, saya berkomitmen konsisten dan inisiatif</option>
                <option value="Siap, tapi masih perlu bantuan menjaga ritme">Siap, tapi masih perlu bantuan menjaga ritme</option>
                <option value="Belum yakin, ingin diskusi dulu dengan admin">Belum yakin, ingin diskusi dulu dengan admin</option>
              </select>
            </div>

            {showError && (
              <p className="form-error" role="alert">
                Masih ada pertanyaan wajib yang belum diisi. Cek lagi bagian yang ditandai ya.
              </p>
            )}

            <button className="btn btn-primary" type="submit">
              Kirim lewat WhatsApp
              <ArrowRight />
            </button>
            <p className="privacy">
              Jawabanmu tidak disimpan di website ini — semuanya langsung masuk ke chat WhatsApp kamu ke admin.
            </p>
          </form>
        </div>
      </section>
    </>
  );
}
