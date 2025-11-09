"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/**
 * PrefetchRoutes component
 * Aggressively prefetches all main routes on component mount
 * This ensures instant navigation for users
 */
export default function PrefetchRoutes() {
  const router = useRouter();

  useEffect(() => {
    // List of all routes to prefetch
    const routesToPrefetch = [
      "/",
      "/events",
      "/courses",
      "/mentor",
      "/community",
    ];

    // Prefetch all routes after a short delay to not block initial render
    const timeoutId = setTimeout(() => {
      routesToPrefetch.forEach((route) => {
        router.prefetch(route);
      });
    }, 100);

    return () => clearTimeout(timeoutId);
  }, [router]);

  return null; // This component doesn't render anything
}
