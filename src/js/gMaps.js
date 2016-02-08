function gMaps() {
    // this.mapCenter = mapOptions.center;
    this.markers = [];
    this.infoWindow = new google.maps.InfoWindow({
        pixelOffset: new google.maps.Size(-23, -10),
        maxWidth: 300
    });
    this.marker_animation = google.maps.Animation.DROP;
    this.map = map;
};

/*
    pinPoster(locations) takes in the array of locations created by locationFinder()
    and fires off Google place searches for each location
*/
gMaps.prototype.pinLocations = function(locations) {
    var service = new google.maps.places.PlacesService(this.map);
    locations.forEach(function(place) {
        console.log(place);
        var request = {
            query: place.name
        };
        // Actually searches the Google Maps API for location data and runs the callback
        // function with the search results after each search.
        service.textSearch(request, this.searchResults);
    });
};

/*
    callback(results, status) makes sure the search returned results for a location.
    If so, it creates a new map marker for that location.
*/
gMaps.prototype.searchResults = function(results, status) {
    if (status == google.maps.places.PlacesServiceStatus.OK) {
        var place = results[0];
        var location = place.geometry.location;
        var address = place.formatted_address;
        console.log(address, location);
        this.createLocMarker(place);
    };
};

/* create a marker for a location */
gMaps.prototype.createLocMarker= function(place) {
    var name = place.formatted_address;
    var bounds = window.mapBounds; // current boundaries of the map window
    var marker = new google.maps.Marker({
        map: this.map,
        position: place.geometry.location,
        title: name
    });
}

/* create a marker for a location */
gMaps.prototype.markLocation = function() {
    var name = this.name();
    var position = new google.maps.LatLng(this.mapcenter().lat, this.mapcenter().lng);
    var bounds = window.mapBounds; // current boundaries of the map window
    var marker = new google.maps.Marker({
        map: map,
        position: position,
        title: name
    });
    this.marker = marker;
}

// center the map around a location
gMaps.prototype.setCenter = function() {
    // console.log(this.name());
    map.setCenter(new google.maps.LatLng(this.mapcenter().lat, this.mapcenter().lng));
    map.setZoom(13);
};


/**
 * The method  nearbySearch call google maps places API and search pagination request
 *  based on the Latitude and longitude of the position
 *
 */
gMaps.prototype.nearbySearch = function() {
    var self = this.self;
    console.log("nearby search",self.myCategories());
    var service = new google.maps.places.PlacesService(this.map);
    service.nearbySearch({
        location: this.mapcenter(),
        radius: radius,
        types: self.myCategories()
    }, this.getResults.bind(this));
};

/**
    get the places with types != "politcal"
*/
gMaps.prototype.getResults = function(results, status, pagination) {

    var bounds = new google.maps.LatLngBounds();
    var self = this.self;
    function isPolitical(value) {
        return value == "political";
    }
    var nearByPlaces=[];
    if (status == google.maps.places.PlacesServiceStatus.OK) {

        results.forEach(function(place) {
            if (place.types.filter(isPolitical).length == 0) {
                nearByPlaces.push(place);
                bounds.extend(place.geometry.location);
            }
        });

        map.fitBounds(bounds);
        this.nearByPlaces(nearByPlaces);
        console.log("Results OK:", results.length," for location:",this.name(),"with categorie:",myCategories, "Nearby Places:",this.nearByPlaces());
        this.createMarkers(this.nearByPlaces());
        console.log(this.nearByPlaces(),this.markers);
    };
    /* set the location to the first  selected entry of the myLocations array
     * instead of location.setCenter();
    */
    self.setCenter() ;
    self.numberPlaces(self.numberPlaces() + nearByPlaces.length);
    // console.log("results",self.numberPlaces());
};

/**
 * Google maps places API autocomplete service.
 */
gMaps.prototype.initAutocomplete = function() {
    // var Map = this;
    var map = this.map;
    var self = this.self;
    // Create the search box and link it to the input UI element.
    var searchInput = document.getElementById('search-input');
    var searchBox = new google.maps.places.SearchBox(searchInput);
    //  map.controls[google.maps.ControlPosition.TOP_LEFT].push(searchInput);
    //  Bias the SearchBox results towards current map's viewport.
    map.addListener('bounds_changed', function() {
        searchBox.setBounds(map.getBounds());
        mapCenter = map.getCenter();
    });

    /*
     * Search for new place is handled by the modelview getPlaces function
     * However, if the searck keyword startwith ":", the modelview getPlaces function just exit, the boxsearch is used to
     * for a new location
     *
     * boysearch: only search for a new location is valid, as for instance
     *
     *  :Newyork Central Square
     *  :London Picadilly Circus
     *
     *  Other type of searches are ignored
     */
    function boxSearch() {
        var searchedPlaces = [];
        // var map = this.map;
        var self = this.self;
        if (searchInput.value.substring(0, 1) == ":") {
            searchInput.value = searchInput.value.slice(1);
            searchedPlaces = searchBox.getPlaces();
        }
        var places = searchedPlaces.length;
        if (places == 1) {
            var place = searchedPlaces[0]; // take the first result
            this.mapCenter = place.geometry.location;
            // myLocations = []; // reset the hard coded location array
            // create a new location based on information returned by searchBox.getPlaces()
            var location = {};
            location.name = searchInput.value,
            location.city = searchInput.value,
            location.mapcenter = {
                lat: place.geometry.location.lat(),
                lng: place.geometry.location.lng(),
            };
            location.selected = true;
            // set a new location and search places for nearby this location
            self.addLocation(location);
        };
        searchInput.value = "";
    };

    searchBox.addListener('places_changed', boxSearch.bind(this));
};


/* Remove markers for a location
    this.markers is an array of marker for "this location"
 */

gMaps.prototype.removeMarkers = function() {
    this.markers.forEach(function(marker) {
        marker.setMap(null);
    });
};

/*
 * Set markers to the map. @param {Object[]} places of a Location - returned by the google API search.
 *
 *  I add a Google map marker of its place for every place of  nearby places array.
 *  It will be used to trigger the marker and open the infoWindow  when a user click a place of the List view
 *  This is faster but it
 *
 *  places = nearby places of a specific location returned by Google Maps nearby search
 *
 *  this.markers are an array of markers for the "this" location. There are duplicated since  place alreay
 *  contain its marker.  I keep them in a array for better efficiency
 *
 *
 */

gMaps.prototype.createMarkers = function(places) {
    var iconSize = Math.sqrt($(window).width()) + 20;

    // Clear out the old markers for this location
    this.removeMarkers();
    this.markers = [];

    // For each place, get the icon, name and location.
    places.forEach(function(place) {

        var icon = {
            url: place.icon,
            size: new google.maps.Size(iconSize, iconSize),
            origin: new google.maps.Point(0, 0),
            anchor: new google.maps.Point(iconSize / 4, iconSize / 2),
            scaledSize: new google.maps.Size(iconSize / 2.8, iconSize / 2.8)
        };

        // Create a marker for each place.
        var marker = new google.maps.Marker({
                map: map,
                icon: icon,
                title: place.name,
                animation: this.marker_animation,
                position: place.geometry.location
            }),

            width = window.innerWidth,
            height = window.innerHeight,
            offsetX = 150,
            offsetY = -height / 5;

        if (width < 800) {
            offsetX = -30;
            offsetY = -1 * (height / 2 + 50);
        }

        /* define the click function for the marker*/
        marker.addListener('click', function() {
            this.markers.forEach(function(marker) {
                marker.setAnimation(null);
            });

            if (marker.getAnimation() !== null) {
                marker.setAnimation(null);
            } else {
                marker.setAnimation(google.maps.Animation.BOUNCE);
                map.panTo(marker.position);
                map.panBy(offsetX, offsetY);
            }
        }.bind(this));

        /* add  thenew  marker to  the markers array of the location*/
        this.markers.push(marker);

        /*add the new  maker to the current place. it will be used to open the infowindow when user click
         * the list view
         */
        place.marker = marker;

        /* set the google maps listeneer for the click event for that marker */

        google.maps.event.addListener(marker, 'click', function() {
            this.addInfoWindow(place, marker);
        }.bind(this));


    }.bind(this));
};


/*
 * Get details about place corresponded to the clicked marker and build the infoWindow.
 */

gMaps.prototype.addInfoWindow = function(place, marker) {

    var service = new google.maps.places.PlacesService(this.map);
    var Map = this;
    var self = this.self;
    var infoWindow = this.infoWindow;
    var $winWidth = $(window).width();
    // hide the location and categories list no matter their state
    self.showCategory(false);
    self.showLocation(false);
    service.getDetails({
        placeId: place.place_id
    }, function(place, status) {

        if (status === google.maps.places.PlacesServiceStatus.OK) {
            var reviewsTemplate;
            if ($winWidth < 800) {
                self.showResults(false);
                reviewsTemplate = $('script[data-template="review-short"]').html();
            } else {
                reviewsTemplate = $('script[data-template="reviews"]').html();
                reviewsTemplate = reviewsTemplate.replace(/{{opening}}/, Map.getOpenings(place));
            }

            /* set infoWinoow content */
            var website = Map.getWebsite(place);
            var rev = reviewsTemplate.replace(/{{name}}/, place.name).replace(/{{formatted_address}}/, place.formatted_address).replace(/{{rating}}/, Map.getRating(place)).replace(/{{photos}}/, Map.getPhotoes(place));
            infoWindow.setContent(rev.replace(/{{website}}/g, website).replace(/{{phone}}/, Map.getPhone(place)));
            infoWindow.open(Map.map, marker);
            $('.infoWindow').fadeIn(200);

            /*
               Open the photo-page  dom when photo link is clicked
            */
            if (place.photos) {
                var numberPhotos = place.photos.length;

                $('#photos').click(function() {
                    self.placePhotos(place.photos);
                    self.currentIndex(0);
                    self.currentPhoto(self.placePhotos()[0]);
                });

            };

            /*
               Open the reviews page when reviews is clicked
            */
            var $reviews = $('#reviews');
            if ($reviews) {
                $reviews.click(function() {
                    self.placeInFocus(place);
                    place.reviews.forEach(function(review) {
                        if (review.text !== "") {
                            self.placeReviews.push(review);
                        }
                    });
                });
            };

            /*
              Open the nyt article when the nyt link is clicked
            */
            var $nytlink = $('#nytLink');
            if ($nytlink) {
                $nytlink.click(function() {
                    self.getNytArticle(place);
                });
            }; /* end nyt */


            /*
              Open the wikit article when the nyt link is clicked
            */
            var $wikilink = $('#wikiLink');
            if ($wikilink) {
                $wikilink.click(function() {
                    self.openSearchWikipedia(place);
                });
            };

            /*
              Open the street view page when it is clicked
            */

            var $streetLink = $('#streetLink');
            if ($streetLink) {
                $streetLink.click(function() {
                    self.getStreetView(place);
                });
            };
        }
    });

    google.maps.event.addListener(infoWindow, 'closeclick', function() {
        Map.markers.forEach(function(marker) {
            marker.setAnimation(null);
        }.bind(this));
    });
};


gMaps.prototype.getWebsite = function(place) {

    if (place.website) {
        return place.website;
    } else {
        return "";
    }
};

/**
 * Get rating from place object and dinamically chain together the rating tag
 *    add rating stars and reviews link.
 */
gMaps.prototype.getRating = function(place) {

    var self = this.self;
    var ratingTag = "";
    var starHolder = self.rateStar(place.rating);
    if (place.rating) {
        ratingTag = '<div><span style="color: #df6d15; padding-right: 3px;">' + place.rating + '</span>';
        for (var i in starHolder) {
            if (i) {
                ratingTag += '<img class="rate-star" src="' + starHolder[i].star + '" />';
            }
        }
        ratingTag += '<span class="rating"> Users rating:' + place.user_ratings_total + '</span>';
        return ratingTag + '<a id="reviews"  href="#"">Reviews,</a>';
    } else {
        return '<span style="font-style: italic;">no rating available</span>';
    }
};

/**
 * Get phone number from place object.
 */
gMaps.prototype.getPhone = function(place) {
    if (place.international_phone_number) {
        return place.international_phone_number;
    } else {
        return '<span>Location:' + place.geometry.location + '</span>';
    }
};


/*
 * Get photo urls from place object
 */
gMaps.prototype.getPhotoes = function(place) {

    if (place.photos) {
        if (place.photos.length > 1) {
            return '<a style="margin-left: 5px;" id="photos" href="#"">Photos</a>';
        }
    }
    return '<div id="photos"></div></div>';
};

/*
 * Get opening hours  from place object
 */
gMaps.prototype.getOpenings = function(place) {
    var opening;
    try {
        opening = "Mon-Sat:" + place.opening_hours.periods[1].open.time + "-" + place.opening_hours.periods[1].close.time + " " +
            "Sun:" + place.opening_hours.periods[0].open.time + "-" + place.opening_hours.periods[0].close.time;
    } catch (e) {
        opening = 'Work time not available';
    };
    return opening;
};

/*   Model */

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
    winWidth = $(window).width(),
    myCategories = [],
    radius = 2000,
    today = new Date();

var Lindex = 0;
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
    selected: true
}, {
    name: "Place de la Nation",
    city: "Paris France",
    mapcenter: {
        lat: 48.847895,
        lng: 2.395984
    },
    selected: true
}, {
    name: "Porte de la Chapelle",
    city: "Paris France",
    mapcenter: {
        lat: 48.896748,
        lng: 2.363993
    },
    selected: true
}]

/*
   reuse previous filters stored in local Storage
*/

function inherit(subClass, superClass) {
    subClass.prototype = Object.create(superClass.prototype); // delegate to prototype
    subClass.prototype.Constructor = subClass; // update constructor on prototype
}

