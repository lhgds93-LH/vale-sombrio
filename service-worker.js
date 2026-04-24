const CACHE_NAME = "vale-sombrio-pwa-v7";
const ASSETS = [
  "./",
  "./index.html",
  "./manifest.json",
  "./locadora-neon-cinematica.webp",
  "./mapa-vale-sombrio.webp",
  "./obj-vhs.webp",
  "./obj-poster.webp",
  "./obj-arcade.webp",
  "./obj-telefone.webp",
  "./obj-cofre.webp",
  "./tec-radio.webp",
  "./tec-terminal.webp",
  "./tec-quadro.webp",
  "./tecnico-bunker.webp",
  "./icon-192.png",
  "./icon-512.png"
];

self.addEventListener("install", event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))))
  );
  self.clients.claim();
});

self.addEventListener("fetch", event => {
  if (event.request.method !== "GET") return;
  event.respondWith(
    caches.match(event.request).then(cached => cached || fetch(event.request).then(response => {
      const copy = response.clone();
      caches.open(CACHE_NAME).then(cache => cache.put(event.request, copy));
      return response;
    }).catch(() => caches.match("./index.html")))
  );
});