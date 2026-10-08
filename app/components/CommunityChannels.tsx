import { COMMUNITY_CHANNELS, type CommunityChannel } from '~/lib/site';

const stroke = { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round' } as const;

const ICONS: Record<CommunityChannel['id'], React.ReactNode> = {
  whatsapp: (
    <svg {...stroke}><path d="M4 20l1.3-3.9A8 8 0 1 1 8 18.8z" /><path d="M9.5 9.5c.3 1.6 1.9 3.6 3.9 4.5l1.1-1.1 1.8.8c-.2 1-1 1.8-2 1.8-3 0-6.5-3.5-6.5-6.5 0-1 .8-1.8 1.8-2l.8 1.8z" /></svg>
  ),
  telegram: <svg {...stroke}><path d="M21 4 3 11.2l6.2 2.3L11.5 20l3.3-4 4.7 3.6z" /><path d="m9.2 13.5 7-5.3" /></svg>,
  discord: (
    <svg {...stroke}><path d="M7.5 7.2A14 14 0 0 1 12 6.5c1.6 0 3.1.25 4.5.7L18 6c1.9 2.6 3 5.6 3 9.2-1.4 1.3-3 2.2-4.8 2.8l-1-1.8M7.5 7.2 6 6c-1.9 2.6-3 5.6-3 9.2 1.4 1.3 3 2.2 4.8 2.8l1-1.8" /><circle cx="9" cy="12.5" r="1.2" /><circle cx="15" cy="12.5" r="1.2" /></svg>
  ),
};

/** Kanal komunitas (onboarding & portal): WhatsApp aktif, Telegram & Discord menyusul. */
export function CommunityChannels() {
  return (
    <ul className="channels">
      {COMMUNITY_CHANNELS.map((c) => (
        <li key={c.id} data-status={c.status}>
          <span className="channel-ic" data-channel={c.id}>{ICONS[c.id]}</span>
          <div className="channel-main">
            <div className="channel-name">
              <strong>{c.name}</strong>
              <span className={`chip ${c.status === 'active' ? 'green' : 'yellow'}`}>{c.status === 'active' ? 'Aktif' : 'Segera aktif'}</span>
            </div>
            <span>{c.note}</span>
          </div>
          {c.url ? (
            <a className={`btn ${c.status === 'active' ? 'btn-primary' : 'btn-ghost'} sm`} href={c.url} target="_blank" rel="noopener">
              {c.status === 'active' ? `Gabung ${c.name}` : 'Gabung duluan'}
            </a>
          ) : (
            <span className="channel-later">Menyusul</span>
          )}
        </li>
      ))}
    </ul>
  );
}
