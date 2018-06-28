self.addEventListener('install', event => {
  event.waitUntil(
    caches.open('mws-restaurant-stage-2').then(cache => {
      return cache.addAll([
        '/',
        '/dist/css/bundle.min.css',
        '/dist/js/dbhelper.min.js',
        '/dist/js/main.min.js',
        '/dist/js/restaurant_info.min.js',
        '/dist/img/10.jpg',
        '/dist/img/1.webp',
        '/dist/img/2.webp',
        '/dist/img/3.webp',
        '/dist/img/4.webp',
        '/dist/img/5.webp',
        '/dist/img/6.webp',
        '/dist/img/7.webp',
        '/dist/img/8.webp',
        '/dist/img/9.webp',
        '/dist/img/10.webp',
        '/dist/img/ico-fav-o.png',
        '/dist/img/ico-fav.png'
      ]);
    })
  )
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request).then(function(response) {
      return response || fetch(event.request);
    })
  );
});
