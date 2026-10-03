import { initials } from '~/lib/auth';

export function Avatar({ name, src, size = 38 }: { name: string; src?: string | null; size?: number }) {
  return (
    <span className="avatar" style={{ width: size, height: size, fontSize: size * 0.38 }} aria-hidden="true">
      {src ? <img src={src} alt="" width={size} height={size} referrerPolicy="no-referrer" /> : initials(name)}
    </span>
  );
}
