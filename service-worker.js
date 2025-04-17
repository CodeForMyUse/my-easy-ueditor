const cacheName = 'my-pwa-cache-v1';
const staticAssets = [
  './index.html',
  './manifest.json'
];

self.addEventListener('install', async () => {
  const cache = await caches.open(cacheName);
  await cache.addAll(staticAssets);
});

self.addEventListener('fetch', event => {
  const req = event.request;
  const url = new URL(req.url);

  if (url.origin === location.origin) {
    if (url.pathname.endsWith('/index.html') || url.pathname.endsWith('/')) {
      event.respondWith(
        caches.match(req).then(cachedResponse => {
          const networkFetch = fetch(req).then(networkResponse => {
            caches.open(cacheName).then(cache => {
              cache.put(req, networkResponse.clone());
            });
            return networkResponse;
          });
          return cachedResponse || networkFetch;
        })
      );
    } else {
      event.respondWith(cacheFirst(req));
    }
  } else {
    event.respondWith(networkFirst(req));
  }
});

async function cacheFirst(req) {
  const cachedResponse = await caches.match(req);
  return cachedResponse || fetch(req);
}

async function networkFirst(req) {
  const cache = await caches.open('dynamic-cache');
  try {
    const res = await fetch(req);
    await cache.put(req, res.clone());
    return res;
  } catch (error) {
    return await cache.match(req);
  }
}