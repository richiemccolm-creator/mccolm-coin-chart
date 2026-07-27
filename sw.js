/* Coin Chart — offline shell cache */
var CACHE = "coin-chart-v13";
var ASSETS = [
  "/",
  "/index.html",
  "/app.js",
  "/config.js",
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
  var req = event.request;
  if (req.method !== "GET") return;

  // Network-first for shell/script so deploys show up on installed PWAs
  var url = new URL(req.url);
  var networkFirst =
    url.pathname === "/" ||
    url.pathname === "/index.html" ||
    url.pathname === "/config.js" ||
    url.pathname === "/app.js" ||
    url.pathname === "/sw.js" ||
    req.mode === "navigate";

  if (networkFirst) {
    event.respondWith(
      fetch(req).then(function (res) {
        var copy = res.clone();
        caches.open(CACHE).then(function (cache) { cache.put(req, copy); });
        return res;
      }).catch(function () {
        return caches.match(req).then(function (cached) {
          return cached || caches.match("/index.html");
        });
      })
    );
    return;
  }

  event.respondWith(
    caches.match(req).then(function (cached) {
      return cached || fetch(req).then(function (res) {
        var copy = res.clone();
        caches.open(CACHE).then(function (cache) { cache.put(req, copy); });
        return res;
      });
    })
  );
});
