self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.map((key) => caches.delete(key)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const requestUrl = new URL(event.request.url);

  // Las consultas a Supabase y al resto de orígenes externos no pasan por el
  // service worker de la aplicación.
  if (requestUrl.origin !== self.location.origin) return;

  event.respondWith(fetch(event.request));
});
