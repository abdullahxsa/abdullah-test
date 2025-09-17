const CACHE = "uber-calc-v2";
const ASSETS = ["./","./index.html","./app.js","./manifest.webmanifest","./icons/icon-192.png","./icons/icon-512.png"];
self.addEventListener("install", e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS))); });
self.addEventListener("activate", e => { e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k))))); });
self.addEventListener("fetch", e => {
  if (e.request.mode === "navigate" || e.request.destination === "document") {
    e.respondWith(fetch(e.request).catch(()=>caches.match("./index.html")));
  } else {
    e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request)));
  }
});
