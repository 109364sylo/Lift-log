// LIFT LOG Service Worker v4
// ROLLBACK: comment out the registration line in index.html
// CACHE BUST: bump the version number below
var CACHE = ‘liftlog-v4’;
var ASSETS = [’/Lift-log/’, ‘/Lift-log/index.html’];

self.addEventListener(‘install’, function(e) {
e.waitUntil(
caches.open(CACHE).then(function(cache) {
return cache.addAll(ASSETS);
}).then(function() { return self.skipWaiting(); })
);
});

self.addEventListener(‘activate’, function(e) {
e.waitUntil(
caches.keys().then(function(keys) {
return Promise.all(keys.filter(function(k) { return k !== CACHE; }).map(function(k) { return caches.delete(k); }));
}).then(function() { return self.clients.claim(); })
);
});

self.addEventListener(‘fetch’, function(e) {
if(e.request.method !== ‘GET’) return;
e.respondWith(
fetch(e.request).then(function(res) {
if(res.ok) {
var clone = res.clone();
caches.open(CACHE).then(function(cache) { cache.put(e.request, clone); });
}
return res;
}).catch(function() {
return caches.match(e.request);
})
);
});

self.addEventListener(‘notificationclick’, function(e) {
e.notification.close();
e.waitUntil(clients.openWindow(’/Lift-log/’));
});
