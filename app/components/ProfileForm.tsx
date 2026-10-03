import { useState, type FormEvent } from 'react';
import type { ProfileRow, Seniority } from '~/lib/database.types';
import { supabase } from '~/lib/supabase';

export const seniorityLabel: Record<Seniority, string> = {
  student: 'Mahasiswa / bootcamp',
  junior: 'Junior',
  mid: 'Mid-level',
  senior: 'Senior',
  staff: 'Staff / Principal',
  manager: 'Engineering Manager',
};

const USERNAME_RE = /^[a-z0-9_]{3,30}$/;

const suggestUsername = (profile: ProfileRow, email?: string) =>
  profile.username ??
  (profile.full_name || email?.split('@')[0] || '')
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')
    .slice(0, 30);

const httpsOrNull = (v: string) => {
  if (!v) return null;
  const withScheme = /^https?:\/\//.test(v) ? v.replace(/^http:/, 'https:') : `https://${v}`;
  return withScheme;
};

type Props = {
  profile: ProfileRow;
  email?: string;
  /** Onboarding hanya minta data inti; halaman profil menampilkan semua field. */
  variant: 'onboarding' | 'full';
  submitLabel: string;
  onSaved: (profile: ProfileRow) => void;
};

export function ProfileForm({ profile, email, variant, submitLabel, onSaved }: Props) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const full = variant === 'full';

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const val = (name: string) => String(form.get(name) ?? '').trim();

    const username = val('username').toLowerCase();
    if (!USERNAME_RE.test(username)) {
      setError('Username 3–30 karakter: huruf kecil, angka, atau underscore.');
      return;
    }

    const update = {
      full_name: val('full_name'),
      username,
      headline: val('headline'),
      seniority: (val('seniority') || null) as Seniority | null,
      company: val('company') || null,
      skills: [...new Set(val('skills').split(',').map((s) => s.trim()).filter(Boolean))].slice(0, 15),
      onboarded_at: profile.onboarded_at ?? new Date().toISOString(),
      ...(full && {
        bio: val('bio'),
        linkedin_url: httpsOrNull(val('linkedin_url')),
        github_url: httpsOrNull(val('github_url')),
      }),
    };

    setBusy(true);
    setError(null);
    const { data, error: saveError } = await supabase().from('profiles').update(update).eq('id', profile.id).select().single();
    setBusy(false);

    if (saveError) {
      setError(saveError.code === '23505' ? 'Username itu sudah dipakai member lain.' : 'Profil belum tersimpan. Periksa isian lalu coba lagi.');
      return;
    }
    onSaved(data);
  };

  return (
    <form className="form-card wide" onSubmit={onSubmit}>
      {error && <p className="form-message error">{error}</p>}
      <div className="form-grid">
        <div className="field">
          <label htmlFor="full_name">Nama lengkap</label>
          <input id="full_name" name="full_name" required maxLength={80} defaultValue={profile.full_name} autoComplete="name" />
        </div>
        <div className="field">
          <label htmlFor="username">Username</label>
          <div className="prefix">
            <span>swegrowth.id/u/</span>
            <input id="username" name="username" required minLength={3} maxLength={30} pattern="[a-z0-9_]{3,30}" defaultValue={suggestUsername(profile, email)} autoCapitalize="none" spellCheck={false} />
          </div>
        </div>
        <div className="field span-2">
          <label htmlFor="headline">Headline</label>
          <p className="field-hint">Satu kalimat tentang dirimu, mis. "Backend engineer di fintech, lagi belajar system design".</p>
          <input id="headline" name="headline" maxLength={120} defaultValue={profile.headline} />
        </div>
        <fieldset className="field span-2" style={{ border: 0, padding: 0, margin: '0 0 16px' }}>
          <legend style={{ fontWeight: 700, fontSize: '.88rem', marginBottom: 7 }}>Level saat ini</legend>
          <div className="choice-row">
            {(Object.keys(seniorityLabel) as Seniority[]).map((s) => (
              <label key={s}>
                <input type="radio" name="seniority" value={s} defaultChecked={profile.seniority === s} />
                {seniorityLabel[s]}
              </label>
            ))}
          </div>
        </fieldset>
        <div className="field">
          <label htmlFor="company">Perusahaan / kampus <small>(opsional)</small></label>
          <input id="company" name="company" maxLength={80} defaultValue={profile.company ?? ''} autoComplete="organization" />
        </div>
        <div className="field">
          <label htmlFor="skills">Skill / minat</label>
          <input id="skills" name="skills" defaultValue={profile.skills.join(', ')} placeholder="Go, PostgreSQL, System Design" />
        </div>
        {full && (
          <>
            <div className="field span-2">
              <label htmlFor="bio">Bio <small>(opsional)</small></label>
              <textarea id="bio" name="bio" rows={4} maxLength={1000} defaultValue={profile.bio} />
            </div>
            <div className="field">
              <label htmlFor="linkedin_url">LinkedIn</label>
              <input id="linkedin_url" name="linkedin_url" type="text" inputMode="url" defaultValue={profile.linkedin_url ?? ''} placeholder="linkedin.com/in/username" />
            </div>
            <div className="field">
              <label htmlFor="github_url">GitHub</label>
              <input id="github_url" name="github_url" type="text" inputMode="url" defaultValue={profile.github_url ?? ''} placeholder="github.com/username" />
            </div>
          </>
        )}
      </div>
      <button className="btn btn-primary" type="submit" disabled={busy}>{busy ? 'Menyimpan…' : submitLabel}</button>
    </form>
  );
}
