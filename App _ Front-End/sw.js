self.addEventListener('install', event => {
  event.waitUntil(
    caches.open('mws-restaurant-stage-2').then(cache => {
      return cache.addAll([
        '/',
        '/css/styles.css',
        '/css/responsive.css',
        '/dist/bundle.min.css',
        '/js/dbhelper.js',
        '/js/main.js',
        '/js/restaurant_info.js',
        '/img/1.jpg',
        '/img/2.jpg',
        '/img/3.jpg',
        '/img/4.jpg',
        '/img/5.jpg',
        '/img/6.jpg',
        '/img/7.jpg',
        '/img/8.jpg',
        '/img/9.jpg',
        '/img/10.jpg'
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

self.addEventListener('fetch', function(event) {
  event.respondWith(
    fetch(event.request).then(function(response) {
      if (response.status==404) {
        return new Response("Not Found!!");
      }
      return response;
    }).cache(function() {
    return new Response("That's Totally Failed!");
        })
  );
});
