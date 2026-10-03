import { data } from 'react-router';

/** Catch-all: lempar 404 supaya ErrorBoundary di root yang menampilkan halamannya. */
export function clientLoader() {
  throw data(null, { status: 404 });
}

export default function NotFound() {
  return null;
}
