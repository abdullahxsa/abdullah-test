const BASE="/abdullah-test/";
const CACHE="uber-calc-v1";
const ASSETS=[BASE,BASE+"index.html",BASE+"manifest.webmanifest",BASE+"sw.js",BASE+"icons/icon-192.png",BASE+"icons/icon-512.png"];

self.addEventListener("install",e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)));self.skipWaiting()});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(keys=>Promise.all(keys.map(k=>k!==CACHE&&caches.delete(k)))));self.clients.claim()});
self.addEventListener("fetch",e=>{e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request)))});
