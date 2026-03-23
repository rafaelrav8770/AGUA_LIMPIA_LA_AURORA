const CACHE_NAME = 'agua-limpia-v2';

// Solo cachear archivos estáticos (íconos, manifest)
const STATIC_ASSETS = [
  '/manifest.json',
  '/icon.svg'
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS))
  );
  // Activar inmediatamente sin esperar
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  // Borrar cachés viejas
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      )
    )
  );
  // Tomar control de todas las pestañas inmediatamente
  self.clients.claim();
});

self.addEventListener('fetch', (e) => {
  const url = new URL(e.request.url);

  // Para páginas HTML y llamadas API: SIEMPRE ir al servidor primero
  if (e.request.mode === 'navigate' || url.pathname.startsWith('/rest/') || url.pathname.startsWith('/auth/')) {
    e.respondWith(
      fetch(e.request).catch(() => caches.match(e.request))
    );
    return;
  }

  // Para assets estáticos: red primero, caché como respaldo
  e.respondWith(
    fetch(e.request)
      .then((response) => {
        // Guardar copia fresca en caché
        const clone = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(e.request, clone));
        return response;
      })
      .catch(() => caches.match(e.request))
  );
});
