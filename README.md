##Neighborhood map project


This is the fifth project of the Udacity Front-end developer nanodegree. To complete this project, I have been using following.

* Javasctipt
* Javscript OO
* HTML 5 (Element Errors due to KO)
* CSS 3 (validated)
* CSS Media query
* Jquery
* Bootstrap
* Google MAPS API
* AJAX
* Knockout.js
* Newyork times API
* Wikipedia API ( )
* Street view API
* Local Storage
* Gulp


## issues with knockout.js

I got a problem with Knockout.js's observable array and Ajax.

Eventhougth the KO modelview object contains an observable array, as for instance "nytarticles", I got "undefined" when I want to access that observable array. A mean to circumvent this issue is to use a regular javascript array , as for instance "articles" and  assign the javascript it to the ko observable array "nyarticles" at the end of the request..


###Setting up Project:

The Readable and commented HTML/CSS/JavaScript files are in the '<project folder>/src' folder. Gulp is used to minify html, javasript and css files , to cmpress images, and to deploy the resulting files into the <project folder>. Check ['src'](https://github.com/PaulMatencio/Neighbourhood-Maps-Project/tree/master/src) folder for commented readable codes.

For the working page check this link: ( http://paulmatencio.github.io/Neighbourhood-Maps-Project )

###Project Overview:

Develop a single page application featuring a map of a neighborhood you would like to visit. Add additional functionality to this map including highlighted locations, third-party data about those locations and various ways to browse the content.

###How to use the app

* SEARCH BOX:

   Use the search box to find a neighborhood you want to visit. Type city name or district. The app will focus on that area and request the 10-20 most popular places in the area.

   You can filter the places returned by the search simple typing in the search box it will update the markers and the placelist on keydown (can search for name or type "bar, chinese restaurant, takeaway , sushi bar near ....").

   If you search with one keyword, the application will use this keyword to set a new location. New location is saved in your browser's local storage, however when you reload the application, your geo location will take over the previous saved location (if your browser support geolocation)

   If you search with multiple keywords , neighbourhood places of the previous location are returned  unless your keyword contains teh name of a  city or country or both.
   Multiple keywords containing city or Country  name will change your location, however previous saved filters remain.

   The search-box support the autocomplete feature.

* PLACE LIST:

   On the right you can find the places corresponding to the markers. Clicking on one place will focus the map on the place and will open an infowindow.

   Use the hamburger button located at top-right of your application window to  hide the Place list. It can be useful for devices with small screen.

* HAMBURGER BUTTON:

  This button is at the top-rigth of the Place list. Use it to hide or show the Place list.

* BUTTON TOOLBAR:

   This toolbar dynamically changes with the neighborhood. It will show the set of the markers returned be the search.
   If you press one of the icon, it will re-request the search in the area with different category setting and save your categories bth in memory and in your local storage. These filters will be reused when you move into a new location ( as for instance City). When your re-load your application, these filters will be reused to filter the categories of your new location.

   For example if you have a coffee icon it will return the 10-20 most popular coffee-shop in the area. If you move into a new location, the application will use these categories to filter the nearbysearch.

   Important: You can reset the search with the refresh button. This will clear the category filters ( both memory and local storage copies) and return the 10-20 most popular places in the area. Ĝoogle Maps may


* INFO WINDOW:

   You can find useful information here like the name of the place, address, opening hours, newyork times headline/link(if existing), wikipedia link for the city, newyork times articles and street views

* Photo viewer for dispaying photos for a place  [click on Photos link of the info window]

* List  of the reviews for a place [click on Reviews link of the info window]

  Nothing happen if there is no reviews

* New york times headline  and latest news for a city and country ( based of the address of the place)  [Click on NYT articles of the info window]

  Nothing happen if there is no articles

* Wiki pedia [ click on W link of the info window]

  Nothing happen if there is no wiki

* Street views [ click on view icon of the info window]


* LOCAL STORAGE

  To reset your local storage, go to the console of your browser and type localStorage.clear() . This will clear the localStorage.mapCenter and localStorage.myCategories leaved by this application

* RESPONSIVE APPLICATION

  The application is responsive. It has been tested on Nexus 5x, 6, 6P, Chromebook, Laptop and Desktop

###Resources and tools that are used

* [Intoduction to Ajax - Udacity ] (https://www.udacity.com/course/intro-to-ajax--ud110)
* [Javascript design pattern - Udacity] (https://www.udacity.com/course/javascript-design-patterns--ud989)
* [Discussion forum - Udacity]  (https://discussions.udacity.com/c/nd001-project-5-neighborhood-map-project)
* [knockoutjs](http://knockoutjs.com/)
* [bootstraps] (http://getbootstrap.com/)
* [JQuery](https://jquery.com/)
* [Google Maps APIs](https://developers.google.com/maps/?hl=en)
* [Dev Tools](https://developer.chrome.com/devtools/docs/rendering-settings)
* [Convert command] (http://www.imagemagick.org/script/convert.php)

###Inspired by the UI of project 5 below. I litterally reuse the UI button toolbar.

* [Project5] (http://devrob.github.io/Udacity-WebDev-project5)


## TOOLS

* [Gulp plugins](http://gulpjs.com/plugins/)
    * [compress images with gulp-imagemin](https://www.npmjs.com/package/gulp-imagemin)
    * [minify javascript with gulp-uglify](https://www.npmjs.com/package/gulp-uglify/)
    * [minify inline javascript] (https://www.npmjs.com/package/gulp-minify-inline)
    * [minify CSS with gulp-minify-css](https://www.npmjs.com/package/gulp-minify-css)
    * [minify HTML with gulp-minify-html](https://www.npmjs.com/package/gulp-minify-html)

* pixlr to manipulate images

