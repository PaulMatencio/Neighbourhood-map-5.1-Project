##Neighborhood map project


This project is the fifth project of the Udacity Front-end developer nanodegree. To complete this project, I have been using following.

* Javasctipt
* Javscript OO
* HTML 5
* CSS 3
* CSS Media query
* Bootstrap
* Google MAPS API
* AJAX
* Knockout.js
* Newyork times API
* Wikipedia API ( )
* Street view API
* Gulp


## issues with knockout.js

I got a strange behaviour between Knockout.js and observable array with Ajax that is described below:

Eventhougth the KO modelview  object contains the observable array, as for instance "nytarticles", when I want to access the observable array, I got an error telling that "nytarticles"  is undefined. A mean to circumvent this issue is to use a javascript array , as for instance "articles" and  assign the javascript array "articles" to the ko observable array "nyarticles" when the operation is completed.


###Setting up Project:

The Readable and commented HTML/CSS/JavaScript files are in the '<project folder>/src' folder. Gulp is used to minify html, javasript and css files , to cmpress images, and to deploy the resulting files into the <project folder>. Check ['src'](https://github.com/PaulMatencio/Neighbourhood-Maps-Project/tree/master/src) folder for commented readable codes.

For the working page check this link: ( http://paulmatencio.github.io/Neighbourhood-Maps-Project )

###Project Overview:

Develop a single page application featuring a map of a neighborhood you would like to visit. Add additional functionality to this map including highlighted locations, third-party data about those locations and various ways to browse the content.

###How to use the app

* Search box:

   Use the search box to find a neighborhood you want to visit. Type city name or district. The app will focus on that area and request the 10-20 most popular places in the area.
   You can filter the places returned by the search simple typing in the search box it will update the markers and the placelist on keydown (can search for name or type "bar, chinese restaurant, takeaway , sushi near Paris....").
   The search-box support the autocomplete feature.

* Place list:

   On the right you can find the places correspond to the markers. Clicking on the will focus the map on the place and will open an infowindow.
   You can hide the Place list with the hamburger button located on the top right corner.

* Humbuger button:

  This button is on the upper right corner of the Place list. Use it to hide or show the Place list. It is useful when the sĉreen width is reduced.


* Button toolbar:

   This toolbar dynamically changes with the neighborhood. It will show the set of the markers returned be the search. If you press one of the icon it will re-request the search in the area with different category setting. For example if you have a coffee icon it will return the 10-20 most popular coffee-shop in the area.
   you can reset the search with the refresh button and it will clear the category filter and return the 10-20 most popular places in the area.


* Info window:

   You can find useful information here like the name of the place, address, opening hours, newyork times headline/link(if existing)

* Photo viewer for dispaying photos for a place  [click on Photos]
* List  of the reviews for a place [click on Reviews]
* New york times headline  and latest news for a city and country ( based of the address of the place)  [Click on NYT articles]
* Wiki pedia
* Street views


* The application is responsive. It has been tested on Nexus 5x, 6, 6P, Laptop and Desktop

###Resources and tools that are used

* [Intoduction to Ajax Udacity ] (https://www.udacity.com/course/intro-to-ajax--ud110)
* [Javascript design pattern Udacity] (https://www.udacity.com/course/javascript-design-patterns--ud989)
* [Discussion forum Udacity]  (https://discussions.udacity.com/c/nd001-project-5-neighborhood-map-project)
* [knockoutjs](http://knockoutjs.com/)
* [bootstraps] (http://getbootstrap.com/)
* [JQuery](https://jquery.com/)
* [Google Maps APIs](https://developers.google.com/maps/?hl=en)
* [Dev Tools](https://developer.chrome.com/devtools/docs/rendering-settings)
* [Convert command] (http://www.imagemagick.org/script/convert.php)

###Inspired by the UI of project 5 below. I reused litterally its button toolbar.
* [Project5] (http://devrob.github.io/Udacity-WebDev-project5)


* [Gulp plugins](http://gulpjs.com/plugins/)
    * [compress images with gulp-imagemin](https://www.npmjs.com/package/gulp-imagemin)
    * [compress javascript with gulp-uglify](https://www.npmjs.com/package/gulp-uglify/)
    * [compress CSS with gulp-minify-css](https://www.npmjs.com/package/gulp-minify-css)
    * [compress HTML with gulp-minify-html](https://www.npmjs.com/package/gulp-minify-html)


