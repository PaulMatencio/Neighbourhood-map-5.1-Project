##Neighborhood map project

###Setting up Project:

  Readable and commented HTML/CSS/JavaScript/image files are in the '<project folder>/src' folder. Gulp is isued to minify html, js and css files , to cmpress images, and to deploy the resulting files into the <project folder>.
  Check ['src'](https://github.com/PaulMatencio/Neighbourhood-Maps-Project/tree/master/src) folder for commented readable codes.

 For the working page check this link: ( https://http://paulmatencio.github.io/Neighbourhood-Maps-Project )

###Project Overview:

   Develop a single page application featuring a map of a neighborhood you would like to visit. Add additional functionality to this map including highlighted locations, third-party data about those locations and various ways to browse the content.

###How to use the app

* Search box:

   Use the search box to find a neighborhood you want to visit. Type city name or district. The app will focus on that area and request the 10-20 most popular places in the area.

   You can filter the places returned by the search simple typing in the search box it will update the markers and the placelist on keydown (can search for name or type "bar, chinese restaurant, takeaway , sushi near Paris....").

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


* This application is designed to work on mobile and desktop. Pages are responsive

###Resources and tools that are used

* [knockoutjs](http://knockoutjs.com/)
* [bootstrap] (http://getbootstrap.com/)
* [JQuery](https://jquery.com/)
* [Google Maps APIs](https://developers.google.com/maps/?hl=en)
* [Dev Tools](https://developer.chrome.com/devtools/docs/rendering-settings)
* [project5] (http://devrob.github.io/Udacity-WebDev-project5)

* [Gulp plugins](http://gulpjs.com/plugins/)
    * [compress images with gulp-imagemin](https://www.npmjs.com/package/gulp-imagemin)
    * [compress javascript with gulp-uglify](https://www.npmjs.com/package/gulp-uglify/)
    * [compress CSS with gulp-minify-css](https://www.npmjs.com/package/gulp-minify-css)
    * [compress HTML with gulp-minify-html](https://www.npmjs.com/package/gulp-minify-html)
    * [pipe exeption handler gulp-plumber](https://www.npmjs.com/package/gulp-plumber)
    * [reload page upon change gulp-livereload](https://www.npmjs.com/package/gulp-livereload)
