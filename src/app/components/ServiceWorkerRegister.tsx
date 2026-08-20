"use client";

import { useEffect } from "react";

// Registers the offline-support service worker (public/sw.js). Kept as its
// own tiny client component so the root layout can stay a server component.
export default function ServiceWorkerRegister() {
  useEffect(() => {
    if (typeof window === "undefined" || !("serviceWorker" in navigator)) return;

    navigator.serviceWorker.register("/sw.js").catch((err) => {
      console.error("Service worker registration failed:", err);
    });
  }, []);

  return null;
}
