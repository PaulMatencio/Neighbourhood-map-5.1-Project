function gMaps(){this.markers=[],this.infoWindow=new google.maps.InfoWindow({pixelOffset:new google.maps.Size(-23,-10),maxWidth:300}),this.marker_animation=google.maps.Animation.DROP,this.map=map}function CustomAlert(){this.render=function(e){var t=(window.innerWidth,window.innerHeight),a=document.getElementById("alertoverlay"),o=document.getElementById("alertbox");a.style.display="block",a.style.height=t+"px",o.style.display="block",document.getElementById("alertboxhead").innerHTML="Error message, please aknowledge",document.getElementById("alertboxbody").innerHTML=e,document.getElementById("alertboxfoot").innerHTML='<button onclick="Alert.ok()">OK</button>'},this.ok=function(){document.getElementById("alertbox").style.display="none",document.getElementById("alertoverlay").style.display="none"}}function inherit(e,t){e.prototype=Object.create(t.prototype),e.prototype.Constructor=e}gMaps.prototype.pinLocations=function(e){var t=new google.maps.places.PlacesService(this.map);e.forEach(function(e){console.log(e);var a={query:e.name};t.textSearch(a,this.searchResults)})},gMaps.prototype.searchResults=function(e,t){if(t==google.maps.places.PlacesServiceStatus.OK){var a=e[0],o=a.geometry.location,n=a.formatted_address;console.log(n,o),this.createLocMarker(a)}},gMaps.prototype.createLocMarker=function(e){var t=e.formatted_address;window.mapBounds,new google.maps.Marker({map:this.map,position:e.geometry.location,title:t})},gMaps.prototype.markLocation=function(){var e=this.name(),t=new google.maps.LatLng(this.mapcenter().lat,this.mapcenter().lng),a=(window.mapBounds,new google.maps.Marker({map:map,position:t,title:e}));this.marker=a},gMaps.prototype.setCenter=function(){map.setCenter(new google.maps.LatLng(this.mapcenter().lat,this.mapcenter().lng)),map.setZoom(13)},gMaps.prototype.nearbySearch=function(){var e=this.self,t=new google.maps.places.PlacesService(this.map);t.nearbySearch({location:this.mapcenter(),radius:radius,types:e.myCategories()},this.getResults.bind(this))},gMaps.prototype.getResults=function(e,t,a){function o(e){return"political"==e}var n=new google.maps.LatLngBounds,r=this.self,i=[];t==google.maps.places.PlacesServiceStatus.OK&&(e.forEach(function(e){0==e.types.filter(o).length&&(i.push(e),n.extend(e.geometry.location))}),map.fitBounds(n),this.nearByPlaces(i),this.createMarkers(this.nearByPlaces())),r.setCenter(),r.numberPlaces(r.numberPlaces()+i.length)},gMaps.prototype.initAutocomplete=function(){function e(){var e=[],t=this.self;":"==a.value.substring(0,1)&&(a.value=a.value.slice(1),e=o.getPlaces());var n=e.length;if(1==n){var r=e[0];this.mapCenter=r.geometry.location;var i={};i.name=a.value,i.city=a.value,i.mapcenter={lat:r.geometry.location.lat(),lng:r.geometry.location.lng()},i.selected=!0,t.addLocation(i)}a.value=""}var t=this.map,a=(this.self,document.getElementById("search-input")),o=new google.maps.places.SearchBox(a);t.addListener("bounds_changed",function(){o.setBounds(t.getBounds()),mapCenter=t.getCenter()}),o.addListener("places_changed",e.bind(this))},gMaps.prototype.removeMarkers=function(){this.markers.forEach(function(e){e.setMap(null)})},gMaps.prototype.createMarkers=function(e){var t=Math.sqrt($(window).width())+30;this.removeMarkers(),this.markers=[],e.forEach(function(e){var a={url:e.icon,size:new google.maps.Size(t,t),origin:new google.maps.Point(0,0),anchor:new google.maps.Point(t/4,t/2),scaledSize:new google.maps.Size(t/2.8,t/2.8)},o=new google.maps.Marker({map:map,icon:a,title:e.name,animation:this.marker_animation,position:e.geometry.location}),n=window.innerWidth,r=window.innerHeight,i=150,s=-r/5;800>n&&(i=-30,s=-1*(r/2+50)),o.addListener("click",function(){this.markers.forEach(function(e){e.setAnimation(null)}),null!==o.getAnimation()?o.setAnimation(null):(o.setAnimation(google.maps.Animation.BOUNCE),map.panTo(o.position),map.panBy(i,s))}.bind(this)),this.markers.push(o),e.marker=o,google.maps.event.addListener(o,"click",function(){this.addInfoWindow(e,o)}.bind(this))}.bind(this))},gMaps.prototype.addInfoWindow=function(e,t){var a=new google.maps.places.PlacesService(this.map),o=this,n=this.self,r=this.infoWindow,i=$(window).width();n.showCategory(!1),n.showLocation(!1),a.getDetails({placeId:e.place_id},function(e,a){if(a===google.maps.places.PlacesServiceStatus.OK){var s;800>i?(n.showResults(!1),s=$('script[data-template="review-short"]').html()):(s=$('script[data-template="reviews"]').html(),s=s.replace(/{{opening}}/,o.getOpenings(e)));var l=o.getWebsite(e),c=s.replace(/{{name}}/,e.name).replace(/{{formatted_address}}/,e.formatted_address).replace(/{{rating}}/,o.getRating(e)).replace(/{{photos}}/,o.getPhotoes(e));if(r.setContent(c.replace(/{{website}}/g,l).replace(/{{phone}}/,o.getPhone(e))),r.open(o.map,t),$(".infoWindow").fadeIn(200),e.photos){e.photos.length;$("#photos").click(function(){n.placePhotos(e.photos),n.currentIndex(0),n.currentPhoto(n.placePhotos()[0])})}var p=$("#reviews");p&&p.click(function(){n.placeInFocus(e),e.reviews.forEach(function(e){""!==e.text&&n.placeReviews.push(e)})});var g=$("#nytLink");g&&g.click(function(){n.getNytArticle(e)});var m=$("#wikiLink");m&&m.click(function(){n.openSearchWikipedia(e)});var h=$("#streetLink");h&&h.click(function(){n.getStreetView(e)})}}),google.maps.event.addListener(r,"closeclick",function(){o.markers.forEach(function(e){e.setAnimation(null)}.bind(this))})},gMaps.prototype.getWebsite=function(e){return e.website?e.website:""},gMaps.prototype.getRating=function(e){var t=this.self,a="",o=t.rateStar(e.rating);if(e.rating){a='<div><span style="color: #df6d15; padding-right: 3px;">'+e.rating+"</span>";for(var n in o)n&&(a+='<img class="rate-star" src="'+o[n].star+'" />');return a+='<span class="rating"> Users rating:'+e.user_ratings_total+"</span>",a+'<a id="reviews"  href="#"">Reviews,</a>'}return'<span style="font-style: italic;">no rating available</span>'},gMaps.prototype.getPhone=function(e){return e.international_phone_number?e.international_phone_number:"<span>Location:"+e.geometry.location+"</span>"},gMaps.prototype.getPhotoes=function(e){return e.photos&&e.photos.length>1?'<a style="margin-left: 5px;" id="photos" href="#"">Photos</a>':'<div id="photos"></div></div>'},gMaps.prototype.getOpenings=function(e){var t;try{t="Mon-Sat:"+e.opening_hours.periods[1].open.time+"-"+e.opening_hours.periods[1].close.time+" Sun:"+e.opening_hours.periods[0].open.time+"-"+e.opening_hours.periods[0].close.time}catch(a){t="Work time not available"}return t};var Alert=new CustomAlert,mapPlaceTypes=["accounting","airport","amusement_park","aquarium","art_gallery","atm","bakery","bank","bar","beauty_salon","bicycle_store","book_store","bowling_alley","bus_station","cafe","campground","car_dealer","car_rental","car_repair","car_wash","casino","cemetery","church","city_hall","clothing_store","convenience_store","courthouse","dentist","department_store","doctor","electrician","electronics_store","embassy","establishment","finance","fire_station","florist","food","funeral_home","furniture_store","gas_station","general_contractor","grocery_or_supermarket","gym","hair_care","hardware_store","health","hindu_temple","home_goods_store","hospital","insurance_agency","jewelry_store","laundry","lawyer","library","liquor_store","local_government_office","locksmith","lodging","meal_delivery","meal_takeaway","mosque","movie_rental","movie_theater","moving_company","museum","night_club","painter","park","parking","pet_store","pharmacy","physiotherapist","place_of_worship","plumber","police","post_office","real_estate_agency","restaurant","roofing_contractor","rv_park","school","shoe_store","shopping_mall","spa","stadium","storage","store","subway_station","synagogue","taxi_stand","train_station","travel_agency","university","veterinary_care","zoo"],mapStyle=[{featureType:"road.local",elementType:"labels",stylers:[{hue:"#00a1ff"},{gamma:.8}]},{featureType:"road.highway",stylers:[{lightness:12},{gamma:1.31},{hue:"#ffa200"}]},{featureType:"landscape.natural"}],mapCenter={},myCategories=[],radius=2e3,today=new Date,winWidth;try{winWidth=$(window).width()}catch(e){var msg="Failed to load jQuery, Check your network and retry";console.log(msg),Alert.render(msg)}var Lindex=0,myLocations=[{name:"Notre Dame de Paris",city:"Paris France",mapcenter:{lat:48.852729,lng:2.350564},selected:!0},{name:"Eiffel Tower",city:"Paris France",mapcenter:{lat:48.858261,lng:2.294507},selected:!1},{name:"Porte d'Italie",city:"Paris France",mapcenter:{lat:48.819067,lng:2.36023},selected:!1},{name:"Place de la Nation",city:"Paris France",mapcenter:{lat:48.847895,lng:2.395984},selected:!1},{name:"Porte de la Chapelle",city:"Paris France",mapcenter:{lat:48.896748,lng:2.363993},selected:!1}];