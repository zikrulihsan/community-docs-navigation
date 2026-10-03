import type { Session, User } from '@supabase/supabase-js';
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { redirect } from 'react-router';
import type { ProfileRow } from './database.types';
import { hasSupabase, supabase } from './supabase';

type AuthState = {
  /** true sampai sesi dari localStorage selesai dibaca — selalu true saat prerender. */
  loading: boolean;
  user: User | null;
  profile: ProfileRow | null;
  isAdmin: boolean;
  refreshProfile: () => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthState | null>(null);

export async function fetchProfile(userId: string) {
  const { data } = await supabase().from('profiles').select('*').eq('id', userId).maybeSingle();
  return data;
}

async function fetchIsAdmin() {
  const { data } = await supabase().rpc('is_admin');
  return data === true;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<ProfileRow | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  const userId = session?.user.id;

  useEffect(() => {
    if (!hasSupabase) {
      setLoading(false);
      return;
    }
    const { data } = supabase().auth.onAuthStateChange((_event, next) => {
      setSession(next);
      setLoading(false);
    });
    return () => data.subscription.unsubscribe();
  }, []);

  const refreshProfile = useCallback(async () => {
    if (!userId) {
      setProfile(null);
      setIsAdmin(false);
      return;
    }
    const [nextProfile, nextIsAdmin] = await Promise.all([fetchProfile(userId), fetchIsAdmin()]);
    setProfile(nextProfile);
    setIsAdmin(nextIsAdmin);
  }, [userId]);

  useEffect(() => {
    // Query Supabase jangan di-await di dalam callback onAuthStateChange (bisa deadlock),
    // jadi profil diambil di effect terpisah setiap user berganti.
    void refreshProfile();
  }, [refreshProfile]);

  const value = useMemo<AuthState>(
    () => ({
      loading,
      user: session?.user ?? null,
      profile,
      isAdmin,
      refreshProfile,
      signOut: async () => {
        await supabase().auth.signOut();
      },
    }),
    [loading, session, profile, isAdmin, refreshProfile],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth harus dipakai di dalam <AuthProvider>.');
  return ctx;
}

export const loginPath = (next: string) => `/masuk?next=${encodeURIComponent(next)}`;

/** Untuk clientLoader: ambil user yang login, atau lempar redirect ke halaman masuk. */
export async function requireUser(request: Request) {
  const url = new URL(request.url);
  const next = url.pathname + url.search;
  if (!hasSupabase) throw redirect(loginPath(next));

  const { data } = await supabase().auth.getSession();
  if (!data.session) throw redirect(loginPath(next));
  return data.session.user;
}

export async function getOptionalUser() {
  if (!hasSupabase) return null;
  const { data } = await supabase().auth.getSession();
  return data.session?.user ?? null;
}

export async function requireAdmin(request: Request) {
  const user = await requireUser(request);
  if (!(await fetchIsAdmin())) throw redirect('/dashboard?admin=denied');
  return user;
}

/** Hanya izinkan redirect ke path internal (cegah open redirect lewat ?next=). */
export function safeNext(next: string | null, fallback = '/dashboard') {
  return next && next.startsWith('/') && !next.startsWith('//') ? next : fallback;
}

export function displayName(profile: ProfileRow | null, user: User | null) {
  return profile?.full_name || user?.email?.split('@')[0] || 'member';
}

export function initials(name: string) {
  return (
    name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((w) => w[0]!.toUpperCase())
      .join('') || '?'
  );
}
