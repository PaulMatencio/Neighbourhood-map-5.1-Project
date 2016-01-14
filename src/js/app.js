$(function() {

  function ViewModel() {

    var self = this;
    var myMaps           = new gMaps(mapOptions,mapStyle);
    var map              = myMaps.map;
    var infoWindow       = myMaps.infoWindow;
    var position         = myMaps.getCurrentLocation();
    var marker_animation = myMaps.marker_animation;

    self.nearByPlaces = ko.observableArray([]);    // ko array for object returned by google map places API nearby search service
    self.showResults  = ko.observable(true);       // boolean to hide or show the places returned by google Map places API nearby search services
    self.placeReviews = ko.observableArray([]);    // ko array for place review objects returned by google map places API getDetails() service
    self.placePhotos  = ko.observableArray([]);    //ko array for place photo urls returned by google map places API getDetails() service
    self.placeInFocus = ko.observable();           //place object container when opening photos and reviews via infowindows
    self.nytarticles  = ko.observableArray([]);
    self.foursquarePlaces = ko.observableArray([]); //Array for foursquare API objects

    myMaps.self = self;

    var nyturl = "http://api.nytimes.com/svc/search/v2/articlesearch.json?";
    var nytArtSearchKey= "befcd9ed183aa5edba4a379ed537e27f:10:73683129";

    /**
      return the address of the place
      used by ko to display rating in the nearbyplaces
    **/
    self.getAddress = function(place) {
      if (place.vicinity) {
        var idx = place.vicinity.indexOf(",");
        return  place.vicinity.slice(0,idx);
      } else {
        return place.formatted_address;
      }
    };

    /**
      hide/show  the places  returned by google Map places API nearby search services
      This showResults is used by the data-bind: "invisible" of the result  <div>
    **/
    self.toggleResults = function() {
      if (self.showResults() == true) {
        self.showResults(false);
      } else self.showResults(true);
    };

    /**
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
       * The @function rateStar() chains together the rating stars based on place rating.
       used by ko to control rating display
    */

    self.rateStar = function(rating) {
      var fullstar = Math.round(rating),
          halfstar = rating - fullstar,
          stars = [];
      var emptystar = (halfstar > 0 ? 4-fullstar: 5-fullstar );
      for (var i = 0; i < fullstar; i++) {
        stars.push({"star" : "images/full-star.png"});
      }
      if (halfstar > 0) {
        stars.push({"star" : "images/half-star.png"});
      }
      for (i = 0; i < emptystar; i++){
        stars.push({"star" : "images/empty-star.png"});
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


    myMaps.nearbySearch(position);
    myMaps.initAutocomplete();


    self.getWebsite = function(place) {

      if (place.website) {
        return place.website;
      } else {
        return "";
      }
    };

    self.clickMarker = function(place) {
      var name = place.name.toLowerCase();
      myMaps.markers.forEach(function(marker) {
        if (marker.title.toLowerCase() === name) {
          google.maps.event.trigger(marker, 'click');
        }
      });
    };

   self.getNytArticle = function(place) {
      /*
      var $nytHeaderElem = $('#nytimes-header') ;
      var $nytElem = $('#nytimes-articles');
      $nytElem.text("");
      */
      console.log(place);
      var url = nyturl;
      var query = place.formated_address;
      var filter ="";
      var wikiRequestTimeout = setTimeout( function(){
        // $nytElem.text("failed to query New York times resources");
        console.log("failed to query New York times resources");
      },5000);

       $.getJSON(url, {
         "q": query,
         "fq" : filter,
         "page": 0,
          "sort": "newest",
         "hl": true,
          "api-key": nytArtSearchKey
      })
       .done (function(data) {
        self.nytarticles([]);
        if (data.status == "OK") {
           $.each(data.response.docs, function(key,value) {
            var headline = value.headline.main ;
            if (headline != null) {
              self.nytarticles().push(headline);
             // items.push(HTMLarticle.replace("#",value.web_url).replace("%data%",headline));
             //self.nytarticles(headline)
           }
          });
           console.log(self.nytarticles());
        };
        /*
        $nytElem.append(items);
        $nytHeaderElem.text("New York Times Articles about " + query);
        */
        clearTimeout(wikiRequestTimeout);
      })
     .fail (function(e){
          console.log("New York Times Articles could bot be loaded");
          // $nytHeaderElem.text("New York Times Articles could bot be loaded");
      });
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
      myCategories = [];
      myMaps.nearbySearch(map.getCenter());
    });
};

ko.applyBindings(new ViewModel());

  /**
     * Handle .btn-toolbar click events.
  */
$('#hide').click(function() {
      var glyph = '', $currentGlyph = $(this).children('span').attr('class');
      if ($currentGlyph.slice(29) === 'left') {
        glyph = $currentGlyph.replace('left', 'right');
      }
      else {
        glyph = $currentGlyph.replace('right', 'left');
      }

      $(this).siblings('div').animate({width: "toggle"}, 500);
      $(this).children('span').attr('class', glyph);
    });
});
