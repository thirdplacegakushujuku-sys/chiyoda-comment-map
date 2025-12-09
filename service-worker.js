// キャッシュの名前（更新したい時はここの数字を変える: v1 -> v2）
const CACHE_NAME = 'chiyoda-map-v2';
const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  './icon.png'
];

// 1. インストール時：キャッシュの準備
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    })
  );
});

// 2. データ取得時：【重要】ネットワーク優先の戦略
self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // ネットから最新が取れたら、それを返しつつキャッシュも更新する
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response;
        }
        const responseToCache = response.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache);
        });
        return response;
      })
      .catch(() => {
        // ネットに繋がらない（オフライン）時だけキャッシュを使う
        return caches.match(event.request);
      })
  );
});

// 3. 新しいバージョンになったら古いキャッシュを消す
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});