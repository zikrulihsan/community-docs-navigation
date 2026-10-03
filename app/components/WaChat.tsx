import { useEffect, useRef, useState } from 'react';

/**
 * Simulasi grup WhatsApp di hero — dipertahankan dari situs lama.
 * Slide pertama ikut di-prerender dalam keadaan tampil penuh, jadi tetap ada
 * isinya sebelum JavaScript jalan.
 */
const ICON_CHAT = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.4 8.4 0 0 1-9 8.4L3 21l1.1-3.9A8.4 8.4 0 1 1 21 11.5z"/></svg>`;
const ICON_DB = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><ellipse cx="12" cy="5.5" rx="7.5" ry="2.8"/><path d="M4.5 5.5v6c0 1.5 3.4 2.8 7.5 2.8s7.5-1.3 7.5-2.8v-6"/><path d="M4.5 11.5v6c0 1.5 3.4 2.8 7.5 2.8s7.5-1.3 7.5-2.8v-6"/></svg>`;
const ICON_AI = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2.6l2.1 5.6 5.6 2.1-5.6 2.1L12 18l-2.1-5.6L4.3 10.3l5.6-2.1z"/><circle cx="18.7" cy="5.3" r="1.2"/></svg>`;
const ICON_GLOBE = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M3 12h18"/><path d="M12 3c2.7 2.8 2.7 15.2 0 18c-2.7-2.8-2.7-15.2 0-18z"/></svg>`;
const ICON_BOOK = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M6.5 4H18a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1H6.5A2.5 2.5 0 0 1 4 16.5v-10A2.5 2.5 0 0 1 6.5 4z"/><path d="M4 16.5A2.5 2.5 0 0 1 6.5 14H19"/></svg>`;
const ICON_SOFT = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M7.5 18.5a4.5 4.5 0 0 1-.6-8.96 6 6 0 0 1 11.55 1.2A3.8 3.8 0 0 1 17.5 18.5z"/></svg>`;
const ICON_HEALTH = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M6.5 6.5v11M4 9v5M17.5 6.5v11M20 9v5M6.5 12h11"/></svg>`;
const ICON_MANAGE = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="3" width="6" height="4" rx="1"/><rect x="3" y="16.5" width="6" height="4" rx="1"/><rect x="15" y="16.5" width="6" height="4" rx="1"/><path d="M12 7v3M6 16.5V13h12v3.5M12 10v3"/></svg>`;

type Msg = { n?: string; cl?: string; t: string; tm: string; me?: boolean; host?: boolean; bot?: boolean };
type Slide = { n: string; c: number | null; ic: string; online: number; msgs: Msg[] };

const slides: Slide[] = [
  {
    n: 'General Discussion', c: 995, ic: ICON_CHAT, online: 218,
    msgs: [
      { n: 'Hanif', cl: 'c1', t: 'halo semua, aku frontend 2 tahun. mau mulai serius belajar system design 👋', tm: '19.01' },
      { n: 'Hasrul', cl: 'c2', t: 'sini bahas bareng, gw baru gagal interview wkwk', tm: '19.04' },
      { me: true, t: 'wkwk samaan, gas latihan bareng 🔥', tm: '19.04' },
      { n: 'Agung', cl: 'c3', t: 'BARU DAPET OFFER ABROAD!! makasih grup ini 🇮🇩', tm: '19.06' },
      { n: 'Zikrul SWE Growth', cl: 'c3', t: 'MANTAP Dimas 🚀 traktir sharing "going abroad" dong', tm: '19.07' },
      { me: true, t: 'ntar gw drop link diskusinya di sini 👍', tm: '19.09' },
    ],
  },
  {
    n: 'Backend SE Growth', c: 751, ic: ICON_DB, online: 140,
    msgs: [
      { n: 'Lino', cl: 'c2', t: 'monolith vs microservices buat tim 5 orang, mending mana?', tm: '20.12' },
      { n: 'Jauhar', cl: 'c4', t: 'mulai monolith dulu aja, split kalau udah kerasa sakitnya', tm: '20.15' },
      { me: true, t: 'setuju, jangan over-engineer di awal 👍', tm: '20.16' },
      { n: 'Oshi', cl: 'c1', t: 'btw ada yg pernah rapihin N+1 query di ORM? lagi pusing', tm: '20.19' },
      { n: 'Nanda', cl: 'c3', t: 'pakai eager loading / select_related biasanya beres kok', tm: '20.22' },
      { me: true, t: 'nice, gw coba refactor dulu', tm: '20.24' },
    ],
  },
  {
    n: 'AI Tools SWE Growth', c: 724, ic: ICON_AI, online: 160,
    msgs: [
      { n: 'Zain', cl: 'c2', t: 'ada kabar AI kere hore baru nih, modelnya murah tapi hasilnya gila', tm: '13.40' },
      { n: 'Zahid', cl: 'c1', t: 'wkwk era AI kere hore emang, gratisan aja udah kepake banget sekarang', tm: '13.42' },
      { n: 'Michael', cl: 'c2', t: 'btw kalian tim mana sih? Claude, Codex, atau mocin?', tm: '13.45' },
      { me: true, t: 'gw tim Claude, paling enak buat coding 🤖', tm: '13.46' },
      { n: 'Iqbal', cl: 'c4', t: 'gw campur: Claude buat mikir, mocin buat yang murah meriah', tm: '13.49' },
      { n: 'Zikrul SWE Growth', cl: 'c3', t: 'tim apa aja boleh, yang penting tetap mikir sendiri ya ✨', tm: '13.51' },
    ],
  },
  {
    n: 'English Club', c: 640, ic: ICON_GLOBE, online: 95,
    msgs: [
      { n: 'Akhyar', cl: 'c4', t: 'weekly speaking practice this Saturday, join us 🗣️', tm: '09.05' },
      { n: 'Zain', cl: 'c3', t: "let's talk in English today, no bahasa allowed 😄", tm: '09.11' },
      { me: true, t: 'haha sure, I really need to practice speaking ✍️', tm: '09.12' },
      { n: 'Mukhlis', cl: 'c2', t: 'looking for a partner for daily conversation, anyone interested?', tm: '09.18' },
      { n: 'Vivi', cl: 'c1', t: "I'm in for Saturday! I want to get fluent at speaking", tm: '09.20' },
      { n: 'Zikrul SWE Growth', cl: 'c3', t: "awesome, I'll share the room link later 🔗", tm: '09.22' },
    ],
  },
  {
    n: 'Book Club SWE Growth', c: 375, ic: ICON_BOOK, online: 60,
    msgs: [
      { n: 'Arif', cl: 'c1', t: 'lagi baca The Effective Engineer 📚 diskusi bab 4 yuk', tm: '21.02' },
      { me: true, t: '+1, isinya daging semua 💯', tm: '21.03' },
      { n: 'Abid', cl: 'c2', t: 'Designing Data-Intensive Apps ada yg mau nyusul?', tm: '21.06' },
      { n: 'Oshi', cl: 'c4', t: 'rekomendasi buku buat calon tech lead dong', tm: '21.09' },
      { n: 'Azam', cl: 'c3', t: 'gw vote DDIA buat batch baca bareng bulan depan', tm: '21.12' },
      { n: 'Adnan', cl: 'c2', t: 'setuju, sekalian bikin catatan bareng 📒', tm: '21.14' },
    ],
  },
  {
    n: 'Soft skills', c: 177, ic: ICON_SOFT, online: 48,
    msgs: [
      { n: 'Fajar', cl: 'c2', t: 'beda mid vs senior yang sebenernya apa sih?', tm: '17.30' },
      { n: 'Zikrul SWE Growth', cl: 'c3', t: 'bukan soal ngoding doang, tapi impact & ownership 🚀', tm: '17.33' },
      { me: true, t: 'noted, makasih insight-nya', tm: '17.34' },
      { n: 'Zain', cl: 'c3', t: 'cara nunjukkin impact biar dilirik buat promosi?', tm: '17.38' },
      { n: 'Akhyar', cl: 'c4', t: 'mentoring junior juga ngangkat "impact" kamu lho', tm: '17.41' },
      { me: true, t: 'bener, gw mulai ambil lebih banyak ownership deh', tm: '17.43' },
    ],
  },
  {
    n: 'SWE Growth Hidup Sehat', c: 312, ic: ICON_HEALTH, online: 54,
    msgs: [
      { n: 'Zain', cl: 'c2', t: 'gimana sih cara handle perut yang makin offside? kerjaan duduk mulu hmm', tm: '07.10' },
      { n: 'Ajitama', cl: 'c1', t: 'mulai dari jalan 8rb langkah + kurangin gorengan, ngefek pelan-pelan kok', tm: '07.13' },
      { n: 'Michael', cl: 'c4', t: 'aku kunci di reminder pagi biar konsisten, sekali skip suka keterusan wkwk', tm: '07.15' },
      { n: 'Riga', cl: 'c3', t: 'set target kecil dulu aja, 3x seminggu, naikin pelan-pelan', tm: '07.18' },
      { me: true, t: '#lapor lari 5km hari ini 🏃‍♂️', tm: '07.41' },
      { bot: true, n: 'Growth Bot', t: 'selamat ya! streak olahraga kamu jalan terus, mantap 💪', tm: '07.41' },
    ],
  },
  {
    n: 'Managerial Discussion', c: 198, ic: ICON_MANAGE, online: 31,
    msgs: [
      { n: 'Joko', cl: 'c3', t: 'gimana cara kalian healing setelah seharian ngurus management? penat banget', tm: '18.20' },
      { n: 'Panji', cl: 'c2', t: 'gw matiin notif kerja abis jam 6, terus full main sama anak. wajib sih', tm: '18.23' },
      { n: 'Arif', cl: 'c4', t: 'journaling 10 menit + jalan sore, kepala langsung enteng', tm: '18.26' },
      { n: 'Tegar', cl: 'c1', t: 'block 1 hari no-meeting tiap minggu, ngebantu banget buat napas', tm: '18.29' },
      { me: true, t: 'noted, kayaknya gw kebanyakan meeting tanpa jeda hehe', tm: '18.31' },
      { n: 'Zikrul SWE Growth', cl: 'c3', t: 'jaga diri dulu, baru bisa jagain tim 🙏', tm: '18.34' },
    ],
  },
];

const subText = (s: Slide) =>
  `${s.c ? s.c.toLocaleString('id-ID') + ' anggota' : 'grup baru'} · ${s.online} online`;
const nmClass = (m: Msg) => (m.host ? 'host' : m.bot ? 'bot' : m.cl || '');

const AUTO_MS = 5200;

export function WaChat() {
  const [gi, setGi] = useState(0);
  /** Jumlah bubble yang sudah muncul; Infinity = semua (render awal & reduced motion). */
  const [shown, setShown] = useState(Number.POSITIVE_INFINITY);
  const [tick, setTick] = useState(0); // naik setiap user pindah slide → reset timer auto-play
  const bodyRef = useRef<HTMLDivElement>(null);
  const firstRender = useRef(true);

  // Munculkan bubble satu per satu setiap ganti slide.
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setShown(Number.POSITIVE_INFINITY);
      return;
    }
    setShown(0);
    const timers = slides[gi]!.msgs.map((_, mi) => setTimeout(() => setShown(mi + 1), 90 + mi * 340));
    return () => timers.forEach(clearTimeout);
  }, [gi]);

  // Auto-play; berhenti kalau tab disembunyikan, slider di luar layar, atau user minta gerakan minimal.
  useEffect(() => {
    const reduce = matchMedia('(prefers-reduced-motion: reduce)');
    let inView = true;
    let timer: ReturnType<typeof setInterval> | undefined;

    const restart = () => {
      clearInterval(timer);
      if (reduce.matches || !inView || document.hidden) return;
      timer = setInterval(() => setGi((i) => (i + 1) % slides.length), AUTO_MS);
    };

    const io =
      'IntersectionObserver' in window && bodyRef.current
        ? new IntersectionObserver((entries) => {
            inView = entries[0]!.isIntersecting;
            restart();
          })
        : null;
    if (io && bodyRef.current) io.observe(bodyRef.current);

    document.addEventListener('visibilitychange', restart);
    reduce.addEventListener('change', restart);
    restart();

    return () => {
      clearInterval(timer);
      io?.disconnect();
      document.removeEventListener('visibilitychange', restart);
      reduce.removeEventListener('change', restart);
    };
  }, [tick]);

  const goTo = (i: number) => {
    setGi((i + slides.length) % slides.length);
    setTick((t) => t + 1);
  };

  const g = slides[gi]!;

  return (
    <div className="wa-slider">
      <div className="wa">
        <div className="wa-inner">
          <div className="wa-head">
            <span className="mark" dangerouslySetInnerHTML={{ __html: g.ic }} />
            <div className="g-meta">
              <div className="g-name">{g.n}</div>
              <div className="g-sub">{subText(g)}</div>
            </div>
          </div>
          <div className="wa-body" ref={bodyRef}>
            {g.msgs.map((m, mi) => (
              <div
                key={`${gi}-${mi}`}
                className={`bub${mi < shown ? ' in' : ''}${m.me ? ' me' : ''}${m.host ? ' host' : ''}${m.bot ? ' bot' : ''}`}
              >
                {!m.me && <span className={`nm ${nmClass(m)}`}>{m.n}</span>}
                {m.t}
                <span className="tm">{m.tm}</span>
              </div>
            ))}
          </div>
          <div className="wa-type">
            <div className="field">Ketik pesan…</div>
            <span className="send"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M3 20l18-8L3 4l0 6 12 2-12 2z" /></svg></span>
          </div>
        </div>
      </div>
      <div className="wa-nav">
        <button className="wa-btn" type="button" aria-label="Grup sebelumnya" onClick={() => goTo(gi - 1)}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M15 6l-6 6 6 6" /></svg>
        </button>
        <div className="wa-dots" role="tablist" aria-label="Pilih grup">
          {slides.map((s, i) => (
            <button key={s.n} type="button" role="tab" aria-selected={i === gi} className={i === gi ? 'on' : undefined} aria-label={s.n} onClick={() => goTo(i)} />
          ))}
        </div>
        <button className="wa-btn" type="button" aria-label="Grup berikutnya" onClick={() => goTo(gi + 1)}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M9 6l6 6-6 6" /></svg>
        </button>
      </div>
    </div>
  );
}
