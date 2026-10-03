import { useState, type FormEvent } from 'react';
import type { ProfileRow } from '~/lib/database.types';
import { supabase } from '~/lib/supabase';

const WHATSAPP_RE = /^\+?[0-9 -]{8,20}$/;

type Props = {
  profile: ProfileRow;
  submitLabel: string;
  onSaved: (profile: ProfileRow) => void;
};

/** Data yang dipakai admin untuk mencocokkan akun dengan pembayaran di goakal. */
export function ProfileForm({ profile, submitLabel, onSaved }: Props) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const val = (name: string) => String(form.get(name) ?? '').trim();

    const whatsapp = val('whatsapp');
    if (!WHATSAPP_RE.test(whatsapp)) {
      setError('Nomor WhatsApp 8–20 digit, boleh diawali +.');
      return;
    }

    setBusy(true);
    setError(null);
    const { data, error: saveError } = await supabase()
      .from('profiles')
      .update({
        full_name: val('full_name'),
        whatsapp,
        headline: val('headline'),
        company: val('company') || null,
        onboarded_at: profile.onboarded_at ?? new Date().toISOString(),
      })
      .eq('id', profile.id)
      .select()
      .single();
    setBusy(false);

    if (saveError) {
      setError('Profil belum tersimpan. Periksa isian lalu coba lagi.');
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
          <label htmlFor="whatsapp">Nomor WhatsApp</label>
          <input id="whatsapp" name="whatsapp" type="tel" required defaultValue={profile.whatsapp ?? ''} autoComplete="tel" placeholder="08…" />
        </div>
        <div className="field">
          <label htmlFor="headline">Pekerjaan / peran <small>(opsional)</small></label>
          <input id="headline" name="headline" maxLength={120} defaultValue={profile.headline} placeholder="Backend engineer" />
        </div>
        <div className="field">
          <label htmlFor="company">Perusahaan / kampus <small>(opsional)</small></label>
          <input id="company" name="company" maxLength={80} defaultValue={profile.company ?? ''} autoComplete="organization" />
        </div>
      </div>
      <button className="btn btn-primary" type="submit" disabled={busy}>{busy ? 'Menyimpan…' : submitLabel}</button>
    </form>
  );
}
