$(function() {

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
        /* map array of passed in locations to an observableArray of location objects
        self.myLocations = ko.observableArray(myLocations.map(function (location) {
            return new Location(location);
        }))
         */

        self.showLocation = ko.observable(false);
        self.showResults = ko.observable(true); // boolean to hide or show the places returned by google Map places API nearby search services
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

        self.showMode = ko.observable('all');

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
            this.savePlaces= [];
            this.markers = [];
            this.self = self;
        };

        /* initialize the self.myLocations based on the locations array
         *  locations is the array of the hard codes location
         */
        self.initLocations = function(locations) {
            self.myLocations([]);
            locations.forEach(function(location) {
                self.myLocations().push(new Location(location));
            });
        }

        // initialize the observable self.myLocations Array
        self.initLocations(myLocations);

        /*
         * Complete the map initialization
         * initAutocomplete
         */
        var myMaps = new gMaps();
        var infoWindow = myMaps.infoWindow;
        var marker_animation = myMaps.marker_animation;
        myMaps.initAutocomplete();
        myMaps.self = self;

        /* define third parties  servies url */
        var nyturl = "http://api.nytimes.com/svc/search/v2/articlesearch.json?",
            streetViewApiKey = "AIzaSyAUYlUoaLYjM8hidnMVQ05zXiEXJ87dFiY",
            nytArtSearchKey = "befcd9ed183aa5edba4a379ed537e27f:10:73683129",
            wikiOpenSearchURL = "http://en.wikipedia.org/w/api.php?action=opensearch&search=%data%&format=json&callback=wikiCallback",
            //wikiOpenSearchURL = "http://en.wikipedia.org/w/api.php?action=openseach&search=%data%&format=json&callback=wikiCallback",
            wikiarticle = 'http://fr.wikipedia.org/wiki/',
            streeViewURL = "http://maps.googleapis.com/maps/api/streetview?";


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
            var $winWidth = $(window).width();
            if ($winWidth > 800) {
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
            if (self.showLocation() == true) {
                self.showLocation(false);
            } else self.showLocation(true);
        };

        /* right now, only the default option is supported
            Return all the locations which are selected
            filtered was already done during the initLocation function
        */
        self.filteredLocations = ko.computed(function() {
            switch (self.showMode()) {
                case 'selected':
                    return self.myLocations().filter(function(location) {
                        return location.selected();
                    });
                default:
                    return self.myLocations();
            }
        }, myMaps);


        /* select or unselect a location
         * user can check /uncheck (check-box)  or click the check box label to select/unselect  a location
         *
         */
        self.selectItem = function(item) {
            // toogle selected status
            if (item.selected() == true) {
                item.selected(false);
            } else item.selected(true);

            if (!item.selected()) {
                item.savePlaces = item.nearByPlaces();
                item.nearByPlaces([]);
                item.createMarkers(item.nearByPlaces());
            } else {
                 item.nearByPlaces(item.savePlaces);
                 item.createMarkers(item.nearByPlaces());
            }
        }.bind(this);

        /* computed observable to return the City name of a location */
        /* it is used to display the header of the list view  of the places */
        self.myCity = ko.computed(function() {
            if (self.myLocations().length > 0) {
                var city = self.myLocations()[0].city;
                return self.myLocations()[0].city();
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
            }
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
        self.getPlaces = function() {
            myCategories = [];
            // get the keywords from the input-key
            var keywords = self.keyword().trim();
            // Searchbox will handle all keywords start with :
            if (keywords.substring(0, 1) == ":") {
                return;
            }
            var categories = keywords.split(" ");
            // map input keyword  to map place types
            categories.forEach(function(cat) {
                if (cat.substring(0, 5) == "clini") cat = "hospital";
                if (cat == "fitness") cat = "gym";
                if (cat.substring(0, 3) == "eat") cat = "food";
                if (cat.substring(0, 5) == "metro") cat = "subway";
                mapplacetype = mapPlaceTypes.filter(getCat);
                mapplacetype.forEach(function(type) {
                    myCategories.push(type);
                });

                function getCat(maptype) {
                    return stringStartsWith(maptype, cat);
                };
            });

            // display near by places returned by the
            if (myCategories.length > 0) {
                // self.nearByPlaces([]);
                self.myLocations().forEach(function(location) {
                    // for the display places
                    self.displayLocation(location);
                });
                myMaps.setCenter(self.myLocations()[0]);
            }
        };

        /* Init the self.myLocations() observable array
        *  For each new location (only one for for the moment)
        *  Used by the search box when keyword start with a semi colon :
        *
        */
        self.setnewLocation = function(location) {
            myLocations.push(location);
            self.initLocations(myLocations);
            self.myLocations().forEach(function(location){
                self.displayLocation(location)  ;
            });

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
            if (self.showResults() == true) {
                self.showResults(false);
            } else self.showResults(true);
        };

        /**
         *   Add the firt 10 icons of the nearby places to the  iconDict arrray
         *   which are displayed in the btn-toolbar
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
            return iconDict.slice(0, 9);
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

        /*  Serach for   New york times articles
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
            var filter = location.country;
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
                    // console.log(this.wikiarticles().length);
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

        self.closeView = function() {
            self.showView(false);
        }

        $(window).resize(function() {
            showResults();
        })

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
            self.myLocations().forEach(function(location) {
                // nearby places search for the location and display the results
                self.displayLocation(location);
            });
        };

        /**
         * Resets categories on hitting refresh button on .btn-toolbar and
         * re-request Nearby places with google API
         **/
        self.resetIcons = function() {
            myCategories = [];
            //localStorage.myCategories = JSON.stringify(myCategories);
            self.myLocations().forEach(function(location) {
                self.displayLocation(location);
            });
        };

        self.hideIcons = function() {

        }

    }; // end model

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