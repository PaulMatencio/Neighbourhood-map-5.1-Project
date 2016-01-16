function gMaps(mapOptions, mapStyle) {
  // console.log(localStorage.mapCenter);
  this.mapCenter = mapOptions.center;
  console.log(mapOptions.center);
  this.map = new google.maps.Map(document.querySelector('#map-canvas'), mapOptions);
  this.infoWindow = new google.maps.InfoWindow({
    pixelOffset: new google.maps.Size(-23, -10),
    maxWidth: 300
  });

  this.marker_animation = google.maps.Animation.DROP;
  this.styledMap = new google.maps.StyledMapType(mapStyle, {
    name: "Styled Map"
  });
  this.map.mapTypes.set('map_style', this.styledMap);
  this.map.setMapTypeId('map_style');
  this.markers = [];
};


/**
 *  Locate user using geolocation if the bowser support otherwsie use the default position ( malplatLng)
 */

gMaps.prototype.getCurrentLocation = function() {

  var options = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0
  };
  if (navigator.geolocation) {
    /** the browser support Geolocation
     * get the current position
     */
    navigator.geolocation.getCurrentPosition(function(position) {
        /* SUCCESS Returns the current position */
        this.mapCenter = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
      },
      function() { /* ERROR Returns the position displayed at the center of the map */
        this.mapCenter = this.map.getCenter();
      }.bind(this),
      options);
  } else {
    /*The browser doesn't support Geolocation returns the position displayed at the center of the map */
    this.mapCenter = this.map.getCenter();
  };
  return mapCenter;
};



/**
 * The method  nearbySearch call google maps places API and search pagination request
 *  based on the Latitude and longitude of the position
 */
gMaps.prototype.nearbySearch = function(position) {
  var Map = this;
  var service = new google.maps.places.PlacesService(Map.map);
  service.nearbySearch({
    location: position,
    radius: radius,
    types: myCategories
  }, Map.getResults.bind(Map));
};

/**
    get the places with types != "politcal"
*/
gMaps.prototype.getResults = function(results, status, pagination) {
  var bounds = new google.maps.LatLngBounds();
  var self = this.self;
  self.nearByPlaces([]);
  // myCategories = [];

  function isPolitical(value) {
    return value == "political";
  }

  if (status == google.maps.places.PlacesServiceStatus.OK) {
    results.forEach(function(place) {
      if (place.types.filter(isPolitical).length == 0) {
        self.nearByPlaces.push(place);
        bounds.extend(place.geometry.location);
      }
    });
    this.map.fitBounds(bounds);
    this.createMarkers(self.nearByPlaces());
  }
};

/**
 * Google maps places API autocomplete service.
 */
gMaps.prototype.initAutocomplete = function() {
  var Map = this;
  var map = this.map;
  var self = this.self;
  // Create the search box and link it to the input UI element.
  var searchInput = document.getElementById('search-input');
  var searchBox = new google.maps.places.SearchBox(searchInput);
  // Bias the SearchBox results towards current map's viewport.
  map.addListener('bounds_changed', function() {
    searchBox.setBounds(map.getBounds());
    mapCenter = map.getCenter();
  });

  // Search a new place or  more details for that place.
  //
  function boxSearch() {
    // myCategories = [];
    var searchedPlaces = searchBox.getPlaces();
    var places = searchedPlaces.length;
    if (places > 0) {
      if (places == 1) {
        Map.mapCenter = searchedPlaces[0].geometry.location;
        Map.nearbySearch(Map.mapCenter);
        localStorage.mapCenter = JSON.stringify(Map.mapCenter);
        //console.log(localStorage.mapCenter);
      } else {
        self.nearByPlaces(searchedPlaces);
        Map.createMarkers(searchedPlaces);
      }
    };
    searchInput.value = "";
  };
  searchBox.addListener('places_changed', boxSearch);
};

/*
 * Set markers to the map. @param {Object[]} places - returned by the google API search.
 */
gMaps.prototype.createMarkers = function(places) {
  /*
    place= { geometry : Object,icon: url,id: string,name:  string, place_id: string,opening_hours: object,photos: Array[],rating: number,
          reference:  string,scope: string,type : Array[],formated_address: text,vicinity : html
       }
  */
  var iconSize = Math.sqrt($(window).width()) + 20;
  var Map = this;
  this.markers.forEach(function(marker) {
    marker.setMap(null); // Clear out the old markers.
  });
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
        map: Map.map,
        icon: icon,
        title: place.name,
        animation: Map.marker_animation,
        position: place.geometry.location
      }),
      width = window.innerWidth,
      height = window.innerHeight,
      offsetX = 150,
      offsetY = -height / 5;

    if (width < 750) {
      offsetX = -20;
      offsetY = -1 * (height / 2 - 100);
    }

    marker.addListener('click', function() {

      Map.markers.forEach(function(marker) {
        marker.setAnimation(null);
      });

      if (marker.getAnimation() !== null) {
        marker.setAnimation(null);
      } else {
        marker.setAnimation(google.maps.Animation.BOUNCE);
        Map.map.panTo(marker.position);
        Map.map.panBy(offsetX, offsetY);
      }
    });

    Map.markers.push(marker);

    google.maps.event.addListener(marker, 'click', function() {
      Map.addInfoWindow(place, marker);
    });
  });
};


/*
 * Get details about place corresponded to the clicked marker and build the infoWindow.
 */

gMaps.prototype.addInfoWindow = function(place, marker) {

  var service = new google.maps.places.PlacesService(this.map);
  var Map = this;
  var self = this.self;
  var infoWindow = this.infoWindow;
  service.getDetails({
    placeId: place.place_id
  }, function(place, status) {

    // self.getFourSquare(place);
    // getWikiExtract(place);
    // self.getNytArticle(place);

    if (status === google.maps.places.PlacesServiceStatus.OK) {

      /* set infoWinoow content */
      var website = self.getWebsite(place);
      var reviewsTemplate = $('script[data-template="reviews"]').html();
      var rev = reviewsTemplate.replace(/{{name}}/, place.name).replace(/{{formatted_address}}/, place.formatted_address).replace(/{{opening}}/, Map.getOpenings(place)).replace(/{{rating}}/, Map.getRating(place)).replace(/{{photos}}/, Map.getPhotoes(place));
      infoWindow.setContent(rev.replace(/{{website}}/g, website).replace(/{{phone}}/, Map.getPhone(place)));
      infoWindow.open(Map.map, marker);
      $('.infoWindow').fadeIn(500);

      /*
         Open the photo-page  dom when photo link is clicked
      */
      self.placePhotos(place.photos);
      if (place.photos) {
        var numberPhotos = place.photos.length;

        $('#photos').click(function() {
          $('#photo-page').show();
          $('#backward').show();
          $('#forward').show();
          var current = 0;
          navigate(0);
          $('#forward').click(function() {
            navigate(1);
          });
          $('#backward').click(function() {
            navigate(-1);
          });

          /*
              show photo in circular list manner when the navButtons
              backward or forward are clicked
          */
          function navigate(direction) {
            previous = current;
            current = (current + direction) % numberPhotos;
            current = current < 0 ? numberPhotos - 1 : current;
            var $children = $('#frame').children();
            $children.eq(previous).hide();
            $children.eq(current).show();
            updCounter(current);
          }
          /*
            circular update the  photo counter
          */
          function updCounter(current) {
            $('#photoCounter').text(current + "/" + numberPhotos);
          }

          $('#close-photo').click(function() {
            $('#frame').children().hide();
            $('#backward').hide();
            $('#backward').hide();
            $('#photo-page').hide();

          });
        });
      };

      /**
       * Opens the review-page  dom  when the reviews is clicked
       */

      var $reviews = $('#reviews');
      if ($reviews) {
        $reviews.click(function() {
          self.placeReviews([]);
          self.placeInFocus(place);
          place.reviews.forEach(function(review) {
            if (review.text !== "") {
              self.placeReviews.push(review);
            }
          });
          var $reviewpage = $('#review-page');
          var $reviews = $('#reviews');
          $reviewpage.show();
          $reviews.children().show();

          $('#close-review').click(function() {
            $reviews.children().hide();
            $reviewpage.hide();
          });
        });
      };

      /*
        Open the nyt article when the nyt link is clicked
      */
      var $nytlink = $('#nytLink');

      if ($nytlink) {
        $nytlink.click(function() {
          self.nytarticles(self.getNytArticle(place));
          var $nytimespage = $('#nytimes-page');
          $nytimespage.show();
          $('#close-nytimes').click(function() {
            $nytimespage.hide();
          });
        });
      }; /* end nyt */


      /*
        Open the wikit article when the nyt link is clicked
      */
      var $nytlink = $('#wikiLink');

      if ($nytlink) {
        $nytlink.click(function() {
          var $wikipage = $('#wiki-page');
          self.nytarticles(self.openSearchWikipedia(place));
          $wikipage.show();
          $('#close-wiki').click(function() {
            $wikipage.hide();
          });
        });
      }; /* end nyt */

      /*
        Open the street view page when it is clicked
      */

      var $streetLink = $('#streetLink');
      if ($streetLink) {
        $streetLink.click(function() {
          self.streetView(self.getStreetView(place));
          var $streetpage = $('#street-page');
          $streetpage.show();
          $('#close-street').click(function() {
            $streetpage.hide();
          });
        });
      };


      var foursquareLink = document.getElementById('fourLink');
      if (foursquareLink) {
        foursquareLink.addEventListener("click", function() {
          self.foursquarePlaces(getFourSquare(place));

          $('#foursquare-page').show();
          $('#close-foursquare').click(function() {
            $('#foursquare').children().hide();
            $('#foursquare-page').hide();
          });
        });
      }; /* end 4square */

    }
  });

  google.maps.event.addListener(infoWindow, 'closeclick', function() {
    Map.markers.forEach(function(marker) {
      marker.setAnimation(null);
    }.bind(this));
  });
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

/*
   reuse previous filters stored in local Storage
*/

if (localStorage.mapCenter) {
    mapCenter = JSON.parse(localStorage.mapCenter);
} else mapCenter = {
    lat: 52.3702,
    lng: 4.8953
};

if (localStorage.myCategories) {
    myCategories = JSON.parse(localStorage.myCategories);
};

  /*
    initMap option
  */
var  mapOptions = {
    center: mapCenter,
    zoomControl: true,
    zoom: 14,
    minZoom: 3,
    maxZoom: 18,
    disableDefaultUI: true,
    streetViewControl: true
  };