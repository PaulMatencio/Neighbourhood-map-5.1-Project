/* */
function inherit(subClass, superClass) {
    subClass.prototype = Object.create(superClass.prototype); // delegate to prototype
    subClass.prototype.Constructor = subClass; // update constructor on prototype
}

/* remove the display: none of an element */
function toggledisplay(id) {
    (function(style) {
        style.display = style.display === 'none' ? '' : 'none';
    })(document.getElementById(id).style);
};


/* custom alert box
* it is used to alert on error
* there are 2 methods : render and ok
* render to display the error message
* ok to acknowledge the message
*/

function CustomAlert() {

    // the render method
    this.render = function(dialog) {
        var winW = window.innerWidth;
        var winH = window.innerHeight;
        var overlay = document.getElementById('alertoverlay');
        var alert = document.getElementById('alertbox');
        overlay.style.display = "block";
        overlay.style.height = winH + "px";

        alert.style.display = "block";
        document.getElementById('alertboxhead').innerHTML = "Error message, please aknowledge";
        document.getElementById('alertboxbody').innerHTML = dialog;
        document.getElementById('alertboxfoot').innerHTML = '<button onclick="Alert.ok()">OK</button>';
    }

    // the ok method
    this.ok = function() {
        document.getElementById('alertbox').style.display = "none";
        document.getElementById('alertoverlay').style.display = "none";
    }
}
/* create an alert instance */
var Alert = new CustomAlert();


/* Google Maps Location class
*
*   An instance per location
*   gMaps() ( creator)
*   pinLocations ( not actually used)
*   searchResults (not actually used)
*   createLocMarker()
*   setCenter()
*   nearbySearch()
*   getResults()
*   initAutocomplete()
*   boxSearch()
*   removeMarkers()
*   createMarkers()
*   addInfoWindow()
*   etc ,
*
*/

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
gMaps.prototype.createLocMarker = function(place) {
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
    var nearByPlaces = [];
    // process  places returned the nearby search services
    if (status == google.maps.places.PlacesServiceStatus.OK) {
        results.forEach(function(place) {
            if (place.types.filter(isPolitical).length == 0) {
                nearByPlaces.push(place);
                bounds.extend(place.geometry.location);
            }
        });
        map.fitBounds(bounds);
        this.nearByPlaces(nearByPlaces);
        this.createMarkers(this.nearByPlaces());
    };

    /* set the location to the first  selected entry of the myLocations array
     * instead of location.setCenter();
     */
    self.setCenter();
    self.numberPlaces(self.numberPlaces() + nearByPlaces.length);
    if (self.numberPlaces() > 0) {
        self.showResults(true);
    }
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
     * However, if the searck keyword startwith ":", the modelview getPlaces function just do nothing and the boxsearch is used to
     * for searching a new location ( using searchBox)
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
            if (!place.geometry) {
                Alert.render("SearchBox's returned place contains no geometry");
                return;
            }
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
    // var iconSize = Math.sqrt($(window).width()) + 24;
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

        if (width < 800) {
            offsetX = -30;
            offsetY = -1 * (height / 2 + 40); /* +50 */
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
    //var $winWidth = $(window).width();
    var winWidth = window.innerWidth;
    // hide the location and categories list no matter their state
    self.showCategory(false);
    self.showLocation(false);
    service.getDetails({
        placeId: place.place_id
    }, function(place, status) {

        if (status === google.maps.places.PlacesServiceStatus.OK) {
            var reviewsTemplate;
            if (winWidth < 800) {
                self.showResults(false);
                // reviewsTemplate = $('script[data-template="review-short"]').html();
                reviewsTemplate = document.getElementById('review-short').innerHTML ;
            } else {
                // reviewsTemplate = $('script[data-template="reviews"]').html();
                reviewsTemplate = document.getElementById('review-long').innerHTML ;
                reviewsTemplate = reviewsTemplate.replace(/{{opening}}/, Map.getOpenings(place));
            }

            /* set infoWinoow content */
            var website = Map.getWebsite(place);
            var rev = reviewsTemplate.replace(/{{name}}/, place.name).replace(/{{formatted_address}}/, place.formatted_address).replace(/{{rating}}/, Map.getRating(place)).replace(/{{photos}}/, Map.getPhotoes(place));
            infoWindow.setContent(rev.replace(/{{website}}/g, website).replace(/{{phone}}/, Map.getPhone(place)));
            infoWindow.open(Map.map, marker);
            // $('.infoWindow').fadeIn(200);

            /*
               Open the photo-page  dom when photo link is clicked
            */
            if (place.photos) {
                var numberPhotos = place.photos.length;
                var photolink = document.getElementById('photos');
                photolink.addEventListener("click", function(){
                    self.placePhotos(place.photos);
                    self.currentIndex(0);
                    self.currentPhoto(self.placePhotos()[0]);
                });
            };

            /*
               Open the reviews page when reviews is clicked
            */
            var reviews =  document.getElementById('reviews');
            if (reviews) {
                reviews.addEventListener("click",function() {
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
            var nytlink =  document.getElementById('nytLink');
            if (nytlink) {
                nytlink.addEventListener("click",function() {
                    self.getNytArticle(place);
                });
            }; /* end nyt */


            /*
              Open the wikit article when the nyt link is clicked
            */
            var wikilink =  document.getElementById('wikiLink');
            if (wikilink) {
                wikilink.addEventListener("click",function() {
                self.openSearchWikipedia(place);
                });
            };

            /*
              Open the street view page when it is clicked
            */

            var streetLink = document.getElementById('streetLink');
            if (streetLink) {
                streetLink.addEventListener("click",function() {
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

// END of Google maps location class

/*
    Application Model view
*/

function ViewModel() {

    var ENTER_KEY = 13;
    // A factory function we can use to create binding handlers for specific
    // keycodes.
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
    self.showLocation = ko.observable(false);
    self.showCategory = ko.observable(false);
    self.showResults = ko.observable(true); // boolean to hide or show the places returned by google Map places API nearby search services
    self.numberPlaces = ko.observable(0); // total number of nearby places
    self.placeReviews = ko.observableArray([]); // ko array for place review objects returned by google map places API getDetails() service
    self.placePhotos = ko.observableArray([]); //ko array for place photo urls returned by google map places API getDetails() service
    self.placeInFocus = ko.observable(); //place object container when opening photos and reviews via infowindows
    self.nytarticles = ko.observableArray([]); //ko array for place new york times artcicle (search API)
    self.nytInFocus = ko.observable(); //
    self.wikiarticles = ko.observableArray([]); //ko array for place wikipedia  artcicle  ( opensearch API)
    self.wikiInFocus = ko.observable();
    self.streetView = ko.observable(); // photo returned by streetview APU
    self.noimage = ko.observable(); // used for the attribute alt= of <img> to handle street view errors.
    self.showView = ko.observable(false); // control the street view page
    self.currentPhoto = ko.observable(); // current photo holder
    self.currentIndex = ko.observable(0); // cirrent photo index holder
    self.keyword = ko.observable();
    self.mapPlaceTypes = ko.observableArray(mapPlaceTypes);
    self.myCategories = ko.observableArray(myCategories);

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
    };

    /* Initialize the self.myLocations observable array with the locations array (the hard coded locations)
     * Mark each location on the map if it is selected
     */
    self.initLocations = function(locations) {
        self.myLocations([]);
        self.numberPlaces(0);
        locations.forEach(function(location) {
            var loc = new Location(location);
            self.myLocations().push(loc);
            loc.markLocation();
            if (!loc.selected()) {
                loc.marker.setMap(null);
            }
        });
    }

    // initialize the observable self.myLocations Array
    self.initLocations(myLocations);

    /*
     * Complete the map initialization
     * initAutocomplete
     */
    var myMaps, marker_animation, infoWindow;

    myMaps = new gMaps();
    infoWindow = myMaps.infoWindow;
    marker_animation = myMaps.marker_animation;
    myMaps.initAutocomplete();
    myMaps.self = self;

    /* define third parties  servies url */

    var    streetViewApiKey = "AIzaSyAUYlUoaLYjM8hidnMVQ05zXiEXJ87dFiY",
        streeViewURL = "http://maps.googleapis.com/maps/api/streetview?";
        /*
    var nyturl = "http://api.nytimes.com/svc/search/v2/articlesearch.json?",
        nytArtSearchKey = "befcd9ed183aa5edba4a379ed537e27f:10:73683129",
        wikiOpenSearchURL = "http://en.wikipedia.org/w/api.php?action=opensearch&search=%data%&format=json&callback=wikiCallback",
        wikiarticle = 'http://fr.wikipedia.org/wiki/',
        streeViewURL = "http://maps.googleapis.com/maps/api/streetview?";
    */

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
        };
        self.currentPhoto(self.placePhotos()[next]);
        self.currentIndex(next);
    }

    /*
     * function hide or show results list depending on the screen resizing ,
     */
    function showResults() {
        // var $winWidth = $(window).width();
        var winWidth = window.innerWidth;
        if (winWidth > 800) {
            self.showResults(true);
        } else self.showResults(false);


    }

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
        if (self.myLocations().length == 0) {
            self.showLocation(false);
        } else {
            self.showLocation(!self.showLocation());
        }
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
         *   Decrement the totoal number of displayed pplace
         *  the total number of places is incremented with the nearby search functions
         */
        if (!location.selected()) {
            self.numberPlaces(self.numberPlaces() - location.nearByPlaces().length);
            location.nearByPlaces([]); // reset the nearby  places for this location
            // prepare to remove the markers
            if (location.marker) {
                location.marker.setMap(null);
            }
            // re-center the map with  the first selected entry of the locations aray
            self.setCenter();
        } else {
            location.markLocation(); // add a marker for that location
        }
        // remove or add markers depending on the option
        location.createMarkers(location.nearByPlaces());
        if (self.numberPlaces() == 0) {
            self.numberPlaces(0);
            self.showResults(false);
        };
    };

    /* computed observable to return the city name of a location */
    /* it is used to display the header of the list view  of the places */

    self.myCity = ko.computed(function() {
        var locations = self.myLocations().filter(function(location) {
            return location.selected();
        });
        if (locations.length > 0) {
            return locations[0].city();
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
      Search near by  places or new locations
      input : Place types. Place type should be separated with space
      ex: cafe restaurant gas food etc ..
      if keyword start with : the application will use the keywords ( location) to search for new location
      ( Google Maps searchBox is trigger to serach for a new location)
    */

    self.getPlace = function() {
        /* reset the categories */
        var keywords = self.keyword().trim();
        // The Search box will handle all keywords start with :
        if (keywords.substring(0, 1) == ":") {
            return;
        }
        myCategories = [];
        var categories = keywords.split(" ");
        self.getPlaces(categories);
        self.showLocation(false);
        self.showCategory(false);

    };

    self.getPlaces = function(categories) {
        // map some input keyword  to map Google place types
        categories.forEach(function(cat) {
            if (cat.substring(0, 5) == "clini") cat = "hospital";
            if (cat == "fitness") cat = "gym";
            if (cat.substring(0, 3) == "eat") cat = "food";
            if (cat.substring(0, 5) == "metro") cat = "subway";
            mapplacetype = mapPlaceTypes.filter(getCat);

            mapplacetype.forEach(function(type) {
                myCategories.push(type);
            });
            self.myCategories(myCategories);

            function getCat(maptype) {
                return stringStartsWith(maptype, cat);
            };
        });
        self.numberPlaces(0);
        // save the updated categories array in local storage
        localStorage.myCategories = JSON.stringify(myCategories);
        // center the map using the geolocalization of first entry of the locations array
        self.setCenter();

    };

    self.getCategories = function() {
        console.log(self.myCategories());
    }

    /* Init the self.myLocations() observable array
     *  Add new location on top of the myLocations Array
     *  Used by the search box when keyword start with a semi colon :
     *
     */
    self.addLocation = function(location) {
        myLocations.unshift(location);
        var loc = new Location(location); // instancie a new location
        self.myLocations.unshift(loc); // add it to the top of the observable location array and THAT's IT
        loc.markLocation(); // mark the new location
        localStorage.myLocations = JSON.stringify(myLocations); // save the myLocations array to local storage
    };

    /*
        Unselect the location first (if it is selected)
        Try using Ko.toJS to convert self.myLocations() to myLocations array and save it
        if fail then use a work around ( which is much less efficient)
    */
    self.removeLocation = function(location) {
            var name = location.name;
            // unselect the location if it is selected
            if (location.selected()) {
                self.selectLocation(location);
            }
            /* remove the location of the locations observable array and that's it */
            /*  I get a security or timeout issue with
             *       ko.toJS(self.myLocations()
             *    Below is a work around to Jsonify the mylocations array ( not really efficient but it works)
             */

            self.myLocations(self.myLocations().filter(function(location, idx) {
                myLocations[idx].remove = true;
                if (location.name != name) {
                    myLocations[idx].remove = false;
                    return location;
                }
            }));

            // save the new locations array on the local storage
            myLocations = myLocations.filter(function(location) {
                if (location.remove == false) return location;
            });
            localStorage.myLocations = JSON.stringify(myLocations);

            /*
            try {
                localStorage.myLocations = ko.toJS(self.myLocations());
            } catch (e) {
                console.log(e);
                self.myLocations(self.myLocations().filter(function(location, idx) {
                    myLocations[idx].remove = true;
                    if (location.name != name) {
                        myLocations[idx].remove = false;
                        return location;
                    }
                }));

                // save the new locations array on the local storage
                myLocations = myLocations.filter(function(location) {
                    if (location.remove == false) return location;
                });
                localStorage.myLocations = JSON.stringify(myLocations);
            };
            */
    };

    /* set the center of the map using the goelocalisation of first selected
    * entry of the locationhs array
    */
    self.setCenter = function() {
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
        idx1 = add.indexOf(clocality)
        if (idx1 > 0) {
            start = idx1 + clocality.length;
            idx2 = add.indexOf('</span>', start);
            location.locality = add.slice(start, idx2);
        };
        // extract region
        idx1 = add.indexOf('class="region"', idx2 + 7);
        if (idx1 > 0) {
            start = idx1 + cregion.length;
            idx2 = add.indexOf('</span>', start)
            location.region = add.slice(start, idx2);
        };
        // extract the country-name
        idx1 = add.indexOf('class="country-name"', idx2 + 7);
        if (idx1 > 0) {
            start = idx1 + ccountry.length;
            idx2 = add.indexOf('</span>', start)
            location.country = add.slice(start, idx2);
        };
        //console.log(location);
        return location;
    }

    /**
      hide/show  the list of places returned by google Map places API nearby search services
      it show or hide the results  independently of the screen size
    **/
    self.toggleResults = function() {
        if (self.numberPlaces() > 0) {
            self.showResults(!self.showResults());
        }
    };

    /**
     *   Add the firt 9 icons of the nearby places to the  iconDict arrray
     *   which are displayed in the btn-toolbar
     *   use the search-box for other google Maps categories
     */
    self.icons = ko.computed(function() {
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
        return iconDict.slice(0, 8);
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
    }

    /*
     *  Navigate photo viewer
     */
    self.photoBackward = function() {
        navigate(-1);
    }

    self.photoForward = function() {
        navigate(1);

    }

    /*
       Display the view of the street based on the formatted address of the place
       if street view fail, text Sorry .... will replaced the alt= attribute of the <img> element
    */

    self.getStreetView = function(place) {
        self.streetView(streeViewURL + 'size=600x400&location=' + place.formatted_address);
        self.noimage = "Sorry no image for " + place.formatted_address;
        self.showView(true);
    };

    self.closeView = function() {
        self.showView(false);
    }

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
        };
        myCategories = mapPlaceTypes.filter(Category);
        self.myCategories(myCategories);
        self.numberPlaces(0); // reset the total number of places for these categories
        self.showLocation(false);
        self.showCategory(false);
        localStorage.myCategories = JSON.stringify(myCategories);
    };

    /**
     * Resets categories on hitting refresh button on .btn-toolbar and
     * re-request Nearby places with google API
     **/
    self.resetIcons = function() {
        myCategories = [];
        self.myCategories(myCategories);
        self.numberPlaces(0);
        localStorage.myCategories = JSON.stringify(myCategories);
        /*
        self.myLocations().forEach(function(location) {
            self.displayLocation(location);
        });
        */
    };

    self.hideIcons = function() {
        // To do
    };

    /* showResults is a local function to the modelview function*/
    window.onresize = function() {
       showResults();
    };
};

// end of the MODEL VIEW


/* load myCategories and myLocations from local storage if they have been saved */
if (localStorage.myLocations) {
    myLocations = JSON.parse(localStorage.myLocations);
};

if (localStorage.myCategories) {
    myCategories = JSON.parse(localStorage.myCategories);
};

/* create and binf the model to knockout.js */
var model = new ViewModel();

/* ko is asynchronulsy loaded
*  Check ko is ready before binding
*/
var numretry = 0;
(function koIsReady() {
    if (typeof ko === "undefined") {
        console.log("knockout.js is not loaded, retry in 5 ms",numretry);
        numretry++;
        if (numretry < 20) {
           setTimeout(koisReady(numretry), 5);
           return;
        } else {
            Alert.render("Knockout.js can't be loaded, the application is not working");
            return;
        }
     };
     // bind  the viewmodel to ko
    console.log("Ko binding model is done");
    ko.applyBindings(model);
})(numretry);

/* it is time to remove the display:none style of  the following dom element */
toggledisplay("marker");
toggledisplay("options");

/*
* jQuery is asynchrounly loaded, check/retry  before continue
* if jquery can't be loaded the application function without  third parties API ( New york times and Wikipedia)
*
*/
var numretry = 0;
(function jqIsReady() {

    if (typeof $ === "undefined") {
        console.log("jQuery is not loaded, retry in 5 ms", numretry);
        numretry++;
        if (numretry < 20) {
            setTimeout(jqIsReady(numretry), 5);
            return;
        } else {
            Alert.render("jQuery can't be loaded, the application will run without third parties services");
            return;
        }
    };
    console.log("jQuery was loaded");
    /*
    $(window).resize(function() {
        model.showResults();
    });
    */
    /*
        Add Search wikipedia articles about the  place ( City)
    */
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
        };
        var url = wikiOpenSearchURL.replace("%data%", query);
        var wikiarticle = 'http://fr.wikipedia.org/wiki/';
        // var wikiTemplate = $('script[data-template="wiki"]').html();
        var wikiTemplate = document.getElementById('wiki-temp').innerHTML;
        self.wikiInFocus("about " + query);
        var wikiRequestTimeout = setTimeout(function() {
            articles.push("<p>failed to query wiki resources</p>");
            this.wikiarticles(articles);
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
                // console.log(this.wikiarticles().length);
                clearTimeout(wikiRequestTimeout);
            }.bind(self)) /* "self" is passed to the function as "this" */

        .fail(function(e) {
            articles.push("<p>Wiki could bot be loaded</p>");
            this.wikiarticles(articles);
        }.bind(self)); /* "self" is passed to the function as "this" */
    };

    /*  Add Search for   ew york times articles
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
        //var query = location.locality;
        var filter = location.country;
        var articles = [];
        // var nytTemplate = $('script[data-template="nytimes"]').html();
        var nytTemplate = document.getElementById('nytimes-temp').innerHTML;
        self.nytInFocus("about " + filter + " " + query);
        var wikiRequestTimeout = setTimeout(function() {
            articles.push("<p>failed to query New York times resources</p>");
            this.nytarticles(articles);
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
                    //console.log(this, self);
                    $.each(data.response.docs, function(key, value) {
                        var headline = value.headline.main;
                        if (headline != null) {
                            articles.push(nytTemplate.replace(/{{headline}}/, headline).replace(/{{articleUrl}}/, value.web_url));
                        }
                    });
                };
                this.nytarticles(articles);
                clearTimeout(wikiRequestTimeout);
            }.bind(self)) /* "self" is passed to the function as "this" */

        .fail(function(e) {
            articles.push("<p>New York Times Articles could bot be loaded</p>");
            this.nytarticles(articles);
        }.bind(self)); /* "self" is passed to the function as "this" */
    };

    $('#hide').click(function() {

        var $span = $(this).children('span');
        var $direction = $span.text();
        if ($direction == "⊳") {
            $direction = "⊲";
        } else $direction = "⊳";
        $span.text($direction);
        $(this).siblings('div').animate({
            width: "toggle"
        }, 500);
    });

})(numretry);
