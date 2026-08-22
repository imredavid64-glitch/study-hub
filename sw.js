/* Study Hub — Service Worker
 * Enables install-as-app (PWA) and offline access to the app shell.
 * API calls and cross-origin resources are never cached.
 * Bump CACHE whenever a release changes app files — returning users get the
 * new build on their next visit (stale-while-revalidate) and offline keeps working.
 */
const CACHE = 'study-hub-v1.1.7';
const SHELL = [
  './',
  './index.html',
  './styles.css',
  './app.js',
  './cloud-core.js',
  './mobile.js',
  './studymap-data.js',
  './manifest.webmanifest'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE)
      .then((cache) => cache.addAll(SHELL))
      .then(() => self.skipWaiting())
      .catch((e) => console.warn('[SW] Precache failed:', e))
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Never touch API calls or cross-origin requests (CDNs, Supabase, Groq proxy…)
  if (url.origin !== self.location.origin || url.pathname.indexOf('/api/') === 0) return;

  // Navigations: network-first, fall back to cached shell for offline use
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then((res) => {
          const copy = res.clone();
          caches.open(CACHE).then((cache) => cache.put('./index.html', copy)).catch(() => {});
          return res;
        })
        .catch(() => caches.match('./index.html'))
    );
    return;
  }

  // Static assets: stale-while-revalidate — serve cached instantly, refresh in
  // the background so users pick up new deploys on their next visit.
  event.respondWith(
    caches.match(event.request).then((cached) => {
      const network = fetch(event.request).then((res) => {
        if (res && res.ok) {
          const copy = res.clone();
          caches.open(CACHE).then((cache) => cache.put(event.request, copy)).catch(() => {});
        }
        return res;
      }).catch(() => cached);
      return cached || network;
    })
  );
});
