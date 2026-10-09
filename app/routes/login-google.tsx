import { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router';
import type { Route } from './+types/login-google';
import { GoogleSignIn, hasGoogleClientId } from '~/components/GoogleSignIn';
import { safeNext, useAuth } from '~/lib/auth';
import { pageMeta } from '~/lib/site';
import { hasSupabase } from '~/lib/supabase';

export const meta: Route.MetaFunction = () => [
  ...pageMeta('Masuk dengan Google — SWE Growth', 'Masuk ke akun SWE Growth dengan Google.'),
  { name: 'robots', content: 'noindex' },
];

/**
 * Uji coba: login Google lewat Google Identity Services + signInWithIdToken.
 * Akun yang terbentuk sama dengan login di /masuk (dicocokkan lewat akun Google).
 */
export default function LoginGoogle() {
  const [params] = useSearchParams();
  const next = safeNext(params.get('next'));
  const navigate = useNavigate();
  const { loading, user } = useAuth();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && user) navigate(next, { replace: true });
  }, [loading, user, next, navigate]);

  return (
    <section className="block auth-block">
      <div className="wrap" style={{ display: 'grid', placeItems: 'center' }}>
        <div className="form-card auth-card">
          <h1>Masuk dengan Google</h1>
          <p className="form-sub">Cukup pakai akun Google, tanpa password. Akun baru langsung dibuat.</p>

          {!hasSupabase && <p className="form-message error">Login belum dikonfigurasi di environment ini.</p>}
          {hasSupabase && !hasGoogleClientId && (
            <p className="form-message error">VITE_GOOGLE_CLIENT_ID belum diisi, jadi tombol di bawah masih memakai redirect lewat Supabase.</p>
          )}
          {error && <p className="form-message error">{error}</p>}

          <GoogleSignIn next={next} onSignedIn={() => navigate(next, { replace: true })} onError={setError} />

          <p className="auth-foot">
            Dengan masuk, kamu setuju dengan <Link to="/term-of-service">Syarat Layanan</Link>,{' '}
            <Link to="/privasi">Kebijakan Privasi</Link>, dan <Link to="/code-of-conduct">Code of Conduct</Link> komunitas.
          </p>
        </div>
      </div>
    </section>
  );
}
