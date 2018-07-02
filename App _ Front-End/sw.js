const staticCacheName = 'static-cache-v1',
	dynamicCacheName = 'dynamic-cache-v1',
	offlineContentCacheName = 'offline-content-cache-v1',
	pageSkeleton = 'index.html',
	expectedCaches = [staticCacheName, dynamicCacheName, offlineContentCacheName],
	thingsToCache = [
        '/',
        'index.html',
        'restaurant.html',
        '/dist/css/bundle.min.css',
        '/dist/js/dbhelper.min.js',
        '/dist/js/main.min.js',
        '/dist/js/restaurant_info.min.js',
        '/dist/img/10.webp',
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
      ];

self.addEventListener('install', event => {
	self.skipWaiting();
	event.waitUntil(
		caches.open(staticCacheName)
			.then(cache => cache.addAll(thingsToCache))
			.catch(err => console.error(`ERROR_INSTALLING_SW: ${err}`))
	);
});

self.addEventListener('activate', event => {
	event.waitUntil(
		caches.keys().then(keys => Promise.all(
			keys.map(key => {
				if (!expectedCaches.includes(key)) return caches.delete(key);
			})
		))
	);
});

self.addEventListener('fetch', function(event) {
  if (event.request.url.indexOf('https://maps.googleapi.com/js') > -1) {
		console.log('bypass this for now :(');
	} else {
		event.respondWith(
			caches.match(event.request, { ignoreSearch: true })
				.then(response => {
					if (response) {
						return response;
					}
					let fetchRequest = event.request.clone();
					return fetch(fetchRequest)
						.then(response => {
							if (!response || response.status !== 200 || response.type !== 'basic') {
								return response;
							}
							let responseToCache = response.clone();
							caches.open(dynamicCacheName)
								.then(cache => {
									cache.put(event.request, responseToCache);
								});

							return response;
						});
				})
				.catch(err => console.warn(`ERR_FETCHING_SW_ITEM: ${event.request.url}`))
		);
	}
});
