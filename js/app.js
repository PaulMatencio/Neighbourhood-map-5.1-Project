$(function(){function e(){var e=this,t=new gMaps(mapOptions,mapStyle),i=t.map,a=(t.infoWindow,t.getCurrentLocation()),r=t.marker_animation;e.nearByPlaces=ko.observableArray([]),e.showResults=ko.observable(!0),e.placeReviews=ko.observableArray([]),e.placePhotos=ko.observableArray([]),e.placeInFocus=ko.observable(),e.nytarticles=ko.observableArray([]),e.nytInFocus=ko.observable(),e.wikiarticles=ko.observableArray([]),e.wikiInFocus=ko.observable(),e.streetview=ko.observable(),t.self=e;var s="http://api.nytimes.com/svc/search/v2/articlesearch.json?",o="befcd9ed183aa5edba4a379ed537e27f:10:73683129",n="http://en.wikipedia.org/w/api.php?action=opensearch&search=%data%&format=json&callback=wikiCallback",c="http://maps.googleapis.com/maps/api/streetview?";e.getAddress=function(e){if(e.vicinity){var t=e.vicinity.indexOf(",");return e.vicinity.slice(0,t)}return e.formatted_address},e.getCity=function(e){var t=e.formatted_address.split(" ");return t.slice(-2)},e.toggleResults=function(){1==e.showResults()?e.showResults(!1):e.showResults(!0)},e.icons=ko.computed(function(){var t=new Set,i=[];return e.nearByPlaces().forEach(function(e,i){i&&t.add(e.icon)}),t.forEach(function(e){i.push({icon:e})}),i.slice(0,20)}),e.rateStar=function(e){for(var t=Math.round(e),i=e-t,a=[],r=i>0?4-t:5-t,s=0;t>s;s++)a.push({star:"images/full-star.png"});for(i>0&&a.push({star:"images/half-star.png"}),s=0;r>s;s++)a.push({star:"images/empty-star.png"});return a},e.formattedType=function(e){var t=e.types[0].replace(/[_-]/g," ");return t.charAt(0).toUpperCase()+t.substr(1,t.length)},t.nearbySearch(a),t.initAutocomplete(),e.getWebsite=function(e){return e.website?e.website:""},e.clickMarker=function(e){var i=e.name.toLowerCase();t.markers.forEach(function(e){e.title.toLowerCase()===i&&google.maps.event.trigger(e,"click")})},e.getNytArticle=function(t){var i=e.getCity(t),a=s,r=i[1],n=i[0],c=[],l=$('script[data-template="nytimes"]').html();e.nytInFocus("about "+n+" "+r);var p=setTimeout(function(){c.push("<p>failed to query New York times resources</p>")},5e3);$.getJSON(a,{q:r,fq:n,page:0,sort:"newest",hl:!0,"api-key":o}).done(function(e){"OK"==e.status&&$.each(e.response.docs,function(e,t){var i=t.headline.main;null!=i&&c.push(l.replace(/{{headline}}/,i).replace(/{{articleUrl}}/,t.web_url))}),this.nytarticles(c),clearTimeout(p)}.bind(e)).fail(function(e){c.push("<p>New York Times Articles could bot be loaded</p>"),this.nytarticles(c)}.bind(e))},e.openSearchWikipedia=function(t){var i=e.getCity(t),a=[],r=i[0],s=n.replace("%data%",r),o="http://fr.wikipedia.org/wiki/",c=$('script[data-template="wiki"]').html();e.wikiInFocus("about "+r);var l=setTimeout(function(){a.push("<p>failed to query wiki resources</p>")},5e3);$.ajax({url:s,dataType:"jsonp"}).done(function(e){var t=e[1];$.each(t,function(e,t){var i=o+t;a.push(c.replace(/{{wikiarticle}}/,t).replace(/{{articleUrl}}/,i))}),this.wikiarticles(a),clearTimeout(l)}.bind(e)).fail(function(e){a.push("<p>wiki pages could not be found</p>"),this.wikiarticles(a)}.bind(e))},e.getStreetView=function(e){console.log(e);var t=c+"size=600x400&location="+e.formatted_address;return console.log(t),t},$("#filters").on("click","button",function(){function e(e){return-1!=e.toLowerCase().indexOf(a.substring(0,4))?e:void 0}r=google.maps.Animation.DROP;var a=$(this).children("img").attr("src").split("/").slice(-1)[0].split("-").slice(0,1)[0];myCategories=mapPlaceTypes.filter(e),localStorage.myCategories=JSON.stringify(myCategories),t.nearbySearch(i.getCenter())}),$("#reset").on("click",function(){myCategories=[],localStorage.myCategories=JSON.stringify(myCategories),t.nearbySearch(i.getCenter())})}ko.applyBindings(new e),$("#hide").click(function(){var e="",t=$(this).children("span").attr("class");e="left"===t.slice(29)?t.replace("left","right"):t.replace("right","left"),$(this).siblings("div").animate({width:"toggle"},500),$(this).children("span").attr("class",e)})});