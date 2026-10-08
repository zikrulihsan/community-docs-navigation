import { useState } from 'react';
import { initials } from '~/lib/auth';

/** Foto bulat; kalau tidak ada atau gagal dimuat, tampil inisial. */
export function Avatar({ name, src, size = 38 }: { name: string; src?: string | null; size?: number }) {
  const [failed, setFailed] = useState<string | null>(null);
  const showImage = src && failed !== src;

  return (
    <span className="avatar" style={{ width: size, height: size, fontSize: size * 0.38 }} aria-hidden="true">
      {showImage ? (
        <img src={src} alt="" width={size} height={size} referrerPolicy="no-referrer" onError={() => setFailed(src)} />
      ) : (
        initials(name)
      )}
    </span>
  );
}
