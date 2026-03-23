self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open('agua-limpia-v1').then((cache) => cache.addAll([
      '/',
      '/dashboard',
      '/manifest.json',
      '/icon.svg'
    ]))
  );
});

self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((response) => response || fetch(e.request))
  );
});
