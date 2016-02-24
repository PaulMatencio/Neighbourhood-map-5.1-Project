function inherit(e,t){e.prototype=Object.create(t.prototype),e.prototype.Constructor=e}function gMaps(){this.markers=[],this.infoWindow=new google.maps.InfoWindow({pixelOffset:new google.maps.Size(-23,-10),maxWidth:300}),this.marker_animation=google.maps.Animation.DROP,this.map=map}function ViewModel(){function e(e){return{init:function(t,o,n,a,r){var i,s;i=function(t,n){n.keyCode===e&&o().call(this,t,n)},s=function(){return{keyup:i}},ko.bindingHandlers.event.init(t,s,n,a,r)}}}function t(e){gMaps.call(this,e),this.name=ko.observable(e.name),this.city=ko.observable(e.city),this.mapcenter=ko.observable(e.mapcenter),this.selected=ko.observable(e.selected),this.nearByPlaces=ko.observableArray([]),this.savePlaces=[],this.markers=[],this.marker=null,this.self=i}function o(e,t){return e.slice(0,t.length)==t}function n(e){var t=i.placePhotos().length,o=i.currentIndex(),n=(o+e)%t;0>n&&(n=t-1),i.currentPhoto(i.placePhotos()[n]),i.currentIndex(n)}function a(){if(i.showResults(!0),0===i.numPlaces())return void i.showResults(!1);var e=window.innerWidth;e>750?i.showResults(!0):i.showResults(!1)}var r=13;ko.bindingHandlers.enterKey=e(r);var i=this;i.myLocations=ko.observableArray([]),i.currentLocation=ko.observable(null),i.newLocation=ko.observable(),i.showLocation=ko.observable(!1),i.showCategory=ko.observable(!1),i.jqload=ko.observable(!1),i.showIcons=ko.observable(!1),i.controlIcon=ko.observable("▲"),i.showResults=ko.observable(!0),i.placeReviews=ko.observableArray([]),i.placePhotos=ko.observableArray([]),i.placeInFocus=ko.observable(),i.nytarticles=ko.observableArray([]),i.nytInFocus=ko.observable(),i.wikiarticles=ko.observableArray([]),i.wikiInFocus=ko.observable(),i.streetView=ko.observable(),i.showView=ko.observable(!1),i.currentPhoto=ko.observable(),i.currentIndex=ko.observable(0),i.keyword=ko.observable(),i.mapPlaceTypes=ko.observableArray(mapPlaceTypes),i.myCategories=ko.observableArray(myCategories),i.infoWindow=ko.observable(l),i.myError=ko.observable(!1),i.alertHeader=ko.observable("Error message, please aknowledge"),i.alertBody=ko.observable(""),i.alertFooter=ko.observable(""),i.prevMarker=ko.observable(null),i.rangeValue=ko.observable(2),inherit(t,gMaps),i.initLocations=function(e){i.myLocations([]),e.forEach(function(e){var o=new t(e);i.myLocations().push(o),o.markLocation(),o.selected()||o.marker.setMap(null)})},i.initLocations(myLocations);var s,c,l;s=new gMaps,l=s.infoWindow,i.infoWindow(l),c=s.marker_animation,s.initAutocomplete(),s.self=i;var u="http://maps.googleapis.com/maps/api/streetview?";map.addListener("dblclick",function(e){var t=e.latLng,o=e.Sa.x.toString().slice(0,8),n=e.Sa.y.toString().slice(0,8),a="lat:"+o+"-lng:"+n,r={};r.name=a,r.city=a,r.mapcenter={lat:t.lat(),lng:t.lng()},r.selected=!0,i.addLocation(r)}),i.customAlert=function(e){i.myError(!0),i.alertBody(e)},i.errorOK=function(){i.myError(!1)},i.displayLocation=function(e){e.selected()&&e.nearbySearch()},i.hideLocation=function(){i.showLocation(!1)},i.toggleLocation=function(){i.showLocation(!i.showLocation()),i.showCategory(!1)},i.toggleCategory=function(){i.showCategory(!i.showCategory()),i.showLocation(!1)},i.filteredLocations=ko.computed(function(){return i.myLocations()},s),i.selectLocation=function(e){if(e.selected(!e.selected()),i.showLocation(!1),e.selected()){e.markLocation();var t=e.name(),o={};o=i.myLocations().filter(function(e){return e.name()!=t}),o.unshift(e),i.myLocations(o),i.currentLocation(e)}else e.nearByPlaces([]),e.marker&&e.marker.setMap(null),i.currentLocation(null),i.setCenter();e.createMarkers(e.nearByPlaces()),a()},i.myCity=ko.computed(function(){var e=i.myLocations().filter(function(e){return e.selected()});return e.length>0?e[0].city().toUpperCase():""}),i.closeWiki=function(){i.wikiarticles([])},i.closeNyt=function(){i.nytarticles([])},i.closeReview=function(){i.placeReviews([])},i.closePhoto=function(){i.placePhotos([]),i.currentIndex(0)},i.photoIndex=ko.pureComputed(function(){return i.currentIndex()+1}),i.getPlace=function(){i.showLocation(!1),i.showCategory(!1);var e=[],t=i.keyword().trim();if(t.length>0){if(":"===t.slice(0,1))return e=t.slice(1).split(delimiter),i.getPlaces(e),void i.keyword("");e=t.split(delimiter),e.length>=1&&i.myLocations().forEach(function(t){t.selected()&&t.getPlacename(e)})}else i.myLocations().forEach(function(e){e.selected()&&(e.nearByPlaces(e.savePlaces),e.createMarkers(e.nearByPlaces()))})},i.getPlaces=function(e){i.myCategories.removeAll(),e.forEach(function(e){function t(t){return o(t,e)}e=e.toLowerCase(),"clini"==e.substring(0,5)&&(e="hospital"),"fitness"==e&&(e="gym"),"eat"==e.substring(0,3)&&(e="food"),"metro"==e.substring(0,5)&&(e="subway"),mapplacetype=mapPlaceTypes.filter(t),mapplacetype.length>0&&(mapplacetype.forEach(function(e){myCategories.push(e)}),i.myCategories(myCategories))}),localStorage.myCategories=JSON.stringify(myCategories),i.setCenter()},i.addLocation=function(e){myLocations.unshift(e);var o=new t(e);i.myLocations.unshift(o),o.markLocation(),i.currentLocation(o),localStorage.myLocations=JSON.stringify(myLocations)},i.addaLocation=function(){},i.removeLocation=function(e){var t=e.name;e.selected()&&i.selectLocation(e),i.myLocations(i.myLocations().filter(function(e,o){return e.name!=t?e:void myLocations.splice(o,1)})),0===i.myLocations().length&&i.showLocation(!1),localStorage.myLocations=JSON.stringify(myLocations)},i.removeAllLocations=function(){i.myLocations().forEach(function(e){i.removeLocation(e)})},i.setCenter=function(){if(i.currentLocation())return void i.currentLocation().setCenter();var e=i.myLocations().filter(function(e){return e.selected()});e.length>0&&e[0].setCenter()},i.getAddress=function(e){if(e.vicinity){var t=e.vicinity.indexOf(",");return e.vicinity.slice(0,t)}return e.formatted_address},i.getLocality=function(e){var t=e.adr_address,o='class="locality">',n='class="country-name">',a='class="region">',r=0,i={},s=0;return idx1=t.indexOf(o),idx1>0&&(r=idx1+o.length,s=t.indexOf("</span>",r),i.locality=t.slice(r,s)),idx1=t.indexOf('class="region"',s+7),idx1>0&&(r=idx1+a.length,s=t.indexOf("</span>",r),i.region=t.slice(r,s)),idx1=t.indexOf('class="country-name"',s+7),idx1>0&&(r=idx1+n.length,s=t.indexOf("</span>",r),i.country=t.slice(r,s)),i},i.toggleResults=function(){i.showResults(!i.showResults()),0===i.numPlaces()&&i.showResults(!1),i.showCategory(!1),i.showLocation(!1)},i.icons=ko.computed(function(){var e=0,t=new Set,o=[];return i.myLocations().forEach(function(e){for(var o in e.nearByPlaces())o&&t.add(e.nearByPlaces()[o].icon)}),t.forEach(function(e){o.push({icon:e})}),e=window.innerWidth<750?7:Math.min(o.length,12),o.slice(0,e)}),i.numPlaces=ko.computed(function(){var e=0;return i.myLocations().forEach(function(t){t.selected()&&(e+=t.nearByPlaces().length)}),e}),i.rateStar=function(e){for(var t=Math.round(e),o=e-t,n=[],a=o>0?4-t:5-t,r=0;t>r;r++)n.push({star:"images/full-star.png"});for(o>0&&n.push({star:"images/half-star.png"}),r=0;a>r;r++)n.push({star:"images/empty-star.png"});return n},i.formattedType=function(e){var t=e.types[0].replace(/[_-]/g," ");return t.charAt(0).toUpperCase()+t.substr(1,t.length)},i.clickMarker=function(e){google.maps.event.trigger(e.marker,"click")},i.photoBackward=function(){n(-1)},i.photoForward=function(){n(1)},i.getStreetView=function(e){i.streetView(u+"size=600x400&location="+e.formatted_address),i.showView(!0)},i.closeView=function(){i.showView(!1)},i.myIcons=function(e){function t(e){var t=e.split("_")[0];return-1!=o.indexOf(t)?e:void 0}c=google.maps.Animation.DROP;var o=e.icon.split("/").slice(-1)[0].split("-").slice(0,1)[0];myCategories=mapPlaceTypes.filter(t),i.myCategories(myCategories),i.showLocation(!1),i.showCategory(!1),localStorage.myCategories=JSON.stringify(myCategories)},i.resetIcons=function(){i.keyword(""),myCategories=[],i.showCategory(!1),i.showLocation(!1),i.myCategories(myCategories),localStorage.myCategories=JSON.stringify(myCategories)},i.toggleIcons=function(){"▲"===i.controlIcon()?(i.controlIcon("▼"),i.showIcons(!0)):"▼"===i.controlIcon()&&(i.controlIcon("▲"),i.showIcons(!1))},i.rangeValue.subscribe(function(e){radius=unit*e}),window.onresize=function(){a(),i.showLocation(!1),i.showCategory(!1)},window.onload=function(){a()}}var mapPlaceTypes=["accounting","airport","amusement_park","aquarium","art_gallery","atm","bakery","bank","bar","beauty_salon","bicycle_store","book_store","bowling_alley","bus_station","cafe","campground","car_dealer","car_rental","car_repair","car_wash","casino","cemetery","church","city_hall","clothing_store","convenience_store","courthouse","dentist","department_store","doctor","electrician","electronics_store","embassy","establishment","finance","fire_station","florist","food","funeral_home","furniture_store","gas_station","general_contractor","grocery_or_supermarket","gym","hair_care","hardware_store","health","hindu_temple","home_goods_store","hospital","insurance_agency","jewelry_store","laundry","lawyer","library","liquor_store","local_government_office","locksmith","lodging","meal_delivery","meal_takeaway","mosque","movie_rental","movie_theater","moving_company","museum","night_club","painter","park","parking","pet_store","pharmacy","physiotherapist","place_of_worship","plumber","police","post_office","real_estate_agency","restaurant","roofing_contractor","rv_park","school","shoe_store","shopping_mall","spa","stadium","storage","store","subway_station","synagogue","taxi_stand","train_station","travel_agency","university","veterinary_care","zoo"],mapCenter={},myCategories=[],unit=500;radius=unit;var myLocations=[{name:"Notre Dame de Paris",city:"Paris France",mapcenter:{lat:48.852729,lng:2.350564},selected:!0},{name:"Eiffel Tower",city:"Paris France",mapcenter:{lat:48.858261,lng:2.294507},selected:!0},{name:"Porte d'Italie",city:"Paris France",mapcenter:{lat:48.819067,lng:2.36023},selected:!0},{name:"Place de la Nation",city:"Paris France",mapcenter:{lat:48.847895,lng:2.395984},selected:!1},{name:"Porte de la Chapelle",city:"Paris France",mapcenter:{lat:48.896748,lng:2.363993},selected:!1},{name:"Porte de Versailles",city:"Paris France",mapcenter:{lat:48.832568,lng:2.287193},selected:!1}],delimiter=" ";gMaps.prototype.markLocation=function(){var e=this.name(),t=new google.maps.LatLng(this.mapcenter().lat,this.mapcenter().lng),o=(window.mapBounds,new google.maps.Marker({map:map,position:t,title:e,draggable:!0}));this.marker=o,google.maps.event.addListener(o,"dblclick",function(){var e=this.self;e.removeLocation(this)}.bind(this))},gMaps.prototype.setCenter=function(){map.setCenter(new google.maps.LatLng(this.mapcenter().lat,this.mapcenter().lng)),map.setZoom(13)},gMaps.prototype.nearbySearch=function(){var e=this.self,t=new google.maps.places.PlacesService(this.map);t.nearbySearch({location:this.mapcenter(),radius:radius,types:e.myCategories()},this.getResults.bind(this))},gMaps.prototype.getResults=function(e,t,o){function n(e){return"political"==e}var a=new google.maps.LatLngBounds,r=this.self,i=[];if(t==google.maps.places.PlacesServiceStatus.OK){if(e.forEach(function(e){0===e.types.filter(n).length&&(i.push(e),a.extend(e.geometry.location))}),map.fitBounds(a),this.nearByPlaces(i),this.savePlaces=i,r.keyword()){var s=r.keyword().split(delimiter);this.getPlacename(s)}else this.createMarkers(this.nearByPlaces());r.numPlaces()>0&&r.showResults(!0)}else r.customAlert("Problem with Google map nearby place services");r.setCenter()},gMaps.prototype.initAutocomplete=function(){function e(){var e=this.self,t=e.newLocation();if(t.trim().length>0){var o=n.getPlaces(),a=o.length;if(a>=1){var r=o[0];if(!r.geometry)return void e.customAlert("map searchBox's returned place contains no geometry");this.mapCenter=r.geometry.location;var i={};i.name=r.formatted_address,i.city=r.formatted_address,i.mapcenter={lat:r.geometry.location.lat(),lng:r.geometry.location.lng()},i.selected=!0,e.addLocation(i)}else e.customAlert("map searchBox could not locate the new location");e.newLocation("")}}var t=this.map,o=document.getElementById("new-location"),n=new google.maps.places.SearchBox(o);t.addListener("bounds_changed",function(){n.setBounds(t.getBounds()),mapCenter=t.getCenter()}),n.addListener("places_changed",e.bind(this))},gMaps.prototype.removeMarkers=function(){this.markers.forEach(function(e){e.setMap(null)})},gMaps.prototype.createMarkers=function(e){var t=Math.sqrt(window.innerWidth)+24;this.removeMarkers(),this.markers=[],e.forEach(function(e){var o={url:e.icon,size:new google.maps.Size(t,t),origin:new google.maps.Point(0,0),anchor:new google.maps.Point(t/4,t/2),scaledSize:new google.maps.Size(t/2.8,t/2.8)},n=new google.maps.Marker({map:map,icon:o,title:e.name,animation:this.marker_animation,position:e.geometry.location}),a=window.innerWidth,r=window.innerHeight,i=150,s=-r/5;750>a&&(i=-30,s=-1*(r/2+40)),n.addListener("click",function(){var e=this.self,t=e.prevMarker();t&&t.setAnimation(null),null!==n.getAnimation()?n.setAnimation(null):(n.setAnimation(google.maps.Animation.BOUNCE),map.panTo(n.position),map.panBy(i,s),e.prevMarker(n))}.bind(this)),this.markers.push(n),e.marker=n,google.maps.event.addListener(n,"click",function(){this.addInfoWindow(e,n)}.bind(this))}.bind(this))},gMaps.prototype.addInfoWindow=function(e,t){var o=new google.maps.places.PlacesService(this.map),n=this,a=this.self,r=a.infoWindow(),i=window.innerWidth;a.showCategory(!1),a.showLocation(!1),o.getDetails({placeId:e.place_id},function(e,o){if(o===google.maps.places.PlacesServiceStatus.OK){var s;750>i&&a.showResults(!1),s=document.getElementById("review-long").innerHTML,s=s.replace(/{{opening}}/,n.getOpenings(e));var c=n.getWebsite(e),l=s.replace(/{{name}}/,e.name).replace(/{{formatted_address}}/,e.formatted_address).replace(/{{rating}}/,n.getRating(e)).replace(/{{photos}}/,n.getPhotoes(e));if(r.setContent(l.replace(/{{website}}/g,c).replace(/{{phone}}/,n.getPhone(e))),r.open(n.map,t),e.photos){var u=document.getElementById("photos");u.addEventListener("click",function(){a.placePhotos(e.photos),a.currentIndex(0),a.currentPhoto(a.placePhotos()[0])})}var m=document.getElementById("reviews");m&&m.addEventListener("click",function(){a.placeInFocus(e),e.reviews.forEach(function(e){""!==e.text&&a.placeReviews.push(e)})});var p=document.getElementById("nytLink");p&&a.jqload()&&p.addEventListener("click",function(){a.getNytArticle(e)});var d=document.getElementById("wikiLink");d&&a.jqload()&&d.addEventListener("click",function(){a.openSearchWikipedia(e)});var g=document.getElementById("streetLink");g&&g.addEventListener("click",function(){a.getStreetView(e)})}}),google.maps.event.addListener(r,"closeclick",function(){n.markers.forEach(function(e){e.setAnimation(null)}.bind(this))})},gMaps.prototype.getWebsite=function(e){return e.website?e.website:""},gMaps.prototype.getRating=function(e){var t=this.self,o="",n=t.rateStar(e.rating);if(e.rating){o='<div><span style="color: #df6d15; padding-right: 3px;">'+e.rating+"</span>";for(var a in n)a&&(o+='<img class="rate-star" src="'+n[a].star+'" />');return o+='<span class="rating"> Users rating:'+e.user_ratings_total+"</span>",o+'<a id="reviews"  href="#"">Reviews,</a>'}return'<span style="font-style: italic;">no rating available</span>'},gMaps.prototype.getPhone=function(e){return e.international_phone_number?e.international_phone_number:"<span>Location:"+e.geometry.location+"</span>"},gMaps.prototype.getPhotoes=function(e){return e.photos&&e.photos.length>1?'<a style="margin-left: 5px;" id="photos" href="#"">Photos</a>':'<div id="photos"></div></div>'},gMaps.prototype.getOpenings=function(e){var t;try{t="Mon-Sat:"+e.opening_hours.periods[1].open.time+"-"+e.opening_hours.periods[1].close.time+" Sun:"+e.opening_hours.periods[0].open.time+"-"+e.opening_hours.periods[0].close.time}catch(o){t="Work time not available"}return t},gMaps.prototype.getPlacename=function(e){var t=[];e.forEach(function(e){e=e.trim(),e.length>0&&this.savePlaces.forEach(function(o){o.name.toLowerCase().indexOf(e)>=0&&t.push(o)})}.bind(this)),this.nearByPlaces(t),console.log(t),this.createMarkers(this.nearByPlaces())},gMaps.prototype.pinLocations=function(e){var t=new google.maps.places.PlacesService(this.map);e.forEach(function(e){console.log(e);var o={query:e.name};t.textSearch(o,this.searchResults)})},gMaps.prototype.searchResults=function(e,t){if(t==google.maps.places.PlacesServiceStatus.OK){var o=e[0];o.geometry.location,o.formatted_address;this.createLocMarker(o)}},gMaps.prototype.createLocMarker=function(e){var t=e.formatted_address;new google.maps.Marker({map:this.map,position:e.geometry.location,title:t})},localStorage.myLocations&&(myLocations=JSON.parse(localStorage.myLocations)),localStorage.myCategories&&(myCategories=JSON.parse(localStorage.myCategories));var numretry=0,model=null;!function e(){return"undefined"==typeof ko?(console.log("knockout.js is not loaded, retry in 5 ms",numretry),numretry++,1>numretry?void setTimeout(e(numretry),5):void Alert.render("Timeout: Knockout.js can't be loaded, the application is not working. Check your network and reload")):(console.log("Ko binding model is done"),model=new ViewModel,void ko.applyBindings(model))}(numretry);var numretry=0;!function t(){if("undefined"==typeof $){if(console.log("jQuery is not loaded, retry in 10 ms",numretry),numretry++,40>numretry)return void setTimeout(t(numretry),10);var e="Timeout: jQuery can't be loaded, run without third parties services or Reload";model?model.customAlert(e):Alert.render(e)}else console.log("jQuery was loaded"),model&&model.jqload(!0);model&&(model.openSearchWikipedia=function(e){self=this,self.wikiarticles([]);var t="http://en.wikipedia.org/w/api.php?action=opensearch&search=%data%&format=json&callback=wikiCallback",o="http://fr.wikipedia.org/wiki/",n=self.getLocality(e),a=[],r=n.locality+" ";n.region&&(r+=n.region);var i=t.replace("%data%",r),s=document.getElementById("wiki-temp").innerHTML;self.wikiInFocus("about "+r);var c=setTimeout(function(){self.customAlert("Timeout: Failed to query Wiki resources")},5e3);$.ajax({url:i,dataType:"jsonp"}).done(function(e){var t=e[1];$.each(t,function(e,t){var n=o+t;a.push(s.replace(/{{wikiarticle}}/,t).replace(/{{articleUrl}}/,n))}),this.wikiarticles(a),clearTimeout(c)}.bind(self)).fail(function(e){self.customAlert("Wiki API could bot be loaded")}.bind(self))},model.getNytArticle=function(e){self=this,self.nytarticles([]);var t="http://api.nytimes.com/svc/search/v2/articlesearch.json?",o="befcd9ed183aa5edba4a379ed537e27f:10:73683129",n=self.getLocality(e),a=t,r=n.locality+" ";n.region&&(r+=n.region);var i=n.country,s=[],c=document.getElementById("nytimes-temp").innerHTML;self.nytInFocus("about "+i+" "+r);var l=setTimeout(function(){self.customAlert("Timeout: failed to query New York times resources")}.bind(self),5e3);$.getJSON(a,{q:r,fq:i,page:0,sort:"newest",hl:!0,"api-key":o}).done(function(e){"OK"==e.status&&$.each(e.response.docs,function(e,t){var o=t.headline.main;null!==o&&s.push(c.replace(/{{headline}}/,o).replace(/{{articleUrl}}/,t.web_url))}),this.nytarticles(s),clearTimeout(l)}.bind(self)).fail(function(e){self.customAlert("New York Times Articles could bot be loaded")}.bind(self))})}(numretry);