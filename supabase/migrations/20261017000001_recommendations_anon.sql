-- Supabase memberi anon akses default ke fungsi baru; dua fungsi ini khusus akun yang login.
revoke execute on function public.check_recommendation_url(text, uuid) from anon;
revoke execute on function public.submit_recommendation(text, text, text, text, text, text[], text, text, date, text, text, boolean, uuid) from anon;
