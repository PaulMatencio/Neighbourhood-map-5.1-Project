
/*
   https://developers.google.com/places/supported_types
   List of supported values for the types property in the Google Places API
*/
var mapPlaceTypes = [
        "accounting",
        "airport",
        "amusement_park",
        "aquarium",
        "art_gallery",
        "atm",
        "bakery",
        "bank",
        "bar",
        "beauty_salon",
        "bicycle_store",
        "book_store",
        "bowling_alley",
        "bus_station",
        "cafe",
        "campground",
        "car_dealer",
        "car_rental",
        "car_repair",
        "car_wash",
        "casino",
        "cemetery",
        "church",
        "city_hall",
        "clothing_store",
        "convenience_store",
        "courthouse",
        "dentist",
        "department_store",
        "doctor",
        "electrician",
        "electronics_store",
        "embassy",
        "establishment",
        "finance",
        "fire_station",
        "florist",
        "food",
        "funeral_home",
        "furniture_store",
        "gas_station",
        "general_contractor",
        "grocery_or_supermarket",
        "gym",
        "hair_care",
        "hardware_store",
        "health",
        "hindu_temple",
        "home_goods_store",
        "hospital",
        "insurance_agency",
        "jewelry_store",
        "laundry",
        "lawyer",
        "library",
        "liquor_store",
        "local_government_office",
        "locksmith",
        "lodging",
        "meal_delivery",
        "meal_takeaway",
        "mosque",
        "movie_rental",
        "movie_theater",
        "moving_company",
        "museum",
        "night_club",
        "painter",
        "park",
        "parking",
        "pet_store",
        "pharmacy",
        "physiotherapist",
        "place_of_worship",
        "plumber",
        "police",
        "post_office",
        "real_estate_agency",
        "restaurant",
        "roofing_contractor",
        "rv_park",
        "school",
        "shoe_store",
        "shopping_mall",
        "spa",
        "stadium",
        "storage",
        "store",
        "subway_station",
        "synagogue",
        "taxi_stand",
        "train_station",
        "travel_agency",
        "university",
        "veterinary_care",
        "zoo"
    ],
    /*
       https://developers.google.com/maps/documentation/javascript/styling#styling_the_default_map
    */
    mapStyle = [{
        "featureType": "road.local",
        "elementType": "labels",
        "stylers": [{
            "hue": "#00a1ff"
        }, {
            "gamma": 0.8
        }]
    }, {
        "featureType": "road.highway",
        "stylers": [{
            "lightness": 12
        }, {
            "gamma": 1.31
        }, {
            "hue": "#ffa200"
        }]
    }, {
        "featureType": "landscape.natural"
    }],

    mapCenter = {},
    myCategories = [],
    radius = 2000,
    today = new Date();

var winWidth =  window.innerWidth;

var Lindex = 0;

/* default locations array which is used for the first time
* they  will be updated and saved in local storage
* sub sequence use of the applications, the locastorage copy will be used.
* to reuse this copy, you should clear the localstorage copy
* localstorage.myLocations.clear()
*/
var myLocations = [{

    name: "Notre Dame de Paris",
    city: "Paris France",
    mapcenter: {
        lat: 48.852729,
        lng: 2.350564
    },
    selected: true
}, {
    name: "Eiffel Tower",
    city: "Paris France",
    mapcenter: {
        lat: 48.858261,
        lng: 2.294507
    },
    selected: false
}, {
    name: "Porte d'Italie",
    city: "Paris France",
    mapcenter: {
        lat: 48.819067,
        lng: 2.360230
    },
    selected: false
}, {
    name: "Place de la Nation",
    city: "Paris France",
    mapcenter: {
        lat: 48.847895,
        lng: 2.395984
    },
    selected: false
}, {
    name: "Porte de la Chapelle",
    city: "Paris France",
    mapcenter: {
        lat: 48.896748,
        lng: 2.363993
    },
    selected: false
}]


function inherit(subClass, superClass) {
    subClass.prototype = Object.create(superClass.prototype); // delegate to prototype
    subClass.prototype.Constructor = subClass; // update constructor on prototype
}