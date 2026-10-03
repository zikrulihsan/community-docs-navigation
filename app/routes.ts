import { type RouteConfig, index, layout, route } from '@react-router/dev/routes';

export default [
  // Publik — di-prerender saat build (lihat react-router.config.ts)
  index('routes/home.tsx'),
  route('events', 'routes/events.tsx'),
  route('events/:slug', 'routes/event-detail.tsx'),
  route('blog', 'routes/blog.tsx'),
  route('blog/:slug', 'routes/blog-post.tsx'),
  route('jobs', 'routes/jobs.tsx'),
  route('videos', 'routes/videos.tsx'),
  route('mentorship', 'routes/mentorship.tsx'),
  route('mentorship/daftar', 'routes/mentorship-form.tsx'),
  route('code-of-conduct', 'routes/code-of-conduct.tsx'),
  route('terima-kasih', 'routes/thanks.tsx'),

  // SPA — data diambil di browser dari Supabase
  route('masuk', 'routes/login.tsx'),
  route('auth/callback', 'routes/auth-callback.tsx'),
  route('courses', 'routes/courses.tsx'),
  route('courses/:slug', 'routes/course.tsx'),
  route('courses/:slug/:lesson', 'routes/lesson.tsx'),
  route('u/:username', 'routes/member-profile.tsx'),

  // Area member (wajib login)
  layout('routes/member-layout.tsx', [
    route('onboarding', 'routes/onboarding.tsx'),
    route('dashboard', 'routes/dashboard.tsx'),
    route('dashboard/profil', 'routes/profile-edit.tsx'),
  ]),
  route('admin', 'routes/admin.tsx'),

  route('*', 'routes/not-found.tsx'),
] satisfies RouteConfig;
