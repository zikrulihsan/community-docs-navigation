import { useEffect, useState, type FormEvent } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router';
import type { Route } from './+types/login';
import { safeNext, useAuth } from '~/lib/auth';
import { pageMeta } from '~/lib/site';
import { hasSupabase, supabase } from '~/lib/supabase';

export const meta: Route.MetaFunction = () => [
  ...pageMeta('Masuk — SWE Growth', 'Masuk ke akun member SWE Growth.'),
  { name: 'robots', content: 'noindex' },
];

const callbackUrl = (next: string) =>
  `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`;

const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.4h6.5a5.6 5.6 0 0 1-2.4 3.6v3h3.9c2.2-2.1 3.5-5.1 3.5-8.7z" />
    <path fill="#34A853" d="M12 24c3.2 0 6-1.1 8-2.9l-3.9-3c-1.1.7-2.5 1.2-4.1 1.2-3.1 0-5.8-2.1-6.7-5H1.3v3.1A12 12 0 0 0 12 24z" />
    <path fill="#FBBC05" d="M5.3 14.3a7.2 7.2 0 0 1 0-4.6V6.6h-4a12 12 0 0 0 0 10.8z" />
    <path fill="#EA4335" d="M12 4.8c1.8 0 3.3.6 4.6 1.8l3.4-3.4A12 12 0 0 0 1.3 6.6l4 3.1c.9-2.9 3.6-4.9 6.7-4.9z" />
  </svg>
);

export default function Login() {
  const [params] = useSearchParams();
  const next = safeNext(params.get('next'));
  const navigate = useNavigate();
  const { loading, user } = useAuth();
  const [sentTo, setSentTo] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(params.get('error') === 'callback' ? 'Link login tidak valid atau sudah kedaluwarsa. Coba kirim ulang.' : null);

  // Sudah login? Langsung lanjut.
  useEffect(() => {
    if (!loading && user) navigate(next, { replace: true });
  }, [loading, user, next, navigate]);

  const signInWithGoogle = async () => {
    setBusy(true);
    setError(null);
    const { error: oauthError } = await supabase().auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: callbackUrl(next) },
    });
    if (oauthError) {
      setError('Login Google belum bisa dipakai. Coba lewat email dulu ya.');
      setBusy(false);
    }
  };

  const sendMagicLink = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const email = String(new FormData(e.currentTarget).get('email') ?? '').trim().toLowerCase();
    setBusy(true);
    setError(null);
    const { error: otpError } = await supabase().auth.signInWithOtp({
      email,
      options: { emailRedirectTo: callbackUrl(next), shouldCreateUser: true },
    });
    setBusy(false);
    if (otpError) {
      setError(otpError.status === 429 ? 'Terlalu sering. Tunggu sebentar sebelum minta link lagi.' : 'Link login belum bisa dikirim. Coba lagi.');
      return;
    }
    setSentTo(email);
  };

  return (
    <section className="block auth-block">
      <div className="wrap" style={{ display: 'grid', placeItems: 'center' }}>
        <div className="form-card auth-card">
          <span className="eyebrow">Member SWE Growth</span>
          <h1>Masuk atau daftar.</h1>
          <p className="form-sub">
            Satu akun untuk daftar event, belajar di course, dan menyimpan progress-mu. Gratis, tanpa password.
          </p>

          {!hasSupabase && <p className="form-message error">Login belum dikonfigurasi di environment ini.</p>}
          {error && <p className="form-message error">{error}</p>}

          {sentTo ? (
            <div className="form-message success">
              Link login sudah dikirim ke <strong>{sentTo}</strong>. Cek inbox (dan folder spam), lalu klik link-nya dari perangkat ini.
              <div style={{ marginTop: 10 }}>
                <button className="link-btn" type="button" onClick={() => setSentTo(null)}>Pakai email lain</button>
              </div>
            </div>
          ) : (
            <>
              <button className="btn btn-provider" type="button" onClick={signInWithGoogle} disabled={busy || !hasSupabase}>
                <GoogleIcon />
                Lanjut dengan Google
              </button>
              <div className="or-divider">atau lewat email</div>
              <form onSubmit={sendMagicLink}>
                <div className="field">
                  <label htmlFor="email">Email</label>
                  <input id="email" name="email" type="email" required autoComplete="email" placeholder="nama@email.com" />
                </div>
                <button className="btn btn-primary" type="submit" disabled={busy || !hasSupabase}>
                  {busy ? 'Mengirim…' : 'Kirim link masuk'}
                </button>
              </form>
            </>
          )}

          <p className="auth-foot">
            Dengan masuk, kamu setuju menjaga <Link to="/code-of-conduct">Code of Conduct</Link> komunitas.
          </p>
        </div>
      </div>
    </section>
  );
}
