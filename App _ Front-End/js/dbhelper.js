/**
 * Common database helper functions.
 */
class DBHelper {

  /**
   * Database URL.
   * Change this to restaurants.json file location on your server.
   */
  static get DATABASE_URL() {
    const port = 1337 // Change this to your server port
    return `http://localhost:${port}/restaurants`;
  }

  static createIDBStore(restaurants) {
    // Get compatible indexeddb
    var indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB || window.shimIndexedDB;

    // Create the database
    var open = indexedDB.open("RestaurantDB", 1);

    // Create the schema
    open.onupgradeneeded = function() {
      var db = open.result;
      var store = db.createObjectStore("RestaurantStore", { keyPath: "id" });
      var index = store.createIndex("by-id", "id");
    };

    open.onerror = function(err) {
      console.error("Something wrong with IndexDB: " + err.target.errorCode);
    }

    open.onsuccess = function() {
      // Start new transaction
      var db = open.result;
      var tx = db.transaction("RestaurantStore", "readwrite");
      var store = tx.objectStore("RestaurantStore");
      var index = store.index("by-id");

      // Add restaurant data
      restaurants.forEach(function(restaurant) {
        store.put(restaurant);
      });

      // Close the database when transaction is done
      tx.oncomplete = function() {
        db.close();
      };
    }
  }

  static getCachedData(callback) {
    var restaurants = [];

    // Get compatible indexeddb
    var indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB || window.shimIndexedDB;
    var open = indexedDB.open("RestaurantDB", 1);

    open.onsuccess = function() {
      // Start new transaction
      var db = open.result;
      var tx = db.transaction("RestaurantStore", "readwrite");
      var store = tx.objectStore("RestaurantStore");
      var getData = store.getAll();

      getData.onsuccess = function() {
        callback(null, getData.result);
      }

      // Close the database when transaction is done
      tx.oncomplete = function() {
        db.close();
      };
    }
  }

  /**
   * Fetch all restaurants.
   */
   static fetchRestaurants(callback) {
     if (navigator.onLine) {
       let xhr = new XMLHttpRequest();
       xhr.open('GET', DBHelper.DATABASE_URL);
       xhr.onload = () => {
         if (xhr.status === 200) { //if a success response from server!!
           const restaurants = JSON.parse(xhr.responseText);
           DBHelper.createIDBStore(restaurants); // cache restaurants..
           callback(null, restaurants);
         } else {  // if an error shows from server!!
           const error = (`REQUEST FAILED!!! Returned status of ${xhr.status}`);
           callback(error, null);
         }
       };
       xhr.send();
     } else {
       console.log('Offline using Cached data!');
       DBHelper.getCachedData((error, restaurants) => {
         if (restaurants.length > 0) {
           console.log('Unable to fetch data from server!!!');
           callback(null, restaurants);
         }
       });
     }
   }

  /**
   * Fetch a restaurant by its ID.
   */
  static fetchRestaurantById(id, callback) {
    // fetch all restaurants with proper error handling.
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        const restaurant = restaurants.find(r => r.id == id);
        if (restaurant) { // Got the restaurant
          callback(null, restaurant);
        } else { // Restaurant does not exist in the database
          callback('Restaurant does not exist', null);
        }
      }
    });
  }

  /**
   * Fetch restaurants by a cuisine type with proper error handling.
   */
  static fetchRestaurantByCuisine(cuisine, callback) {
    // Fetch all restaurants  with proper error handling
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        // Filter restaurants to have only given cuisine type
        const results = restaurants.filter(r => r.cuisine_type == cuisine);
        callback(null, results);
      }
    });
  }

  /**
   * Fetch restaurants by a neighborhood with proper error handling.
   */
  static fetchRestaurantByNeighborhood(neighborhood, callback) {
    // Fetch all restaurants
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        // Filter restaurants to have only given neighborhood
        const results = restaurants.filter(r => r.neighborhood == neighborhood);
        callback(null, results);
      }
    });
  }

  /**
   * Fetch restaurants by a cuisine and a neighborhood with proper error handling.
   */
  static fetchRestaurantByCuisineAndNeighborhood(cuisine, neighborhood, callback) {
    // Fetch all restaurants
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        let results = restaurants
        if (cuisine != 'all') { // filter by cuisine
          results = results.filter(r => r.cuisine_type == cuisine);
        }
        if (neighborhood != 'all') { // filter by neighborhood
          results = results.filter(r => r.neighborhood == neighborhood);
        }
        callback(null, results);
      }
    });
  }

  /**
   * Fetch all neighborhoods with proper error handling.
   */
  static fetchNeighborhoods(callback) {
    // Fetch all restaurants
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        // Get all neighborhoods from all restaurants
        const neighborhoods = restaurants.map((v, i) => restaurants[i].neighborhood)
        // Remove duplicates from neighborhoods
        const uniqueNeighborhoods = neighborhoods.filter((v, i) => neighborhoods.indexOf(v) == i)
        callback(null, uniqueNeighborhoods);
      }
    });
  }

  /**
   * Fetch all cuisines with proper error handling.
   */
  static fetchCuisines(callback) {
    // Fetch all restaurants
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        // Get all cuisines from all restaurants
        const cuisines = restaurants.map((v, i) => restaurants[i].cuisine_type)
        // Remove duplicates from cuisines
        const uniqueCuisines = cuisines.filter((v, i) => cuisines.indexOf(v) == i)
        callback(null, uniqueCuisines);
      }
    });
  }

  /**
   * Restaurant page URL.
   */
  static urlForRestaurant(restaurant) {
    return (`./restaurant.html?id=${restaurant.id}`);
  }

  /**
   * Restaurant image URL.
   */
  static imageUrlForRestaurant(restaurant) {
    return (`/img/${restaurant.photograph}.jpg`);
  }

  /**
   * Map marker for a restaurant.
   */
  static mapMarkerForRestaurant(restaurant, map) {
    const marker = new google.maps.Marker({
      position: restaurant.latlng,
      title: restaurant.name,
      url: DBHelper.urlForRestaurant(restaurant),
      map: map,
      animation: google.maps.Animation.DROP}
    );
    return marker;
  }

}

// Register Service Worker for Offline Availability.
registerServiceWorker = () => {
  if (navigator.serviceWorker) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('sw.js')
  .then(registration => console.log('Registeration Worked With Scope: ', registration.scope))
  .catch(err => console.log('REGISTERATION FAILED: ', err));
})
}
}
