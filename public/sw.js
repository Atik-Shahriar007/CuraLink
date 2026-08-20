// Minimal offline-support service worker for CuraLink.
//
// Scope, deliberately kept small:
//   - Static assets (JS/CSS chunks, images, icons) are cached with a
//     cache-first strategy so the app shell still loads on a flaky/offline
//     connection.
//   - Page navigations use network-first: if the network fails (offline),
//     we fall back to a cached copy of the page if we have one, and
//     otherwise to a dedicated /offline page.
//   - API routes (/api/*) are intentionally NOT cached — this app deals in
//     live medical/booking/payment data, and serving stale API responses
//     while offline would be actively misleading (e.g. stale appointment
//     status, stale medicine stock). Those requests are left to fail
//     normally so the UI's existing error states can handle them.

const CACHE_NAME = "curalink-cache-v1";
const OFFLINE_URL = "/offline";

const PRECACHE_URLS = [OFFLINE_URL, "/manifest.json", "/icon.svg"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE_URLS))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)))
      )
  );
  self.clients.claim();
});

function isApiRequest(url) {
  return url.pathname.startsWith("/api/");
}

function isStaticAsset(url) {
  return (
    url.pathname.startsWith("/_next/static/") ||
    url.pathname.startsWith("/medicine-images/") ||
    url.pathname.startsWith("/images/") ||
    /\.(?:png|jpg|jpeg|svg|webp|ico|css|woff2?)$/.test(url.pathname)
  );
}

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin || isApiRequest(url)) return;

  // Page navigations: network-first, falling back to cache, then offline page.
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
          return response;
        })
        .catch(async () => {
          const cached = await caches.match(request);
          return cached || caches.match(OFFLINE_URL);
        })
    );
    return;
  }

  // Static assets: cache-first.
  if (isStaticAsset(url)) {
    event.respondWith(
      caches.match(request).then(
        (cached) =>
          cached ||
          fetch(request).then((response) => {
            const copy = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
            return response;
          })
      )
    );
  }
});
