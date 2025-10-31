/* Simple service worker for caching basic assets and offline fallback. */
const CACHE_NAME = 'pokedex-cache-v1';
const OFFLINE_URL = '/offline.html';
const PRECACHE = [
  '/',
  OFFLINE_URL,
  '/manifest.webmanifest',
  '/icons/icon-192.svg',
  '/icons/icon-512.svg'
];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE))
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(
      keys.filter(k => k !== CACHE_NAME).map((k) => caches.delete(k))
    ))
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  // navigation request -> offline fallback
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request).catch(() => caches.match(OFFLINE_URL))
    );
    return;
  }

  // Cache-first for images and API responses
  if (request.destination === 'image' || request.url.includes('/api/')) {
    event.respondWith(
      caches.open(CACHE_NAME).then((cache) =>
        cache.match(request).then((cached) =>
          cached || fetch(request).then((res) => { cache.put(request, res.clone()); return res; }).catch(() => cached)
        )
      )
    );
    return;
  }

  // default: try network then cache
  event.respondWith(
    fetch(request).catch(() => caches.match(request))
  );
});
