let restaurants,
    neighborhoods,
    cuisines
var map
var markers = []

/**
 * Set neighborhoods HTML.
 */
fillNeighborhoodsHTML = (neighborhoods) => {
    self.neighborhoods = neighborhoods;
    const select = document.getElementById('neighborhoods-select');
    neighborhoods.forEach(neighborhood => {
        const option = document.createElement('option');
        option.innerHTML = neighborhood;
        option.value = neighborhood;
        select.append(option);
    });
}

/**
 * Set cuisines HTML.
 */
fillCuisinesHTML = (cuisines) => {
    self.cuisines = cuisines;
    const select = document.getElementById('cuisines-select');

    cuisines.forEach(cuisine => {
        const option = document.createElement('option');
        option.innerHTML = cuisine;
        option.value = cuisine;
        select.append(option);
    });
}

/**
 * Initialize Google map, called from HTML.
 */
window.initMap = () => {
    let loc = {
        lat: 40.722216,
        lng: -73.987501
    };
    const map = document.getElementById('map');
    self.map = new google.maps.Map(map, {
        zoom: 12,
        center: loc,
        scrollwheel: false,
        title: 'Google Maps'
    });
    updateRestaurants();
};

/**
 * Update page and map for current restaurants.
 */
updateRestaurants = () => {
    const cSelect = document.getElementById('cuisines-select');
    const nSelect = document.getElementById('neighborhoods-select');

    const cIndex = cSelect.selectedIndex;
    const nIndex = nSelect.selectedIndex;

    const cuisine = cSelect[cIndex].value;
    const neighborhood = nSelect[nIndex].value;

    DBHelper.fetchRestaurantByCuisineAndNeighborhood(neighborhood, cuisine)
        .then(restaurants => {
            resetRestaurants(restaurants);
        })
        .then(() => fillRestaurantsHTML());
}

/**
 * Clear current restaurants, their HTML and remove their map markers.
 */
resetRestaurants = (restaurants) => {
    // Remove all restaurants
    self.restaurants = [];
    const ul = document.getElementById('restaurants-list');
    ul.innerHTML = '';

    // Remove all map markers
    self.markers.forEach(m => m.setMap(null));
    self.markers = [];
    self.restaurants = restaurants;
}

/**
 * Create all restaurants HTML and add them to the webpage.
 */
fillRestaurantsHTML = (restaurants = self.restaurants) => {
    const ul = document.getElementById('restaurants-list');
    restaurants.forEach(restaurant => {
        ul.append(createRestaurantHTML(restaurant));
    });
    DBHelper.lazyLoad();
    if (navigator.onLine) {
          addMarkersToMap();
    }
}

/**
 * Create restaurant HTML.
 */
createRestaurantHTML = (restaurant) => {
    const li = document.createElement('li');

    const image = document.createElement('img');
    image.className = 'restaurant-img';
    image.href = DBHelper.urlForRestaurant(restaurant);
    image.alt = `${restaurant.name} - ${restaurant.cuisine_type} cuisine in the ${restaurant.neighborhood} Neighbourhood`;
    image.src = DBHelper.imageUrlForRestaurant(restaurant);
    li.append(image);

    const name = document.createElement('h2');
    name.innerHTML = restaurant.name;
    li.append(name);

    const favoriteIcon = document.createElement('span');
favoriteIcon.className = 'restaurant-fav';

const favoriteIconImg = document.createElement('img');
if (restaurant.is_favorite === "true") {
  favoriteIconImg.alt = 'Restaurant Favorited ' + restaurant.name;
  favoriteIconImg.setAttribute("data-src", './dist/img/ico-fav.png');
  favoriteIconImg.className = 'restaurant-fav-icon fav';
} else {
  favoriteIconImg.setAttribute("data-src", './dist/img/ico-fav-o.png');
  favoriteIconImg.className = 'restaurant-fav-icon fav-not';
  // favoriteIconImg.alt = 'Restaurant Not Favorited ' + restaurant.name;
}

favoriteIconImg.addEventListener('click', () => {
  const src = favoriteIconImg.src;
  if (src.includes('dist/img/ico-fav-o.png')) {
    DBHelper.addRestaurantToFavorites(restaurant.id, true, (err, res) => {
      favoriteIconImg.src = './dist/img/ico-fav.png';
    });
  } else {
    DBHelper.addRestaurantToFavorites(restaurant.id, false, (err, res) => {
      favoriteIconImg.src = './dist/img/ico-fav-o.png';
    });
  }
})

favoriteIcon.append(favoriteIconImg);
name.prepend(favoriteIcon);


    const neighborhood = document.createElement('p');
    neighborhood.innerHTML = restaurant.neighborhood;
    li.append(neighborhood);

    const address = document.createElement('p');
    address.innerHTML = restaurant.address;
    li.append(address);

    const buttonsDiv = document.createElement('div');
    buttonsDiv.className = 'buttons-div';

    const more = document.createElement('a');
    more.innerHTML = 'View Details';
    more.href = DBHelper.urlForRestaurant(restaurant);
    more.setAttribute('aria-label', 'View Details for ' + restaurant.name + ' Restaurant');
    buttonsDiv.append(more);

    li.append(buttonsDiv);

    return li;
}

/**
 * Add markers for current restaurants to the map.
 */
addMarkersToMap = (restaurants = self.restaurants) => {
    restaurants.forEach(restaurant => {
        // Add marker to the map
        const marker = DBHelper.mapMarkerForRestaurant(restaurant, self.map);
        google.maps.event.addListener(marker, 'click', () => {
            window.location.href = marker.url
        });
        self.markers.push(marker);
    });
}

/**
 * Fetch neighborhoods and cuisines as soon as the page is loaded.
 */
document.addEventListener('DOMContentLoaded', (event) => {
    if (navigator.serviceWorker) {
        navigator.serviceWorker.register('sw.js')
            .then(reg => console.log(`Registeration Worked With Scope: ${reg.scope}`))
            .catch(err => console.error(`ERROR_REGISTERING_SW: ${err}`));
    }
    DBHelper.fetchNeighborhoods()
        .then(neighborhoods => fillNeighborhoodsHTML(neighborhoods));

    DBHelper.fetchCuisines()
        .then(cuisines => fillCuisinesHTML(cuisines));

    //google maps fetching screwing me up have to updateRestaurant manually here
    if (!navigator.onLine) {
        updateRestaurants();
    }
});

/**
 * on load event
 */
window.addEventListener('load', (event) => {

    connectionStatusHandler = (event) => {
        const statusBox = document.getElementById('offline-status-box');
        if (!navigator.onLine) {
            statusBox.style.display = 'block';
            document.getElementById('offline-status').innerHTML = 'you are offline!! Some data might not be latest.';
        } else {
            statusBox.style.display = 'none';
            document.getElementById('offline-status').innerHTML = 'Online :)';
        }
    }

    window.addEventListener('online', connectionStatusHandler);
    window.addEventListener('offline', connectionStatusHandler);
});
