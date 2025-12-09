// キャッシュの名前（バージョンアップするときはここを変える）
var CACHE_NAME = 'chiyoda-map-v1';
var urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  './icon.png'
];

// インストール時の処理：必要なファイルを保存する
self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// リクエスト時の処理：保存されたファイルがあればそれを使う
self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        // キャッシュにあればそれを返す
        if (response) {
          return response;
        }
        // なければインターネットに取りに行く
        return fetch(event.request);
      })
  );
});