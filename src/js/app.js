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
    self.nytInFocus = ko.observable(); //
    self.wikiarticles = ko.observableArray([]); //ko array for place wikipedia  artcicle  ( opensearch API)
    self.wikiInFocus = ko.observable();
    self.streetView = ko.observable(); // photo returned by streetview APU
    self.noimage = ko.observable();    // used for the attribute alt= of <img> to handle street view errors.
    self.showView = ko.observable(false);
    self.currentPhoto = ko.observable();
    self.currentIndex = ko.observable(0);

    myMaps.self = self;

    var nyturl = "http://api.nytimes.com/svc/search/v2/articlesearch.json?",
      streetViewApiKey = "AIzaSyAUYlUoaLYjM8hidnMVQ05zXiEXJ87dFiY",
      nytArtSearchKey = "befcd9ed183aa5edba4a379ed537e27f:10:73683129",
      wikiOpenSearchURL = "http://en.wikipedia.org/w/api.php?action=opensearch&search=%data%&format=json&callback=wikiCallback",
      //wikiOpenSearchURL = "http://en.wikipedia.org/w/api.php?action=openseach&search=%data%&format=json&callback=wikiCallback",
      wikiarticle = 'http://fr.wikipedia.org/wiki/',
      streeViewURL = "http://maps.googleapis.com/maps/api/streetview?";

    /*
    *   control the display of wiki page
    */
    self.okwiki = ko.computed(function() {
      if (self.wikiarticles().length > 0 ) {
        return true;
      } else return false;
    });

    self.closeWiki = function() {
       self.wikiarticles([]);
    };

    /*
    *   control the display of new york times page
    */
    self.oknyt = ko.computed(function() {
      if (self.nytarticles().length > 0 ) {
        return true;
      } else return false;
    });

    self.closeNyt = function() {
       self.nytarticles([]);
    };


    /*
    *   control the display of reviews page
    */
    self.okreview = ko.computed(function() {
      if (self.placeReviews().length > 0 ) {
        return true;
      } else return false;
    });

    self.closeReview = function() {
       self.placeReviews([]);
    };

    /*
    *   control the display of photo page page
    */
    self.okphoto = ko.computed( function() {
      if (self.placePhotos().length > 0) {
        return true;
      } else return false;
    });

    self.numberPhotos = ko.computed(function() {
      return self.placePhotos().length;
    });

    self.photoIndex = ko.computed(function() {
      return self.currentIndex()+1;
    });

    self.closePhoto = function() {
      self.placePhotos([]);
      self.currentIndex(0);
    }


    /*  definition of the functions  of the Viewmodel
    *
       getAdddress()
       getLocality()
       toggleResults()
       rateStar()
       formattedtype()
       photoForward()
       photBackward()
       navgigate()
       getNytArticle()
       getWikiArticle()

    */



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
      console.log(place);
      var add = place.adr_address,
        clocality = 'class="locality">',
        ccountry = 'class="country-name">',
        cregion  = 'class="region">',
        start = 0, location = {},
        idx2 = 0;
      //console.log(add);
      // extract the locailty
      idx1 = add.indexOf(clocality)
      if (idx1 >0) {
        start = idx1+clocality.length;
        idx2 = add.indexOf('</span>',start) ;
        location.locality= add.slice(start,idx2);
      };
      // extract region
      idx1 = add.indexOf('class="region"',idx2+7);
      if (idx1 >0) {
        start = idx1+cregion.length;
        idx2 = add.indexOf('</span>',start)
        location.region = add.slice(start,idx2);
      };
      // extract the country-name
      idx1 = add.indexOf('class="country-name"',idx2+7);
      if (idx1 >0) {
        start = idx1+ccountry.length;
        idx2 = add.indexOf('</span>',start)
        location.country = add.slice(start,idx2);
      };
      //console.log(location);
      return location;
    }

    /**
    <span class="street-address">97 Song Hành Quốc Lộ 22</span>, <span class="region">Tân Hưng Thuận</span>, <span class="locality">12</span>, <span class="region">Hồ Chí Minh</span>, <span class="country-name">Vietnam</span>
      hide/show  the list of places returned by google Map places API nearby search services
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

    /*
    self.showerror = ko.computed(function() {
      console.log(self.aerror().length);
      return true;
    });
    */

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

    /*
    self.getWebsite = function(place) {

      if (place.website) {
        return place.website;
      } else {
        return "";
      }
    };
    */

    self.clickMarker = function(place) {
      var name = place.name.toLowerCase();
      myMaps.markers.forEach(function(marker) {
        if (marker.title.toLowerCase() === name) {
          google.maps.event.trigger(marker, 'click');
          if (window.innerWidth < 750) {
            self.showResults(false);
          }
        }
      });
    };

    self.photoBackward = function() {
      navigate(-1);
    }

    self.photoForward = function() {
      navigate(1);

    }

    function navigate(direction){
      var numberPhotos = self.numberPhotos();
      var current = self.currentIndex();
      var next = (current + direction) % numberPhotos;
      if (next < 0) {
        next = numberPhotos - 1;
      } ;
      self.currentPhoto(self.placePhotos()[next]);
      self.currentIndex(next);
    }


    /*  Serach for   New york times articles
      query : City
      filter : Country

    There a strange behaviour between Knockout.js and observable array with Ajax that is described below:

       Eventhougth the KO modelview  object contains the observable array "nytarticles", when I want to access
       the observable  array, I got an error that the array is undefined
       As for instance
       console.log(self)  => modelview object which contains the function nytarticles()
       console.log(self.nytarticles())  ==> undefined
       self.nytarticles.push(headline)  ==> Error  ( can't push on undefined )

       A mean to circumvent this issue is  to use a javascript array "articles" and  assign the javascript array to the ko observable array

      var articles = [];
      loop :  articles.push(xxx);
      end_of_loop:self.nytarticles( articles)

    */

    self.getNytArticle = function(place) {
      self.nytarticles([]);
      var location = self.getLocality(place),
        url = nyturl;
      var query = location.locality + " ";
      if (location.region) {
         query += location.region;
      }
      //var query = location.locality;
      var  filter = location.country;
      var articles = [];
      var nytTemplate = $('script[data-template="nytimes"]').html();
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
            console.log(this,self);
            $.each(data.response.docs, function(key, value) {
              var headline = value.headline.main;
              if  (headline != null) {
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
        Search wikipedia for the  City
    */
    self.openSearchWikipedia = function(place) {
      self.wikiarticles([]);
      var location = self.getLocality(place),
        articles = [];
      var query = location.locality + " ";
      if (location.region) {
         query += location.region;
      };
      var url = wikiOpenSearchURL.replace("%data%", query);
      var wikiarticle = 'http://fr.wikipedia.org/wiki/';
      var wikiTemplate = $('script[data-template="wiki"]').html();
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
          console.log(this.wikiarticles().length);
          clearTimeout(wikiRequestTimeout);
        }.bind(self)) /* "self" is passed to the function as "this" */
        .fail(function(e) {
          articles.push("<p>Wiki could bot be loaded</p>");
          this.wikiarticles(articles);
        }.bind(self)); /* "self" is passed to the function as "this" */
    };



    /*
       Display the view of the street based on the formatted address of the place
       if street view fail, text Sorry .... will replaced the alt= attribute of the <img> element
    */

    self.getStreetView = function(place) {
      self.streetView(streeViewURL + 'size=600x400&location=' + place.formatted_address);
      self.noimage = "Sorry no image for " + place.formatted_address;
      self.showView(true);
    };

    self.closeView = function(){
      self.showView(false);
    }

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