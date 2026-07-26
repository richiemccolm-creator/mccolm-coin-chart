/* Coin Chart — offline shell cache */
var CACHE = "coin-chart-v10";
var ASSETS = [
  "/",
  "/index.html",
  "/app.js",
  "/vendor/react.production.min.js",
  "/vendor/react-dom.production.min.js",
  "/manifest.webmanifest",
  "/img/logo.png",
  "/img/sam.png",
  "/img/isaac.png",
  "/img/ben.png",
  "/img/brush.png",
  "/img/brush-pm.png",
  "/img/bed.png",
  "/img/dressed.png",
  "/img/homework.png",
  "/img/tidy.png",
  "/img/cook.png",
  "/img/club.png",
  "/img/kind.png",
  "/icons/icon-192.png",
  "/icons/icon-512.png",
  "/icons/apple-touch-icon.png"
];

self.addEventListener("install", function (event) {
  event.waitUntil(
    caches.open(CACHE).then(function (cache) {
      return cache.addAll(ASSETS);
    }).then(function () {
      return self.skipWaiting();
    })
  );
});

self.addEventListener("activate", function (event) {
  event.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(
        keys.filter(function (k) { return k !== CACHE; }).map(function (k) {
          return caches.delete(k);
        })
      );
    }).then(function () {
      return self.clients.claim();
    })
  );
});

self.addEventListener("fetch", function (event) {
  if (event.request.method !== "GET") return;
  event.respondWith(
    caches.match(event.request).then(function (cached) {
      var fetched = fetch(event.request)
        .then(function (res) {
          if (res && res.status === 200) {
            var copy = res.clone();
            caches.open(CACHE).then(function (cache) {
              cache.put(event.request, copy);
            });
          }
          return res;
        })
        .catch(function () {
          return cached;
        });
      return cached || fetched;
    })
  );
});
