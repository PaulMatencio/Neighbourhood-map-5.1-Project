$(function() {

  function ViewModel() {

    var self = this;
    /*
      init Google Map
    */

    var myMaps = new gMaps(mapOptions, mapStyle);
    var map = myMaps.map;
    var infoWindow = myMaps.infoWindow;
    var position = myMaps.getCurrentLocation();
    var marker_animation = myMaps.marker_animation;

    /*
    create KO observable
    */

    self.nearByPlaces = ko.observableArray([]); // ko array for object returned by google map places API nearby search service
    self.showResults = ko.observable(true); // boolean to hide or show the places returned by google Map places API nearby search services
    self.placeReviews = ko.observableArray([]); // ko array for place review objects returned by google map places API getDetails() service
    self.placePhotos = ko.observableArray([]); //ko array for place photo urls returned by google map places API getDetails() service
    self.placeInFocus = ko.observable(); //place object container when opening photos and reviews via infowindows
    self.nytarticles = ko.observableArray([]); //ko array for place new york times artcicle (search API)
    self.nytInFocus = ko.observable();
    self.wikiarticles = ko.observableArray([]); //ko array for place wikipedia  artcicle  ( opensearch API)
    self.wikiInFocus = ko.observable();
    self.streetView = ko.observable(); // photo returned by streetview APU
    self.noimage = ko.observable();    // used for the attribute alt= of <img> to handle street view errors.

    myMaps.self = self;

    var nyturl = "http://api.nytimes.com/svc/search/v2/articlesearch.json?",
      streetViewApiKey = "AIzaSyAUYlUoaLYjM8hidnMVQ05zXiEXJ87dFiY",
      nytArtSearchKey = "befcd9ed183aa5edba4a379ed537e27f:10:73683129",
      wikiOpenSearchURL = "http://en.wikipedia.org/w/api.php?action=opensearch&search=%data%&format=json&callback=wikiCallback",
      wikiarticle = 'http://fr.wikipedia.org/wiki/',
      streeViewURL = "http://maps.googleapis.com/maps/api/streetview?";

    /**
      nytArtSearchKey = "befcd9ed183aa5edba4a379ed537e27f:10:73683129",
      streetViewApiKey = "AIzaSyAUYlUoaLYjM8hidnMVQ05zXiEXJ87dFiY",
      wikiOpenSearchURL = "http://en.wikipedia.org/w/api.php?action=opensearch&search=%data%&format=json&callback=wikiCallback",
      streeViewURL = "http://maps.googleapis.com/maps/api/streetview?";
    **/
    /**
      return the address of the place
      used by ko to display rating in the nearbyplaces
    **/

    self.getAddress = function(place) {
      if (place.vicinity) {
        var idx = place.vicinity.indexOf(",");
        return place.vicinity.slice(0, idx);
      } else {
        return place.formatted_address;
      }
    };

    self.getCity = function(place) {
      var city = place.formatted_address.split(" ");
      return city.slice(-2);
    }

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
      self.nearByPlaces().forEach(function(place, idx) {
        if (idx) {
          iconSet.add(place.icon);
        }
      });
      iconSet.forEach(function(icon) {
        iconDict.push({
          "icon": icon
        });
      });
      return iconDict.slice(0, 19); // limit the number of icons to 20
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

    /*  */

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

    /* There a strange behaviour between Knockout.js and observable array with Ajax that is described below:

       Eventhougth the KO modelview  object contains the observable array "nytarticles", when I want to access
       the observable  array, I got an error that the array is undefined
       As for instance
       console.log(self)  => modelview object which contains the function nyarticles()
       console.log(self.nytarticles())  ==> undefined
       self.nytarticles.push(headline)  ==> Error  ( can't push on undefined )

       A mean to circumvent this issue is  to use a javascript array "articles" and  assign the javascript array to the ko observable array

      var articles = [];
      loop :  articles.push(xxx);
      end_of_loop:self.nytarticles( articles)

    */
    self.getNytArticle = function(place) {

      var city = self.getCity(place),
        url = nyturl;
      var query = city[1], // country
        filter = city[0]; // city
      var articles = [];
      var nytTemplate = $('script[data-template="nytimes"]').html();
      self.nytInFocus("about " + filter + " " + query);
      var wikiRequestTimeout = setTimeout(function() {
        articles.push("<p>failed to query New York times resources</p>");
      }, 5000);

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

    /*


    */
    self.openSearchWikipedia = function(place) {

      var city = self.getCity(place),
        articles = [];
      // var query = city[0] + " " + city[1];
      var query = city[0];
      var url = wikiOpenSearchURL.replace("%data%", query);
      var wikiarticle = 'http://fr.wikipedia.org/wiki/';
      var wikiTemplate = $('script[data-template="wiki"]').html();
      self.wikiInFocus("about " + query);
      var wikiRequestTimeout = setTimeout(function() {
        articles.push("<p>failed to query wiki resources</p>");
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
          articles.push("<p>wiki pages could not be found</p>");
          this.wikiarticles(articles);
        }.bind(self)); /* "self" is passed to the function as "this" */
    };


    self.getStreetView = function(place) {
      var street = streeViewURL + 'size=600x400&location=' + place.formatted_address;
      self.noimage = "No image for " + place.formatted_address;
      return street;

    };

    /**
      Based on which icon is pressed, map API nearby search is called with altered categories
    */
    $('#filters').on('click', 'button', function() {

      // self.places([]);
      marker_animation = google.maps.Animation.DROP;
      var rawCategory = $(this).children('img').attr('src').split("/").slice(-1)[0].split("-").slice(0, 1)[0];

      function Category(value) {
        if (value.toLowerCase().indexOf(rawCategory.substring(0, 4)) != -1) return value;
      };
      myCategories = mapPlaceTypes.filter(Category);
      // save filters to local storage to be reused
      localStorage.myCategories = JSON.stringify(myCategories);
      myMaps.nearbySearch(map.getCenter());
    });

    /**
     * Resets categories on hitting refresh button on .btn-toolbar and
     * re-request Nearby places with google API
     */
    $('#reset').on('click', function() {
      // reset the filters
      myCategories = [];
      localStorage.myCategories = JSON.stringify(myCategories);
      myMaps.nearbySearch(map.getCenter());
    });
  };

  ko.applyBindings(new ViewModel());

  /**
   * Handle .btn-toolbar click events.
   */
  $('#hide').click(function() {
    var glyph = '',
      $currentGlyph = $(this).children('span').attr('class');
    if ($currentGlyph.slice(29) === 'left') {
      glyph = $currentGlyph.replace('left', 'right');
    } else {
      glyph = $currentGlyph.replace('right', 'left');
    }

    $(this).siblings('div').animate({
      width: "toggle"
    }, 500);
    $(this).children('span').attr('class', glyph);
  });
});