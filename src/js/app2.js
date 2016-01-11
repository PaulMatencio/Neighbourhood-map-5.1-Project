/**
 * Adding modulus methode to Number.
 * In JavaScript "%"-called modulus by many programmer and sites like W3Schools,
 *    but it's really a remainder function and it DOES NOT behave like modulus with negative numbers.
 * Remainder: https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Operators/Arithmetic_Operators#Remainder_()
 * Difference explained in details here: http://www.sitecrafting.com/blog/modulus-remainder
 * NOTE: needed for the function getOpeningHrs() line 481.
 */
Number.prototype.mod = function(n) { return ((this%n)+n)%n; };



$(function() {

  function ViewModel() {

    var self = this;
    var myMaps           = new gMaps(mapOptions,mapStyle);
    var map              = myMaps.map;
    var infoWindow       = myMaps.infoWindow;
    var position         = myMaps.getCurrentLocation();
    var marker_animation = myMaps.marker_animation;


    self.nearByPlaces = ko.observableArray([]);  //container for object returned by google map places API nearby search service
    // self.places = ko.observableArray([]);        //container for object returned by google map places API searchBox service
    // self.keyword = ko.observable("");            //keyword to filter   places
    self.placeReviews = ko.observableArray([]);  //container for place review objects returned by google map places API getDetails() service
    self.placePhotos = ko.observableArray([]);   //container for place photo urls returned by google map places API getDetails() service
    self.placeInFocus = ko.observable();          //place object container when opening photos and reviews via infowindows
    self.foursquarePlaces = ko.observableArray([]); //container for foursquare API objects
    
    myMaps.self = self;

    self.getAddress = function(place) {
      if (place.vicinity) {
        var idx = place.vicinity.indexOf(",");
        return  place.vicinity.slice(0,idx);
      } else {
        return place.formatted_address;
      }
    };

    /**
       *   This is a computed @var {icons}, returns icons for the btn-toolbar.
       *   Add the firt 20 icons of the nearby places to the  iconDict arrray 
       *   which are displayed in the btn-toolbar
    */
    self.icons = ko.computed(function() {
      var iconSet = new Set();
      var iconDict = [];
      for (var idx in self.nearByPlaces()) {
        if (idx) {
        	iconSet.add(self.nearByPlaces()[idx].icon);
        }
      }
      iconSet.forEach(function(icon) {
        iconDict.push({"icon": icon});
      });
      return iconDict.slice(0, 20);
    });

    /**
       * The @function rateImg() chains together the rating stars based on place rating.
    */
    self.rateImg = function(rating) {

      rating = Math.round(rating * 2)/2;
      var imgHolder = [];

      for (var i = 0; i < parseInt(rating); i++) {
        imgHolder.push({"star" : "images/full-star.png"});
      }

      if (rating - parseInt(rating) !== 0) {
        imgHolder.push({"star" : "images/half-star.png"});
      }

      for (i = 0; i < parseInt(5 - rating); i++){
        imgHolder.push({"star" : "images/empty-star.png"});
      }
      return imgHolder;
    };


    /**
       * The @function displayedPlaces() filters the markers and places based on keyword.
    */
    /*
    self.displayedPlaces = function() {

      var places = [],
      keyword = self.keyword().toLowerCase(),
      actualPlaces = [],
      width = window.innerWidth;

      if (self.places().length < 2) {
        actualPlaces = self.nearByPlaces();
      } else {
        actualPlaces = self.places();
      };
      // console.log(actualPlaces);

      if (self.keyword() !== "") {
        for (var idx in actualPlaces) {

          if (actualPlaces[idx].name.toLowerCase().indexOf(keyword) != -1 ||
              actualPlaces[idx].types[0].toLowerCase().indexOf(keyword) != -1) {
                marker_animation = null;
                places.push(actualPlaces[idx]);
          }
        }
      } else {
          if (width < 500) {
            places = actualPlaces.slice(0, 12); //number of hits reduced for smaller device.
          }
          else {
            places = actualPlaces;
          }
      };
      console.log(places);
      return places;
    };
     */

    self.formattedType = function(data) {
      /**
       * replace "_" & "-" to space and first letter to uppercase in place type
       * @example art_gallery => Art gallery
       */
      var formattedType = data.types[0].replace(/[_-]/g, " ");
      return formattedType.charAt(0).toUpperCase() + formattedType.substr(1, formattedType.length);
    };


    myMaps.nearbySearch(position);
    myMaps.initAutocomplete();


    self.getWeb = function(place) {

      if (place.website) {
        return place.website;
      } else {
        return "";
      }
    };

    function getFourSquare(place) {
      var lat = place.geometry.location.lat(), lng = place.geometry.location.lng(),
      baseUrl = "https://api.foursquare.com/v2/venues/explore?ll=",
      baseLocation = lat + ", " + lng,
      extraParams = "&limit=5&section=topPicks&day=any&time=any&locale=en&&client_id=PMDCA1TH4CXRVBSLMBTPME2OBYL4G2FY5JZJ1SHXPW5T50ZL&client_secret=ZYQZSU5EZP3T0PRYJASI0N5X12ORCCI5113ENQOQAKIR1AAP&v=20151119",
      url = baseUrl + baseLocation + extraParams;
      $.getJSON(url, function(data) {
        self.foursquarePlaces(data.response.groups[0].items);

    })
      .fail(function() {
        /**
         * Handle API load error. Instead of alert() I pass a
         *    "fake" JSON to the observable array tailored as an error msg.
         */
        console.log( "The foursquare API faild to load." );
        self.foursquarePlaces([{
          "venue": {"name": "FOURSQUARE API failed to load.",
                  "categories" : [{"name" : ""}],
                  "location" : {"formattedAddress": ""}},
          "tips": [{"text": "Try reload the page!"}]
        }]);

      })
      .always(function() {
        console.log( "The foursquare request finished." );
      });

    };

    function getWikiExtract(place) {
      /**
       * Get wikipedia page extract and link based on place name.
       */
      var searchParam = place.name.replace(/[\s,]/g, "%20");
      var wiki = "https://en.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&exintro=&explaintext=&titles=" + searchParam;

      var wikiTimeOut = setTimeout(function() {
        console.log("Wiki API failed to load."); //Could notify user but did not seemed necessary, anyhow it's useful for debug
      }, 3000);

      $.ajax({
        url: wiki,
        dataType: "jsonp",
        success: function(response) {
          var wikiTag = document.getElementById('wiki');
          for (var page in response.query.pages) {
            if (response.query.pages[page].extract === undefined || response.query.pages[page].extract === "") {

            }else {
                wikiTag.innerHTML = '<span>' + response.query.pages[page].extract.substring(0, 60) +
                "..." + '</span><a style="display: block;" href=http://en.wikipedia.org/?curid=' + response.query.pages[page].pageid +
                ' target="_blank">read more on wikipedia</a>';
            }
          }
          clearTimeout(wikiTimeOut);
        }
      });
    }


     /**
       * Triggers click event to markers when list item is clicked
    */

    self.clickMarker = function(place) {
      var name = place.name.toLowerCase();
      myMaps.markers.forEach(function(marker) {  
        if (marker.title.toLowerCase() === name) {
          google.maps.event.trigger(marker, 'click');
        }
      });
    };

    /**
      Based on which the icon is pressed, map API nearby search is called with altered categories
    */
    $('#filters').on('click', 'button', function () {
       
      // self.places([]);
       marker_animation = google.maps.Animation.DROP;
       var rawCategory    = $(this).children('img').attr('src').split("/").slice(-1)[0].split("-").slice(0,1)[0];
       function Category(value){
          if (value.toLowerCase().indexOf(rawCategory.substring(0, 4)) != -1) return value;
       };
       myCategories = mapPlaceTypes.filter(Category);
       myMaps.nearbySearch(map.getCenter());
    });


    /**
       * Resets categories on hitting refresh button on .btn-toolbar and
       * re-request Nearby places with google API
    */
    $('#reset').on('click', function() {

      // self.places([]);
      myCategories = [];
      myMaps.nearbySearch(map.getCenter());

    });

    $('#prev-list').children().hide();    //hide navbuttons for mobile slider
    $('#next-list').children().hide();

    $('#prev-list').children().click(function() {
      /**
       * Handle mobile previous navButton.
       */
      var number = $('.infolist').scrollLeft() / (winWidth - 26);
      if (number === parseInt(number, 10)) {
        mobilSlider(-1);
      } else {
        mobilSlider(0);
      }
    });

     /**
       * Handle mobile next navButton.
     */
    $('#next-list').children().click(function() {
     
      var number = $('.infolist').scrollLeft() / (winWidth - 26);
      if (number === parseInt(number, 10)) {
        mobilSlider(1);
      } else {
        mobilSlider(0);
      }
    });

    function mobilSlider(direction) {
      /**
       * Animates slider based on direction input.
       */
      var $infolist = $('.infolist');
      var dist = $('.infolist').scrollLeft();
      var placeIndex = (parseInt(dist / (winWidth  - 26)));
      placeIndex += direction;

      $infolist.animate({
      scrollLeft: placeIndex * winWidth - placeIndex * 26
    }, 1000);
    }

    $('.infolist').scroll(function() {
      /**
       * Hide/show navButtons based on slider position.
       */
      var placeCount = $(this).children('li').length;
      if ($(this).scrollLeft() < winWidth / 3) {
        $('#prev-list').children().hide();
      } else if ($(this).scrollLeft() > (placeCount - 2) * winWidth) {
        $('#next-list').children().hide();
      } else {
        $('#prev-list').children().show();
        $('#next-list').children().show();
      }
    });

    screenResize();
    $( window ).resize(function() {
      screenResize();
    });

    function screenResize() {
      /**
       * Transforms infolist to slider depending on screen size.
       */
      if ($( window ).width() < 800) {
        $('#next-list').children().show();
        $('.row').css('width', winWidth);
        $('.col-md-8').css('width', winWidth - 2 * ($('.navigator').width() + 26));
      }
    }

    var lastScrollValue = 0;
    var $infolist = $('.infolist');
    setInterval(function(){
      /**
       * Checking mobilSlider position every 1200ms and move it to next item found if moved and out of position.
       */
      var placeCount = $infolist.children('li').length;
      var currentScrollValue = $infolist.scrollLeft() / (winWidth - 26);
      if (currentScrollValue > placeCount - 2) {
        return;
      }
      if (currentScrollValue !== parseInt(currentScrollValue, 10)) {
        if (currentScrollValue < lastScrollValue) {
          mobilSlider(0);
        } else if (currentScrollValue > lastScrollValue) {
          mobilSlider(1);
        }
        lastScrollValue = Math.round(currentScrollValue);
      }
    }, 1200);
  }

  ko.applyBindings(new ViewModel());
  $('#hide').click(function() {
    /**
     * Handle .btn-toolbar click events.
     */
      var glyph = '', currentGlyph = $(this).children('span').attr('class');
      if (currentGlyph.slice(29) === 'left') {
        glyph = currentGlyph.replace('left', 'right');
      }
      else {
        glyph = currentGlyph.replace('right', 'left');
      }

      $(this).siblings('div').animate({width: "toggle"}, 500);
      $(this).children('span').attr('class', glyph);
    });
});
