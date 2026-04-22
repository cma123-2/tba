const CACHE = 'batida-v1.2c';
const ASSETS = [
  './index.html',
  './manifest.json',
  './logo.png',
  './icon.png'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  if (!e.request.url.startsWith(self.location.origin)) return;
  // Navegación: siempre desde caché, nunca red
  if (e.request.mode === 'navigate') {
    e.respondWith(caches.match('./index.html'));
    return;
  }
  // Resto de recursos: caché primero, sin red
  e.respondWith(
    caches.match(e.request).then(cached => cached || caches.match('./index.html'))
  );
});
