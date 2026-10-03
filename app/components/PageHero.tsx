import type { ReactNode } from 'react';

export function PageHero({ badge, title, lead, children }: { badge?: string; title: string; lead?: string; children?: ReactNode }) {
  return (
    <header className="page-hero">
      <div className="wrap">
        {children}
        {badge && <span className="badge mono">{badge}</span>}
        <h1>{title}</h1>
        {lead && <p className="lead">{lead}</p>}
      </div>
    </header>
  );
}
