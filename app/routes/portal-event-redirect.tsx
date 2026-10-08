import { redirect } from 'react-router';
import type { Route } from './+types/portal-event-redirect';

/** URL lama /portal/agenda/:slug → detail event publik. */
export function clientLoader({ params }: Route.ClientLoaderArgs) {
  throw redirect(`/agenda/${params.slug}`);
}

export default function PortalEventRedirect() {
  return null;
}
