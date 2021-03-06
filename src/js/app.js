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
        "fire_station",
        "florist",
        "funeral_home",
        "furniture_store",
        "gas_station",
        "grocery_or_supermarket",
        "gym",
        "hair_care",
        "hardware_store",
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
    mapCenter = {},
    myCategories = [],
    myCategory = "";
    unit = 500;
    radius = unit;

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
    selected: true
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
    selected: false
}, {
    name: "Porte de la Chapelle",
    city: "Paris France",
    mapcenter: {
        lat: 48.896748,
        lng: 2.363993
    },
    selected: false
}, {
    name: "Porte de Versailles",
    city: "Paris France",
    mapcenter: {
        lat: 48.832568,
        lng: 2.287193
    },
    selected: false
}];

var delimiter = " ";

/* Function to define javascript subclass */
function inherit(subClass, superClass) {
    subClass.prototype = Object.create(superClass.prototype); // delegate to prototype
    subClass.prototype.Constructor = subClass; // update constructor on prototype
}

/*

* function to remove the display: none of an element
* the <HTML> script contains two DOM elements ( options and markers). They are created to hide other
* DOM element util KO is initialized. The display:none are moved once Ko is initialized
*/

/*
 *    Google Maps Location class
 *
 *   The application will create a Location object per location
 *
 *   gMaps() (contructor)
 *   setCenter()
 *   nearbySearch()
 *   getResults()
 *   initAutocomplete()
 *   boxSearch()
 *   removeMarkers()
 *   createMarkers()
 *   addInfoWindow()
 *   pinLocations ( not actually used)
 *   searchResults (not actually used)
 *   createLocMaker ( not actually used)
 *   etc ,
 *
 */

/* Location class */
function gMaps() {
    this.markers = [];
    this.infoWindow = new google.maps.InfoWindow({
        pixelOffset: new google.maps.Size(-23, -10),
        maxWidth: 300
    });
    this.marker_animation = google.maps.Animation.DROP;
    this.map = map;
}

/* create a marker for a location */
/* used by the initLocations, addLocation and selectLocation methods to mark  the location on the map*/
gMaps.prototype.markLocation = function() {
    var name = this.name();
    var position = new google.maps.LatLng(this.mapcenter().lat, this.mapcenter().lng);
    var bounds = window.mapBounds; // current boundaries of the map window
    var marker = new google.maps.Marker({
        map: map,
        position: position,
        title: name,
        draggable: true
    });
    // google.maps.event.addListener(marker, 'dragend', console.log(marker));
    this.marker = marker;
    google.maps.event.addListener(marker, 'dblclick', function() {
        var self = this.self;
        self.removeLocation(this);
    }.bind(this));

};

// center the map around a location depending on the radius value
gMaps.prototype.setCenter = function() {
    // console.log(this.name());
    map.setCenter(new google.maps.LatLng(this.mapcenter().lat, this.mapcenter().lng));
    var zoom;
    switch (radius) {
        case 500:
            zoom =  15;
            break;
        case 1000:
            zoom = 14;
            break;
        default: zoom = 13;
    }
    map.setZoom(zoom);
};

/**
 * The method  nearbySearch call google maps places API and search pagination request
 *  based on the Latitude and longitude of the position
 *
 */
gMaps.prototype.nearbySearch = function() {
    var self = this.self;
    // var type = self.myCategories[0]; //  Only one type may be specified
    var service = new google.maps.places.PlacesService(this.map);
    service.nearbySearch({
        location: this.mapcenter(),
        radius: radius,
        // type: self.myCategories()
        type: self.myCategory()
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
    var nearByPlaces = [];
    // process  places returned the nearby search services
    if (status == google.maps.places.PlacesServiceStatus.OK) {
        results.forEach(function(place) {
            if (place.types.filter(isPolitical).length === 0) {
                nearByPlaces.push(place);
                bounds.extend(place.geometry.location);
            }
        });
        map.fitBounds(bounds);
        this.nearByPlaces(nearByPlaces);
        this.savePlaces = nearByPlaces;
        /* if the filter keyword is not cleared, it will be used to filer the new location */
        if (self.keyword()) {
            var keywords = self.keyword().split(delimiter);
            this.getPlacename(keywords);
        } else {
            this.createMarkers(this.nearByPlaces());
        }
        if (self.numPlaces() > 0) self.showResults(true);

    } else {
        self.customAlert("Problem with Google map nearby place services");
    }

    /*
     *  set the location to the first  selected entry of the myLocations array
     *
     */
    self.setCenter();

};

/**
 * Google maps places API autocomplete service.
 */
gMaps.prototype.initAutocomplete = function() {
    var map = this.map;
    // Create the search box and link it to the input UI element.
    var searchInput = document.getElementById('new-location');
    var searchBox = new google.maps.places.SearchBox(searchInput);
    //  Bias the SearchBox results towards current map's viewport.
    map.addListener('bounds_changed', function() {
        searchBox.setBounds(map.getBounds());
        mapCenter = map.getCenter();
    });

    /*
     *  searchBox.getPlaces()  to look for a new location
     *  Newyork Central Square
     *  London Picadilly Circus
     *  or any Full address
     */
    function boxSearch() {
        var self = this.self;
        var newLocation = self.newLocation();
        /* looking for a new location */
        if (newLocation.trim().length > 0) {
            var searchedPlaces = searchBox.getPlaces();
            var places = searchedPlaces.length;
            if (places >= 1) {
                var place = searchedPlaces[0]; // take the first result
                if (!place.geometry) {
                    self.customAlert("map searchBox's returned place contains no geometry");
                    return;
                }
                this.mapCenter = place.geometry.location;
                // create a new location based on information returned by searchBox.getPlaces()
                var location = {};
                location.name = place.formatted_address;
                location.city = place.formatted_address;
                location.mapcenter = {
                    lat: place.geometry.location.lat(),
                    lng: place.geometry.location.lng(),
                };
                location.selected = true;
                // set a new location and search places for nearby this location
                self.addLocation(location);
            } else {
                // self.customAlert("map searchBox could not locate the new location");
            }
            self.newLocation("");
        }
    }
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
    var iconSize = Math.sqrt(window.innerWidth) + 24;
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

        if (width < 750) {
            offsetX = -30;
            offsetY = -1 * (height / 2 + 40); /* +50 */
        }

        /* define the click function for the marker*/
        marker.addListener('click', function() {
            var self = this.self;
            var prevMarker = self.prevMarker();
            if (prevMarker) prevMarker.setAnimation(null);
            if (marker.getAnimation() !== null) {
                marker.setAnimation(null);
            } else {
                marker.setAnimation(google.maps.Animation.BOUNCE);
                map.panTo(marker.position);
                map.panBy(offsetX, offsetY);
                self.prevMarker(marker);
            }
        }.bind(this));

        /* add  the new  marker to  the markers array of the location*/
        this.markers.push(marker);

        /*
         * add the new  maker to the current place. it will be used to open the infowindow when user click
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
 * Get details about place corresponded to the clicked marker and build the infoWindow for the markers
 */

gMaps.prototype.addInfoWindow = function(place, marker) {

    var service = new google.maps.places.PlacesService(this.map);
    var Map = this;
    var self = this.self;

    // var infoWindow = this.infoWindow;
    var infoWindow = self.infoWindow(); // used a observable infoWindow instead of the infoWindow of this location

    var winWidth = window.innerWidth;
    // hide the location and categories list no matter their state
    self.showCategory(false);
    self.showLocation(false);
    service.getDetails({
        placeId: place.place_id
    }, function(place, status) {

        if (status === google.maps.places.PlacesServiceStatus.OK) {
            var reviewsTemplate;
            if (winWidth < 750) {
                self.showResults(false);
            }
            reviewsTemplate = document.getElementById('review-long').innerHTML;
            reviewsTemplate = reviewsTemplate.replace(/{{opening}}/, Map.getOpenings(place));
            /* set infoWinoow content */
            var website = Map.getWebsite(place);
            var rev = reviewsTemplate.replace(/{{name}}/, place.name).replace(/{{formatted_address}}/, place.formatted_address).replace(/{{rating}}/, Map.getRating(place)).replace(/{{photos}}/, Map.getPhotoes(place));
            infoWindow.setContent(rev.replace(/{{website}}/g, website).replace(/{{phone}}/, Map.getPhone(place)));
            infoWindow.open(Map.map, marker);

            /*
               Open the photo-page  dom when photo link is clicked
            */
            if (place.photos) {
                // var numberPhotos = place.photos.length;
                var photolink = document.getElementById('photos');
                photolink.addEventListener("click", function() {
                    self.placePhotos(place.photos);
                    self.currentIndex(0);
                    self.currentPhoto(self.placePhotos()[0]);
                });
            }

            /*
               Open the reviews page when reviews is clicked
            */
            var reviews = document.getElementById('reviews');
            if (reviews) {
                reviews.addEventListener("click", function() {
                    self.placeInFocus(place);
                    place.reviews.forEach(function(review) {
                        if (review.text !== "") {
                            self.placeReviews.push(review);
                        }
                    });
                });
            }

            /*
              Open the nyt article when the nyt link is clicked
            */
            var nytlink = document.getElementById('nytLink');
            if (nytlink && self.jqload()) {
                nytlink.addEventListener("click", function() {
                    self.getNytArticle(place);
                });
            } /* end nyt */


            /*
              Open the wikit article when the nyt link is clicked
            */
            var wikilink = document.getElementById('wikiLink');
            if (wikilink && self.jqload()) {
                wikilink.addEventListener("click", function() {
                    self.openSearchWikipedia(place);
                });
            }

            /*
              Open the street view page when it is clicked
            */

            var streetLink = document.getElementById('streetLink');
            if (streetLink) {
                streetLink.addEventListener("click", function() {
                    self.getStreetView(place);
                });
            }
        }
    });

    google.maps.event.addListener(infoWindow, 'closeclick', function() {
        Map.markers.forEach(function(marker) {
            marker.setAnimation(null);
        }.bind(this));
    });
};

/* return the website of a place */
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
    }
    return opening;
};

/* filter places using the keywords array  for this location this */
gMaps.prototype.getPlacename = function(keywords) {
    var nearbyPlaces = [];
    keywords.forEach(function(keyword) {
        keyword = keyword.trim();
        if (keyword.length > 0) {
            this.savePlaces.forEach(function(place) {
                if (place.name.toLowerCase().indexOf(keyword) >= 0) nearbyPlaces.push(place);
            });
        }
    }.bind(this));
    this.nearByPlaces(nearbyPlaces);
    console.log(nearbyPlaces);
    this.createMarkers(this.nearByPlaces());
};

/*
    pinPoster(locations) takes in the array of locations created by locationFinder()
    and fires off Google place searches for each location
    This function is not actutally used
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
        this.createLocMarker(place);
    }
};

/* create a marker for a location */
gMaps.prototype.createLocMarker = function(place) {
    var name = place.formatted_address;
    var marker = new google.maps.Marker({
        map: this.map,
        position: place.geometry.location,
        title: name
    });
};

// END of Google maps location class

/*
    Application Model view
*/

function ViewModel() {

    /*
     * A factory function we can use to create binding handlers for specific
     * keycodes.
     */
    var ENTER_KEY = 13;

    function keyhandlerBindingFactory(keyCode) {
        return {
            init: function(element, valueAccessor, allBindingsAccessor, data, bindingContext) {
                var wrappedHandler, newValueAccessor;
                // wrap the handler with a check for the enter key
                wrappedHandler = function(data, event) {
                    if (event.keyCode === keyCode) {
                        valueAccessor().call(this, data, event);
                    }
                };
                // create a valueAccessor with the options that we would want to pass to the event binding
                newValueAccessor = function() {
                    return {
                        keyup: wrappedHandler
                    };
                };
                // call the real event binding's init function
                ko.bindingHandlers.event.init(element, newValueAccessor, allBindingsAccessor, data, bindingContext);
            }
        };
    }

    // a custom binding to handle the enter key
    ko.bindingHandlers.enterKey = keyhandlerBindingFactory(ENTER_KEY);

    var self = this;

    /*
    create KO observable
    */
    self.myLocations = ko.observableArray([]); // ko array for hard coded locations
    self.currentLocation = ko.observable(null); // current selected location or the top of the myLocations
    self.newLocation = ko.observable();
    self.showLocation = ko.observable(false); // use to show or hide the liste of Locations
    self.showCategory = ko.observable(false); // use to show or hode the list of Categories
    self.jqload = ko.observable(false); // use to hide third party services if jquery is not loaded
    self.showIcons = ko.observable(false); // use to hide or show the icons n the tool bar. By default it sis hidden since it is experimental
    self.controlIcon = ko.observable("\u25B2"); // control the display of the icons
    self.showResults = ko.observable(true); // boolean to hide or show the places returned by google Map places API nearby search services
    // self.numberPlaces = ko.observable(0); // total number of nearby places
    self.placeReviews = ko.observableArray([]); // ko array for place review objects returned by google map places API getDetails() service
    self.placePhotos = ko.observableArray([]); //ko array for place photo urls returned by google map places API getDetails() service
    self.placeInFocus = ko.observable(); //place object container when opening photos and reviews via infowindows
    self.nytarticles = ko.observableArray([]); //ko array for place new york times artcicle (search API)
    self.nytInFocus = ko.observable(); //
    self.wikiarticles = ko.observableArray([]); //ko array for place wikipedia  artcicle  ( opensearch API)
    self.wikiInFocus = ko.observable();
    self.streetView = ko.observable(); // photo returned by streetview APU
    // self.noimage = ko.observable(); // used for the attribute alt= of <img> to handle street view errors.
    self.showView = ko.observable(false); // control the street view page
    self.currentPhoto = ko.observable(); // current photo holder
    self.currentIndex = ko.observable(0); // cirrent photo index holder
    self.keyword = ko.observable(); // search box keyword
    self.mapPlaceTypes = ko.observableArray(mapPlaceTypes); // ko array of all the place types supported by Google map search nearby services
    // self.myCategories = ko.observableArray(myCategories); // ko array of the selected place types
    self.myCategory  = ko.observable(myCategory);
    self.selectedCategory = ko.observable(myCategory);
    self.infoWindow = ko.observable(infoWindow);
    // self.filterExisting(false);
    self.myError = ko.observable(false);
    self.alertHeader = ko.observable("Error message, please aknowledge");
    self.alertBody = ko.observable("");
    self.alertFooter = ko.observable("");
    self.prevMarker = ko.observable(null);
    self.rangeValue = ko.observable(2);
    self.showSlider  = ko.observable(true);
    /*
     *  Location is a subclass of the gMaps class
     */
    inherit(Location, gMaps); // Location is a subclas of  gMaps
    function Location(location) {
        gMaps.call(this, location); // properties from gMaps
        this.name = ko.observable(location.name);
        this.city = ko.observable(location.city);
        this.mapcenter = ko.observable(location.mapcenter);
        this.selected = ko.observable(location.selected);
        this.nearByPlaces = ko.observableArray([]); // ko array for object returned by google map places API nearby search service
        this.savePlaces = [];
        this.markers = []; // array of markers for nearby places of this location
        this.marker = null; // maker for this location
        this.self = self;
    }

    /* Initialize the self.myLocations observable array with the locations array (the hard coded locations)
     * Mark each location on the map if it is selected
     */
    self.initLocations = function(locations) {
        self.myLocations([]);
        // self.numberPlaces(0);
        locations.forEach(function(location) {
            var loc = new Location(location);
            self.myLocations().push(loc);
            loc.markLocation();
            if (!loc.selected()) {
                loc.marker.setMap(null);
            }
        });
    };

    // initialize the observable self.myLocations Array
    self.initLocations(myLocations);

    /*
     * Complete the map initialization
     * initAutocomplete
     */
    var myMaps, marker_animation, infoWindow;
    myMaps = new gMaps();
    infoWindow = myMaps.infoWindow; // this infowWindow is a global infoWindow which will be used to display information about a place
    self.infoWindow(infoWindow);
    marker_animation = myMaps.marker_animation;
    myMaps.initAutocomplete();
    myMaps.self = self;

    /* define third parties  servies url */

    // var streetViewApiKey = "AIzaSyAUYlUoaLYjM8hidnMVQ05zXiEXJ87dFiY",
    var streeViewURL = "http://maps.googleapis.com/maps/api/streetview?";
    // var orangeWifi = "https://api.orange.com/wifilocator/v2/hotspots";
    var expand = "\u2303";
    var collapse = "\u2304" ;
    // var authorization_header = "Basic " + btoa(client_id + ":" + client_secret)
    /*
    *  add a new location when user click on the map
    *
    */
    map.addListener('dblclick',function(event) {
        var latlng = event.latLng;
        // console.log(event);
        // Change Sa to Ra
        var x = event.Ra.x.toString().slice(0,8);
        var y = event.Ra.y.toString().slice(0,8);
        var place = "lat:" + x + "-lng:" + y;
        var location = {};
        location.name = place;
        location.city = place;
        location.mapcenter = {
            lat: latlng.lat(),
            lng: latlng.lng(),
        };
        location.selected = true;
        // set a new location and search places for nearby this location
        self.addLocation(location);
    });

    /* function to return string starting with prefix */
    function stringStartsWith(string, prefix) {
        return string.slice(0, prefix.length) == prefix;
    }
    /* function for  navigating photo viewer
      The direction is either positif or negatif
     */
    function navigate(direction) {
        var numberPhotos = self.placePhotos().length;
        var current = self.currentIndex();
        var next = (current + direction) % numberPhotos;
        if (next < 0) {
            next = numberPhotos - 1;
        }
        self.currentPhoto(self.placePhotos()[next]);
        self.currentIndex(next);
    }

    /*
     * function hide or show results list depending on the screen resizing ,
     */
    function showResults() {
        self.showResults(true);
        if (self.numPlaces() === 0) {
            self.showResults(false);
            return;
        }
        var winWidth = window.innerWidth;

        if (winWidth > 750)  {
            self.showResults(true);
            self.showSlider(true);
        } else {
            self.showResults(false);
            self.showSlider(false);
            zoom = 500;
        }
    }

    /*
     *  Custome Alert Box to be used after ko is initialzed
     */
    self.customAlert = function(message) {
        self.myError(true);
        self.alertBody(message);
    };

    self.errorOK = function() {
        self.myError(false);
    };

    /*
      fonction to display nearby places
      location is a elemenent of the self.myLocations() array
      For every selected location, it will call the nearbysearch method
      this nearbySearch method will call the Google Maps nearbysearch services

    */

    self.displayLocation = function(location) {
        if (location.selected()) {
            location.nearbySearch();
        }
    };

    /*  hide the location view */
    self.hideLocation = function() {
        self.showLocation(false);
    };

    /* show or hide the location view */
    self.toggleLocation = function() {
        /*
        if (self.myLocations().length === 0) {
            self.showLocation(false);
        } else {
            self.showLocation(!self.showLocation());
        }
        */
        self.showLocation(!self.showLocation());
        self.showCategory(false);

    };

    /* show or hide the catgories selection lists*/
    self.toggleCategory = function() {
        self.showCategory(!self.showCategory());
        self.showLocation(false);
    };
    /*
        Return all the locations which are selected
        during the initLocations function
    */
    self.filteredLocations = ko.computed(function() {
        return self.myLocations();
    }, myMaps);


    /* select or unselect a location
     * user can check /uncheck (check-box)  or click the check box label to select/unselect  a location
     *
     */
    self.selectLocation = function(location) {
        /* toogle selected status */
        location.selected(!location.selected());
        /* hide the location list */
        self.showLocation(false);
        /*
         *  if unselect,
         *   Remove the markers from the map for this location,
         */
        if (!location.selected()) {
            location.nearByPlaces([]); // reset the nearby  places for this location
            // prepare to remove the markers
            if (location.marker) {
                location.marker.setMap(null);
            }
            // re-center the map with  the coordinated of first entry which is selected of the locations array
            self.currentLocation(null);
            self.setCenter();
        } else {
            location.markLocation(); // add a marker for that location
            // Move the  selected location the top of the myLocations Array
            var name = location.name();
            var myLocations = {};
            myLocations = self.myLocations().filter(function(loc) {
                return loc.name() != name;
            });
            myLocations.unshift(location);
            self.myLocations(myLocations);
            self.currentLocation(location);
        }
        /* remove or ceate markers depending on the option
            if (user filter a place type) location.getPlace(type)
        */
        location.createMarkers(location.nearByPlaces());
        showResults();
    };

    /* computed observable to return the city name of a location */
    /* it is used to display the header of the list view  of the places */

    self.myCity = ko.computed(function() {
        var locations = self.myLocations().filter(function(location) {
            return location.selected();
        });
        if (locations.length > 0) {
            return locations[0].city().toUpperCase();
        } else return "";
    });

    /*
     *   close wiki pages only when there are some
     */

    self.closeWiki = function() {
        self.wikiarticles([]);
    };

    /*
     *   close new york times article
     */
    self.closeNyt = function() {
        self.nytarticles([]);
    };

    /*
     *  close the review view
     */

    self.closeReview = function() {
        self.placeReviews([]);
    };

    /*
     *  close the photo viewer
     */
    self.closePhoto = function() {
        self.placePhotos([]);
        self.currentIndex(0);
    };

    // return the current photo index
    self.photoIndex = ko.pureComputed(function() {
        return self.currentIndex() + 1;
    });

    /*
      invoked when  when user input data on the filter bar

      input-text > Place names, places name must be separated by a comma ","
                    Exemple  Centre commercial,parc,jardin, etc..
                    or Place type if the input-text begins with a double colon ":"

      To reset the filter, just clear the input-text and hit enter
    */

    self.getPlace = function() {
        self.showLocation(false); // hide the  list of locations
        self.showCategory(false); // hide the list of categories
        var keywords = [] ;
        var input = self.keyword().trim();
        if (input.length >  0) {
            /* if the input text start with a double colon ":",  fire new nearby search with these keywords*/
            if (input.slice(0,1)===":") {
                keywords = input.slice(1).split(delimiter);
                self.getPlaces(keywords);
                self.keyword("");
                return;
            }
            /* filter places which are already on the map */
            keywords = input.split(delimiter);
            if (keywords.length >= 1) {
                self.myLocations().forEach(function(location) {
                    if (location.selected()) {
                        location.getPlacename(keywords);
                    }
                });
            }
        } else {
            // restore the nearbyplaces() using the previous places (savePlaces array)
            self.myLocations().forEach(function(location) {
                if (location.selected()) {
                    location.nearByPlaces(location.savePlaces);
                    location.createMarkers(location.nearByPlaces());
                }
            });
        }
    };

    self.setCategory = function() {
        myCategory = self.myCategory();
        localStorage.myCategory = JSON.stringify(myCategory);
    }

    self.setmyCategory = function(myCategory) {
        self.myCategory(myCategory);
        localStorage.myCategory = JSON.stringify(myCategory);
    }

    /* this is not actually used */
    self.getPlaces = function(categories) {
        self.myCategory("");
        categories.forEach(function(cat) {
            cat = cat.toLowerCase();
            if (cat.substring(0, 5) == "clini") cat = "hospital";
            if (cat == "fitness") cat = "gym";
            // if (cat.substring(0, 3) == "eat") cat = "food";
            if (cat.substring(0, 5) == "metro") cat = "subway";
            mapplacetype = mapPlaceTypes.filter(getCat);
            // check if the category exist
            if (mapplacetype.length > 0) {
                /*
                mapplacetype.forEach(function(type) {
                    myCategories.push(type);
                });
                */
                myCategory = mapplacetype[0]; // keep the first one
                self.myCategory(myCategory);
            }
            function getCat(maptype) {
                return stringStartsWith(maptype, cat);
            }
        });
        localStorage.myCategory = JSON.stringify(myCategory);
        // center the map using the geolocalization of first entry of the locations array
        self.setCenter();

    };

    /* Init the self.myLocations() observable array
     *  Add new location on top of the myLocations Array
     *  Used by the search box when keyword start with a semi colon :
     *
     */
    self.addLocation = function(location) {
        myLocations.unshift(location);
        self.showCategory(false);
        if (self.showResults() === false) self.showLocation(false);
        // self.showResuls(false);
        var loc = new Location(location); // instancie a new location
        self.myLocations.unshift(loc); // add it to the top of the observable location array
        loc.markLocation(); // mark the new location
        self.currentLocation(loc); // set the current Location to the new location
        localStorage.myLocations = JSON.stringify(myLocations); // save the myLocations array to local storage
    };

    self.addaLocation = function() {
        // reserve for the future
        // Right now, searchBox is fired to search for alocation
    };

    /*
        Unselect the location first (if it is selected)
        Remove the location (filter)
        Try using Ko.toJS to convert self.myLocations() to myLocations array and save it
        if fail then use a work around ( which is much less efficient)
    */
    self.removeLocation = function(location) {
        var name = location.name;
        // unselect the location if it is selected which will decrease the number of current places
        if (location.selected()) {
            self.selectLocation(location);
        }
        self.myLocations(self.myLocations().filter(function(location, idx) {
            if (location.name != name) {
                return location;
            } else  myLocations.splice(idx,1);
        }));
        if (self.myLocations().length === 0) self.showLocation(false);
        localStorage.myLocations = JSON.stringify(myLocations);
    };

    /* is executed when the destroy all button of the Locations list is clicked */
    self.removeAllLocations = function() {
        self.myLocations().forEach( function(location){
            self.removeLocation(location);
        });
    };

    /* set the center of current Locatio  or the the map using the goelocalisation of first selected
     * entry of the locations array
     */
    self.setCenter = function() {
        if (self.currentLocation()) {
            // console.log(self.currentLocation());
            self.currentLocation().setCenter();
            return;
        }
        var locations = self.myLocations().filter(function(location) {
            return location.selected();
        });
        if (locations.length > 0) {
            locations[0].setCenter();
        }
    };

    /* get the address of a place */
    self.getAddress = function(place) {
        if (place.vicinity) {
            var idx = place.vicinity.indexOf(",");
            return place.vicinity.slice(0, idx);
        } else {
            return place.formatted_address;
        }
    };

    /*
      return an object containing the locality, region and country of a place
    */
    self.getLocality = function(place) {
        var add = place.adr_address,
            clocality = 'class="locality">',
            ccountry = 'class="country-name">',
            cregion = 'class="region">',
            start = 0,
            location = {},
            idx2 = 0;
        //console.log(add);
        // extract the locailty
        idx1 = add.indexOf(clocality);
        if (idx1 > 0) {
            start = idx1 + clocality.length;
            idx2 = add.indexOf('</span>', start);
            location.locality = add.slice(start, idx2);
        }
        // extract region
        idx1 = add.indexOf('class="region"', idx2 + 7);
        if (idx1 > 0) {
            start = idx1 + cregion.length;
            idx2 = add.indexOf('</span>', start);
            location.region = add.slice(start, idx2);
        }
        // extract the country-name
        idx1 = add.indexOf('class="country-name"', idx2 + 7);
        if (idx1 > 0) {
            start = idx1 + ccountry.length;
            idx2 = add.indexOf('</span>', start);
            location.country = add.slice(start, idx2);
        }
        return location;
    };

    /**
      hide/show  the list of places returned by google Map places API nearby search services
      it show or hide the results  independently of the screen size
    **/
    self.toggleResults = function() {
        self.showResults(!self.showResults());
        if (self.numPlaces() === 0) self.showResults(false);
        self.showCategory(false);
        self.showLocation(false);
    };

    /**
     *   Add the firt 9 icons of the nearby places to the  iconDict arrray
     *   which are displayed in the btn-toolbar
     *   use the search-box or the category list for other Google map categories
     */
    self.icons = ko.computed(function() {
        var iconnum = 0;
        var iconSet = new Set();
        var iconDict = [];
        self.myLocations().forEach(function(location) {
            for (var idx in location.nearByPlaces()) {
                if (idx) {
                    iconSet.add(location.nearByPlaces()[idx].icon);
                }
            }
        });

        iconSet.forEach(function(icon) {
            iconDict.push({
                "icon": icon
            });
        });
        if (window.innerWidth < 750) {
            iconnum = 7;
        } else iconnum = Math.min(iconDict.length, 12);
        return iconDict.slice(0, iconnum);
    });

    /*
     *   compute the number of places
     *   this number of places is used to hide the results list ( LISTVIEW) when it is zero
     */
    self.numPlaces = ko.computed(function() {
        var numplace = 0;
        self.myLocations().forEach(function(location) {
            if (location.selected()) {
                numplace = numplace + location.nearByPlaces().length;
            }
        });
        // console.log(numplace);
        return numplace;
    });

    /**
       The rateStar() function chains together the rating stars based on place rating.
       It is used by KO to control the display of rating
    */

    self.rateStar = function(rating) {
        var fullstar = Math.round(rating),
            halfstar = rating - fullstar,
            stars = [];
        var emptystar = (halfstar > 0 ? 4 - fullstar : 5 - fullstar);
        for (var i = 0; i < fullstar; i++) {
            stars.push({
                "star": "images/full-star.png"
            });
        }
        if (halfstar > 0) {
            stars.push({
                "star": "images/half-star.png"
            });
        }
        for (i = 0; i < emptystar; i++) {
            stars.push({
                "star": "images/empty-star.png"
            });
        }
        return stars;
    };

    /**
     * replace "_" & "-" to space and first letter to uppercase in place type
     * @example art_gallery => Art gallery
     */
    self.formattedType = function(data) {
        var formattedType = data.types[0].replace(/[_-]/g, " ");
        return formattedType.charAt(0).toUpperCase() + formattedType.substr(1, formattedType.length);
    };

    /*
     *  display the infowindow when user click on a place of the listview
     */
    self.clickMarker = function(place) {
        google.maps.event.trigger(place.marker, 'click');
    };

    /*
     *  Navigate photo viewer
     */
    self.photoBackward = function() {
        navigate(-1);
    };

    self.photoForward = function() {
        navigate(1);
    };

    /*
       Display the view of the street based on the formatted address of the place
       if street view fail, text Sorry .... will replaced the alt= attribute of the <img> element
    */

    self.getStreetView = function(place) {
        self.streetView(streeViewURL + 'size=600x400&location=' + place.formatted_address);
        // self.noimage = "Sorry no image for " + place.formatted_address;
        self.showView(true);
    };

    self.closeView = function() {
        self.showView(false);
    };

    /**
      Based on which icon is pressed, map API nearby search is called with altered categories
      for all the current locations
    */

    self.myIcons = function(image) {
        marker_animation = google.maps.Animation.DROP;
        var rawCategory = image.icon.split("/").slice(-1)[0].split("-").slice(0, 1)[0];

        function Category(value) {
            var val = value.split('_')[0];
            if (rawCategory.indexOf(val) != -1) return value;
        }
        myCategories = mapPlaceTypes.filter(Category);
        myCategory = myCategories[0] ; // Update: New Google maps nearby places service only accept one  category
        self.setmyCategory(myCategory);
        /*
        self.myCategory(myCategory);
        localStorage.myCategory = JSON.stringify(myCategory);
        */
        //self.numberPlaces(0); // reset the total number of places for these categories
        self.showLocation(false);
        self.showCategory(false);
    };

    /**
     * Resets categories on hitting refresh button on .btn-toolbar and
     * re-request Nearby places with google API
     **/
    self.resetIcons = function() {
        self.keyword("");
        // myCategories = [];
        myCategory="";
        self.showCategory(false);
        self.showLocation(false);
        showResults();
        self.setmyCategory(myCategory);
        console.log(self.myCategory());
        /*
        self.myCategory(myCategory);
        localStorage.myCategory = JSON.stringify(myCategory);
        */
    };

    /* if expand , then  collapse the tool bar
    *  if collapse then expand the tool bar
    */
    self.toggleIcons = function() {
        if (self.controlIcon() === "\u25B2") {
            self.controlIcon("\u25BC");
            self.showIcons(true);
        } else if (self.controlIcon() === "\u25BC") {
            self.controlIcon("\u25B2");
            self.showIcons(false);
        }
    };

    /* change the radius whenever the rangeValue of the slider is changed */
    self.rangeValue.subscribe(function(value) {
        radius = unit * value;
    });

    /* hide results when  window size is smaller than 800px */
    window.onresize = function() {
        showResults();
        self.showLocation(false);
        self.showCategory(false);
    };

    window.onload = function() {
        showResults();
    };
    /*
    window.onerror = (function(message, source, lineno, colno, error) {
        self.customAlert(message);
    });
    */
}
// end of the MODEL VIEW

/* load myCategories and myLocations from local storage if they have been saved */
if (localStorage.myLocations) {
    myLocations = JSON.parse(localStorage.myLocations);
}

if (localStorage.myCategory) {
    myCategory = JSON.parse(localStorage.myCategory);
}


/* ko is asynchronulsy loaded
 *  Check if ko  is ready before binding
 *  if ready then bind the view model
 *  if not then
 *    wait 5 ms then retry 20 times
 *  Alert if ko can't be loaded
 *
 */
var numretry = 0;
var model = null;

(function koIsReady() {
    if (typeof ko === "undefined") {
        console.log("knockout.js is not loaded, retry in 5 ms", numretry);
        numretry++;
        if (numretry < 1) {
            setTimeout(koIsReady(numretry), 5);
            return;
        } else {
            Alert.render("Timeout: Knockout.js can't be loaded, the application is not working. Check your network and reload");
            return;
        }
    }
    // bind  the viewmodel to ko
    console.log("Ko binding model is done");
    // var model = new ViewModel();
    model = new ViewModel();
    ko.applyBindings(model);

})(numretry);

/*
 * jQuery is asynchrounly loaded, check/retry  before continue
 * if jquery can't be loaded the application will  work without  third parties API ( New york times and Wikipedia)
 *  if ko is initialzed, use the ko self.customAlert() function, if not use the javascript custom alert box
 */
var numretry = 0;
(function jqIsReady() {
    if (typeof $ === "undefined") {
        console.log("jQuery is not loaded, retry in 10 ms", numretry);
        numretry++;
        if (numretry < 40) {
            setTimeout(jqIsReady(numretry), 10);
            return;
        } else {
            var message = "Timeout: jQuery can't be loaded, run without third parties services or Reload";
            if (model) model.customAlert(message);
            else Alert.render(message);
        }
    } else {
        console.log("jQuery was loaded");
        if (model) model.jqload(true);
    }

    /*
        Add Search wikipedia articles about a  place ( City)
        if the search fail ( time out of 5 sec) or the API could not be loaded, an Alert will be raised
    */
    if (model) { // check if ko model was bound
        model.openSearchWikipedia = function(place) {
            self = this;
            self.wikiarticles([]);
            var wikiOpenSearchURL = "http://en.wikipedia.org/w/api.php?action=opensearch&search=%data%&format=json&callback=wikiCallback",
                wikiarticle = 'http://fr.wikipedia.org/wiki/';
            var location = self.getLocality(place),
                articles = [];
            var query = location.locality + " ";
            if (location.region) {
                query += location.region;
            }
            var url = wikiOpenSearchURL.replace("%data%", query);
            var wikiTemplate = document.getElementById('wiki-temp').innerHTML;
            self.wikiInFocus("about " + query);
            var wikiRequestTimeout = setTimeout(function() {
                self.customAlert("Timeout: Failed to query Wiki resources");
            }, 5000);

            $.ajax({
                    url: url,
                    dataType: "jsonp"
                })
                .done(function(response) {
                    var article = response[1];
                    $.each(article, function(key, value) {
                        var articleurl = wikiarticle + value;
                        articles.push(wikiTemplate.replace(/{{wikiarticle}}/, value).replace(/{{articleUrl}}/, articleurl));
                    });
                    this.wikiarticles(articles);
                    clearTimeout(wikiRequestTimeout);
                }.bind(self)) /* "self" is passed to the function as "this" */

            .fail(function(e) {
                self.customAlert("Wiki API could bot be loaded");
            }.bind(self)); /* "self" is passed to the function as "this" */
        };

        /*
         *  Add Search for new york times articles's services
         *  if the search fail ( time out of 5 sec) or the API could not be loaded, an Alert will be raised
         */

        model.getNytArticle = function(place) {
            self = this;
            self.nytarticles([]);
            var nyturl = "http://api.nytimes.com/svc/search/v2/articlesearch.json?",
                nytArtSearchKey = "befcd9ed183aa5edba4a379ed537e27f:10:73683129";
            var location = self.getLocality(place),
                url = nyturl;
            var query = location.locality + " ";
            if (location.region) {
                query += location.region;
            }
            var filter = location.country;
            var articles = [];
            var nytTemplate = document.getElementById('nytimes-temp').innerHTML;
            self.nytInFocus("about " + filter + " " + query);
            var wikiRequestTimeout = setTimeout(function() {
                self.customAlert("Timeout: failed to query New York times resources");
            }.bind(self), 5000);

            $.getJSON(url, {
                    "q": query,
                    "fq": filter,
                    "page": 0,
                    "sort": "newest",
                    "hl": true,
                    "api-key": nytArtSearchKey
                })
                .done(function(data) {
                    if (data.status == "OK") {
                        $.each(data.response.docs, function(key, value) {
                            var headline = value.headline.main;
                            if (headline !== null) {
                                articles.push(nytTemplate.replace(/{{headline}}/, headline).replace(/{{articleUrl}}/, value.web_url));
                            }
                        });
                    }
                    this.nytarticles(articles);
                    clearTimeout(wikiRequestTimeout);
                }.bind(self)) /* "self" is passed to the function as "this" */

            .fail(function(e) {
                self.customAlert("New York Times Articles could bot be loaded");
            }.bind(self)); /* "self" is passed to the function as "this" */
        };
    }

})(numretry);