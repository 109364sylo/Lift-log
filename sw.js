// LIFT LOG Service Worker
// To roll back: comment out the single registration line in index.html
// To force cache refresh: bump this version number
const CACHE_VERSION = ‘liftlog-v1’;
const CACHE_ASSETS = [
‘/Lift-log/’,
‘/Lift-log/index.html’
];

// Install — cache core assets
self.addEventListener(‘install’, e => {
e.waitUntil(
caches.open(CACHE_VERSION)
.then(cache => cache.addAll(CACHE_ASSETS))
.then(() => self.skipWaiting())
);
});

// Activate — delete old caches
self.addEventListener(‘activate’, e => {
e.waitUntil(
caches.keys()
.then(keys => Promise.all(keys.filter(k => k !== CACHE_VERSION).map(k => caches.delete(k))))
.then(() => self.clients.claim())
);
});

// Fetch — NETWORK FIRST
// Always tries the network first so new deployments always get through.
// Only falls back to cache if network fails (offline mode).
self.addEventListener(‘fetch’, e => {
if (e.request.method !== ‘GET’) return;
e.respondWith(
fetch(e.request)
.then(res => {
// Update cache with fresh response
if (res.ok) {
const clone = res.clone();
caches.open(CACHE_VERSION).then(cache => cache.put(e.request, clone));
}
return res;
})
.catch(() => caches.match(e.request))
);
});

// Rest timer notification
self.addEventListener(‘notificationclick’, e => {
e.notification.close();
e.waitUntil(clients.openWindow(’/Lift-log/’));
});
