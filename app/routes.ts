import { type RouteConfig, index, layout, route } from '@react-router/dev/routes';

export default [
  // Publik — di-prerender saat build (lihat react-router.config.ts)
  index('routes/home.tsx'),
  route('agenda', 'routes/agenda.tsx'),
  route('code-of-conduct', 'routes/code-of-conduct.tsx'),

  // SPA
  route('masuk', 'routes/login.tsx'),
  route('auth/callback', 'routes/auth-callback.tsx'),

  // Wajib login (lihat member-layout); isi khusus verified dijaga per halaman
  layout('routes/member-layout.tsx', [
    route('onboarding', 'routes/onboarding.tsx'),
    route('portal', 'routes/portal.tsx'),
    route('portal/agenda/:slug', 'routes/portal-event.tsx'),
    route('portal/profil', 'routes/portal-profile.tsx'),
    route('portal/membership', 'routes/membership.tsx'),
    // Masuk ke app lain dengan akun ini, mis. /ke/trellonotes
    route('ke/:app', 'routes/app-handoff.tsx'),
  ]),
  route('admin', 'routes/admin.tsx'),

  route('*', 'routes/not-found.tsx'),
] satisfies RouteConfig;
