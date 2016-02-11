function inherit(e,t){e.prototype=Object.create(t.prototype),e.prototype.Constructor=e}function toggledisplay(e){!function(e){e.display="none"===e.display?"":"none"}(document.getElementById(e).style)}function CustomAlert(){this.render=function(e){var t=(window.innerWidth,window.innerHeight),o=document.getElementById("alertoverlay"),n=document.getElementById("alertbox");o.style.display="block",o.style.height=t+"px",n.style.display="block",document.getElementById("alertboxhead").innerHTML="Error message, please aknowledge",document.getElementById("alertboxbody").innerHTML=e,document.getElementById("alertboxfoot").innerHTML='<button onclick="Alert.ok()">OK</button>'},this.ok=function(){document.getElementById("alertbox").style.display="none",document.getElementById("alertoverlay").style.display="none"}}function gMaps(){this.markers=[],this.infoWindow=new google.maps.InfoWindow({pixelOffset:new google.maps.Size(-23,-10),maxWidth:300}),this.marker_animation=google.maps.Animation.DROP,this.map=map}function ViewModel(){function e(e){return{init:function(t,o,n,i,a){var r,s;r=function(t,n){n.keyCode===e&&o().call(this,t,n)},s=function(){return{keyup:r}},ko.bindingHandlers.event.init(t,s,n,i,a)}}}function t(e){gMaps.call(this,e),this.name=ko.observable(e.name),this.city=ko.observable(e.city),this.mapcenter=ko.observable(e.mapcenter),this.selected=ko.observable(e.selected),this.nearByPlaces=ko.observableArray([]),this.savePlaces=[],this.markers=[],this.marker=null,this.self=r}function o(e,t){return e.slice(0,t.length)==t}function n(e){var t=r.placePhotos().length,o=r.currentIndex(),n=(o+e)%t;0>n&&(n=t-1),r.currentPhoto(r.placePhotos()[n]),r.currentIndex(n)}function i(){var e=window.innerWidth;e>800?r.showResults(!0):r.showResults(!1)}var a=13;ko.bindingHandlers.enterKey=e(a);var r=this;r.myLocations=ko.observableArray([]),r.showLocation=ko.observable(!1),r.showCategory=ko.observable(!1),r.showResults=ko.observable(!0),r.numberPlaces=ko.observable(0),r.placeReviews=ko.observableArray([]),r.placePhotos=ko.observableArray([]),r.placeInFocus=ko.observable(),r.nytarticles=ko.observableArray([]),r.nytInFocus=ko.observable(),r.wikiarticles=ko.observableArray([]),r.wikiInFocus=ko.observable(),r.streetView=ko.observable(),r.noimage=ko.observable(),r.showView=ko.observable(!1),r.currentPhoto=ko.observable(),r.currentIndex=ko.observable(0),r.keyword=ko.observable(),r.mapPlaceTypes=ko.observableArray(mapPlaceTypes),r.myCategories=ko.observableArray(myCategories),inherit(t,gMaps),r.initLocations=function(e){r.myLocations([]),r.numberPlaces(0),e.forEach(function(e){var o=new t(e);r.myLocations().push(o),o.markLocation(),o.selected()||o.marker.setMap(null)})},r.initLocations(myLocations);var s,c,l;s=new gMaps,l=s.infoWindow,c=s.marker_animation,s.initAutocomplete(),s.self=r;var p="http://maps.googleapis.com/maps/api/streetview?";r.displayLocation=function(e){e.selected()&&e.nearbySearch()},r.hideLocation=function(){r.showLocation(!1)},r.toggleLocation=function(){0==r.myLocations().length?r.showLocation(!1):r.showLocation(!r.showLocation()),r.showCategory(!1)},r.toggleCategory=function(){r.showCategory(!r.showCategory()),r.showLocation(!1)},r.filteredLocations=ko.computed(function(){return r.myLocations()},s),r.selectLocation=function(e){e.selected(!e.selected()),r.showLocation(!1),e.selected()?e.markLocation():(r.numberPlaces(r.numberPlaces()-e.nearByPlaces().length),e.nearByPlaces([]),e.marker&&e.marker.setMap(null),r.setCenter()),e.createMarkers(e.nearByPlaces()),0==r.numberPlaces()&&(r.numberPlaces(0),r.showResults(!1))},r.myCity=ko.computed(function(){var e=r.myLocations().filter(function(e){return e.selected()});return e.length>0?e[0].city():""}),r.closeWiki=function(){r.wikiarticles([])},r.closeNyt=function(){r.nytarticles([])},r.closeReview=function(){r.placeReviews([])},r.closePhoto=function(){r.placePhotos([]),r.currentIndex(0)},r.photoIndex=ko.pureComputed(function(){return r.currentIndex()+1}),r.getPlace=function(){var e=r.keyword().trim();if(":"!=e.substring(0,1)){myCategories=[];var t=e.split(" ");r.getPlaces(t),r.showLocation(!1),r.showCategory(!1)}},r.getPlaces=function(e){e.forEach(function(e){function t(t){return o(t,e)}"clini"==e.substring(0,5)&&(e="hospital"),"fitness"==e&&(e="gym"),"eat"==e.substring(0,3)&&(e="food"),"metro"==e.substring(0,5)&&(e="subway"),mapplacetype=mapPlaceTypes.filter(t),mapplacetype.forEach(function(e){myCategories.push(e)}),r.myCategories(myCategories)}),r.numberPlaces(0),localStorage.myCategories=JSON.stringify(myCategories),r.setCenter()},r.getCategories=function(){console.log(r.myCategories())},r.addLocation=function(e){myLocations.unshift(e);var o=new t(e);r.myLocations.unshift(o),o.markLocation(),localStorage.myLocations=JSON.stringify(myLocations)},r.removeLocation=function(e){var t=e.name;e.selected()&&r.selectLocation(e),r.myLocations(r.myLocations().filter(function(e,o){return myLocations[o].remove=!0,e.name!=t?(myLocations[o].remove=!1,e):void 0})),myLocations=myLocations.filter(function(e){return 0==e.remove?e:void 0}),localStorage.myLocations=JSON.stringify(myLocations)},r.setCenter=function(){var e=r.myLocations().filter(function(e){return e.selected()});e.length>0&&e[0].setCenter()},r.getAddress=function(e){if(e.vicinity){var t=e.vicinity.indexOf(",");return e.vicinity.slice(0,t)}return e.formatted_address},r.getLocality=function(e){var t=e.adr_address,o='class="locality">',n='class="country-name">',i='class="region">',a=0,r={},s=0;return idx1=t.indexOf(o),idx1>0&&(a=idx1+o.length,s=t.indexOf("</span>",a),r.locality=t.slice(a,s)),idx1=t.indexOf('class="region"',s+7),idx1>0&&(a=idx1+i.length,s=t.indexOf("</span>",a),r.region=t.slice(a,s)),idx1=t.indexOf('class="country-name"',s+7),idx1>0&&(a=idx1+n.length,s=t.indexOf("</span>",a),r.country=t.slice(a,s)),r},r.toggleResults=function(){r.numberPlaces()>0&&r.showResults(!r.showResults())},r.icons=ko.computed(function(){var e=new Set,t=[];return r.myLocations().forEach(function(t){for(var o in t.nearByPlaces())o&&e.add(t.nearByPlaces()[o].icon)}),e.forEach(function(e){t.push({icon:e})}),t.slice(0,8)}),r.rateStar=function(e){for(var t=Math.round(e),o=e-t,n=[],i=o>0?4-t:5-t,a=0;t>a;a++)n.push({star:"images/full-star.png"});for(o>0&&n.push({star:"images/half-star.png"}),a=0;i>a;a++)n.push({star:"images/empty-star.png"});return n},r.formattedType=function(e){var t=e.types[0].replace(/[_-]/g," ");return t.charAt(0).toUpperCase()+t.substr(1,t.length)},r.clickMarker=function(e){google.maps.event.trigger(e.marker,"click")},r.photoBackward=function(){n(-1)},r.photoForward=function(){n(1)},r.getStreetView=function(e){r.streetView(p+"size=600x400&location="+e.formatted_address),r.noimage="Sorry no image for "+e.formatted_address,r.showView(!0)},r.closeView=function(){r.showView(!1)},r.myIcons=function(e){function t(e){var t=e.split("_")[0];return-1!=o.indexOf(t)?e:void 0}c=google.maps.Animation.DROP;var o=e.icon.split("/").slice(-1)[0].split("-").slice(0,1)[0];myCategories=mapPlaceTypes.filter(t),r.myCategories(myCategories),r.numberPlaces(0),r.showLocation(!1),r.showCategory(!1),localStorage.myCategories=JSON.stringify(myCategories)},r.resetIcons=function(){myCategories=[],r.myCategories(myCategories),r.numberPlaces(0),localStorage.myCategories=JSON.stringify(myCategories)},r.hideIcons=function(){},window.onresize=function(){i()}}var Alert=new CustomAlert;gMaps.prototype.pinLocations=function(e){var t=new google.maps.places.PlacesService(this.map);e.forEach(function(e){console.log(e);var o={query:e.name};t.textSearch(o,this.searchResults)})},gMaps.prototype.searchResults=function(e,t){if(t==google.maps.places.PlacesServiceStatus.OK){var o=e[0],n=o.geometry.location,i=o.formatted_address;console.log(i,n),this.createLocMarker(o)}},gMaps.prototype.createLocMarker=function(e){var t=e.formatted_address;window.mapBounds,new google.maps.Marker({map:this.map,position:e.geometry.location,title:t})},gMaps.prototype.markLocation=function(){var e=this.name(),t=new google.maps.LatLng(this.mapcenter().lat,this.mapcenter().lng),o=(window.mapBounds,new google.maps.Marker({map:map,position:t,title:e}));this.marker=o},gMaps.prototype.setCenter=function(){map.setCenter(new google.maps.LatLng(this.mapcenter().lat,this.mapcenter().lng)),map.setZoom(13)},gMaps.prototype.nearbySearch=function(){var e=this.self,t=new google.maps.places.PlacesService(this.map);t.nearbySearch({location:this.mapcenter(),radius:radius,types:e.myCategories()},this.getResults.bind(this))},gMaps.prototype.getResults=function(e,t,o){function n(e){return"political"==e}var i=new google.maps.LatLngBounds,a=this.self,r=[];t==google.maps.places.PlacesServiceStatus.OK&&(e.forEach(function(e){0==e.types.filter(n).length&&(r.push(e),i.extend(e.geometry.location))}),map.fitBounds(i),this.nearByPlaces(r),this.createMarkers(this.nearByPlaces())),a.setCenter(),a.numberPlaces(a.numberPlaces()+r.length),a.numberPlaces()>0&&a.showResults(!0)},gMaps.prototype.initAutocomplete=function(){function e(){var e=[],t=this.self;":"==o.value.substring(0,1)&&(o.value=o.value.slice(1),e=n.getPlaces());var i=e.length;if(1==i){var a=e[0];if(!a.geometry)return void Alert.render("SearchBox's returned place contains no geometry");this.mapCenter=a.geometry.location;var r={};r.name=o.value,r.city=o.value,r.mapcenter={lat:a.geometry.location.lat(),lng:a.geometry.location.lng()},r.selected=!0,t.addLocation(r)}o.value=""}var t=this.map,o=(this.self,document.getElementById("search-input")),n=new google.maps.places.SearchBox(o);t.addListener("bounds_changed",function(){n.setBounds(t.getBounds()),mapCenter=t.getCenter()}),n.addListener("places_changed",e.bind(this))},gMaps.prototype.removeMarkers=function(){this.markers.forEach(function(e){e.setMap(null)})},gMaps.prototype.createMarkers=function(e){var t=Math.sqrt(window.innerWidth)+24;this.removeMarkers(),this.markers=[],e.forEach(function(e){var o={url:e.icon,size:new google.maps.Size(t,t),origin:new google.maps.Point(0,0),anchor:new google.maps.Point(t/4,t/2),scaledSize:new google.maps.Size(t/2.8,t/2.8)},n=new google.maps.Marker({map:map,icon:o,title:e.name,animation:this.marker_animation,position:e.geometry.location}),i=window.innerWidth,a=window.innerHeight,r=150,s=-a/5;800>i&&(r=-30,s=-1*(a/2+40)),n.addListener("click",function(){this.markers.forEach(function(e){e.setAnimation(null)}),null!==n.getAnimation()?n.setAnimation(null):(n.setAnimation(google.maps.Animation.BOUNCE),map.panTo(n.position),map.panBy(r,s))}.bind(this)),this.markers.push(n),e.marker=n,google.maps.event.addListener(n,"click",function(){this.addInfoWindow(e,n)}.bind(this))}.bind(this))},gMaps.prototype.addInfoWindow=function(e,t){var o=new google.maps.places.PlacesService(this.map),n=this,i=this.self,a=this.infoWindow,r=window.innerWidth;i.showCategory(!1),i.showLocation(!1),o.getDetails({placeId:e.place_id},function(e,o){if(o===google.maps.places.PlacesServiceStatus.OK){var s;800>r?(i.showResults(!1),s=document.getElementById("review-short").innerHTML):(s=document.getElementById("review-long").innerHTML,s=s.replace(/{{opening}}/,n.getOpenings(e)));var c=n.getWebsite(e),l=s.replace(/{{name}}/,e.name).replace(/{{formatted_address}}/,e.formatted_address).replace(/{{rating}}/,n.getRating(e)).replace(/{{photos}}/,n.getPhotoes(e));if(a.setContent(l.replace(/{{website}}/g,c).replace(/{{phone}}/,n.getPhone(e))),a.open(n.map,t),e.photos){var p=(e.photos.length,document.getElementById("photos"));p.addEventListener("click",function(){i.placePhotos(e.photos),i.currentIndex(0),i.currentPhoto(i.placePhotos()[0])})}var u=document.getElementById("reviews");u&&u.addEventListener("click",function(){i.placeInFocus(e),e.reviews.forEach(function(e){""!==e.text&&i.placeReviews.push(e)})});var m=document.getElementById("nytLink");m&&m.addEventListener("click",function(){i.getNytArticle(e)});var d=document.getElementById("wikiLink");d&&d.addEventListener("click",function(){i.openSearchWikipedia(e)});var g=document.getElementById("streetLink");g&&g.addEventListener("click",function(){i.getStreetView(e)})}}),google.maps.event.addListener(a,"closeclick",function(){n.markers.forEach(function(e){e.setAnimation(null)}.bind(this))})},gMaps.prototype.getWebsite=function(e){return e.website?e.website:""},gMaps.prototype.getRating=function(e){var t=this.self,o="",n=t.rateStar(e.rating);if(e.rating){o='<div><span style="color: #df6d15; padding-right: 3px;">'+e.rating+"</span>";for(var i in n)i&&(o+='<img class="rate-star" src="'+n[i].star+'" />');return o+='<span class="rating"> Users rating:'+e.user_ratings_total+"</span>",o+'<a id="reviews"  href="#"">Reviews,</a>'}return'<span style="font-style: italic;">no rating available</span>'},gMaps.prototype.getPhone=function(e){return e.international_phone_number?e.international_phone_number:"<span>Location:"+e.geometry.location+"</span>"},gMaps.prototype.getPhotoes=function(e){return e.photos&&e.photos.length>1?'<a style="margin-left: 5px;" id="photos" href="#"">Photos</a>':'<div id="photos"></div></div>'},gMaps.prototype.getOpenings=function(e){var t;try{t="Mon-Sat:"+e.opening_hours.periods[1].open.time+"-"+e.opening_hours.periods[1].close.time+" Sun:"+e.opening_hours.periods[0].open.time+"-"+e.opening_hours.periods[0].close.time}catch(o){t="Work time not available"}return t},localStorage.myLocations&&(myLocations=JSON.parse(localStorage.myLocations)),localStorage.myCategories&&(myCategories=JSON.parse(localStorage.myCategories));var model=new ViewModel,numretry=0;!function(){return"undefined"==typeof ko?(console.log("knockout.js is not loaded, retry in 5 ms",numretry),numretry++,20>numretry?void setTimeout(koisReady(numretry),5):void Alert.render("Knockout.js can't be loaded, the application is not working")):(console.log("Ko binding model is done"),void ko.applyBindings(model))}(numretry),toggledisplay("marker"),toggledisplay("options");var numretry=0;!function e(){return"undefined"==typeof $?(console.log("jQuery is not loaded, retry in 5 ms",numretry),numretry++,20>numretry?void setTimeout(e(numretry),5):void Alert.render("jQuery can't be loaded, the application will run without third parties services")):(console.log("jQuery was loaded"),model.openSearchWikipedia=function(e){self=this,self.wikiarticles([]);var t="http://en.wikipedia.org/w/api.php?action=opensearch&search=%data%&format=json&callback=wikiCallback",o="http://fr.wikipedia.org/wiki/",n=self.getLocality(e),i=[],a=n.locality+" ";n.region&&(a+=n.region);var r=t.replace("%data%",a),o="http://fr.wikipedia.org/wiki/",s=document.getElementById("wiki-temp").innerHTML;self.wikiInFocus("about "+a);var c=setTimeout(function(){i.push("<p>failed to query wiki resources</p>"),this.wikiarticles(i)},5e3);$.ajax({url:r,dataType:"jsonp"}).done(function(e){var t=e[1];$.each(t,function(e,t){var n=o+t;i.push(s.replace(/{{wikiarticle}}/,t).replace(/{{articleUrl}}/,n))}),this.wikiarticles(i),clearTimeout(c)}.bind(self)).fail(function(e){i.push("<p>Wiki could bot be loaded</p>"),this.wikiarticles(i)}.bind(self))},model.getNytArticle=function(e){self=this,self.nytarticles([]);var t="http://api.nytimes.com/svc/search/v2/articlesearch.json?",o="befcd9ed183aa5edba4a379ed537e27f:10:73683129",n=self.getLocality(e),i=t,a=n.locality+" ";n.region&&(a+=n.region);var r=n.country,s=[],c=document.getElementById("nytimes-temp").innerHTML;self.nytInFocus("about "+r+" "+a);var l=setTimeout(function(){s.push("<p>failed to query New York times resources</p>"),this.nytarticles(s)}.bind(self),5e3);$.getJSON(i,{q:a,fq:r,page:0,sort:"newest",hl:!0,"api-key":o}).done(function(e){"OK"==e.status&&$.each(e.response.docs,function(e,t){var o=t.headline.main;null!=o&&s.push(c.replace(/{{headline}}/,o).replace(/{{articleUrl}}/,t.web_url))}),this.nytarticles(s),clearTimeout(l)}.bind(self)).fail(function(e){s.push("<p>New York Times Articles could bot be loaded</p>"),this.nytarticles(s)}.bind(self))},void $("#hide").click(function(){var e=$(this).children("span"),t=e.text();t="⊳"==t?"⊲":"⊳",e.text(t),$(this).siblings("div").animate({width:"toggle"},500)}))}(numretry);