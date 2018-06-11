let staticCacheName = 'restaurant-static-v6';

self.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open(staticCacheName).then(function (cache) {
      return cache.addAll([
        '/',
        '/data/restaurants.json',
        'js/main.js',
        'js/restaurant_info.js',
        'js/dbhelper.js',
        'css/styles.css',
        'img/1.jpg',
        'img/2.jpg',
        'img/3.jpg',
        'img/4.jpg',
        'img/5.jpg',
        'img/6.jpg',
        'img/7.jpg',
        'img/8.jpg',
        'img/9.jpg',
        'img/10.jpg',
      ]);
    })
  );
});

// Code based on the wittr code (https://github.com/jakearchibald/wittr) by Jake Archibald

self.addEventListener('activate', function (event) {
  event.waitUntil(
    caches.keys().then(function (staticCacheNames) {
      return Promise.all(
        staticCacheNames.filter(function (cacheName) {
          return cacheName.startsWith('restaurant-') &&
            cacheName != staticCacheName;
        }).map(function (cacheName) {
          return caches.delete(cacheName);
        })
      );
    })
  );
});

// Code based on example from MDN (https://developer.mozilla.org/en-US/docs/Web/API/Cache/put)

self.addEventListener('fetch', function (event) {
  event.respondWith(
    caches.match(event.request)
    .then(function (response) {
      return response || fetch(event.request).then(function (response) {
        return caches.open(staticCacheName)
        .then(function (cache) {
          cache.put(event.request.url, response.clone());
          return response;
          })
      }).catch(function (err) {
        console.log(err);
        return caches.open(staticCacheName)
          .then(function (cache) {
            return cache.match('index.html');
          });
      });
    })
  );
})