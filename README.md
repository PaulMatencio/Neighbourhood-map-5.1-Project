##Neighborhood map project


This is my  fifth project of the Udacity Front-end developer nanodegree. To complete this project, I have been using following.

* Javasctipt
* Javscript OO
* HTML 5 (Element Errors due to KO)
* CSS 3 (validated)
* CSS Media query
* knockout.js
* Google Maps API ( async)
* AJAX
* Newyork times API
* Wikipedia API ( )
* Street view API
* jQuery
* Bootstrap
* Local Storage
* Gulp

### new version
The difference with the first version are

* Google maps API is asynchronously loaded
* 6 different hard coded locations
* button to show/hide lthe list of locations
* User can select/unselect location
* Search box is only used by the application to find places nearby locations. It can be used to look for new locations via to Google Maps searchbox. To look for a new location, you must prefix your new location with a sim-colon :  ( as for instance :Newyork central park )
* Use more  Knockout.js to manipulate DOM than the previous version


###Setting up Project:

The Readable and commented HTML/CSS/JavaScript files are in the '<project folder>/src' folder. Gulp is used to minify html, javasript and css files , to cmpress images, and to deploy the resulting files into the <project folder>. Check ['src'](https://github.com/PaulMatencio/Neighbourhood-Maps-Project/tree/master/src) folder for commented readable codes.

For the working page check this link: ( http://paulmatencio.github.io/Neighbourhood-Maps-Project )

###Project Overview:

Develop a single page application featuring a map of a neighborhood you would like to visit. Add additional functionality to this map including highlighted locations, third-party data about those locations and various ways to browse the content.

###How to use the app

* SEARCH BOX:

   Use the search box to find nearby places of locations ( cafe, restaurant, movie , atm , shopping). You can type multiple place types must be separated by blan. There are 6 hard coded locations of Paris. When you type places in the serach box, the application will look for nearby places around the current locations.

  Looking for nearby places are handled by the application. However, the application will call Google Maps place services, therefore keyword must matched Google Maps place types. Some filter to map keyword to Google Place types are attempted. Further mapping must be done.

  To change location, type :new-location as for instance :London picadelly square ot :Newyork central park. When a new location is entered, the appliaction use the Google Maps

  To use the default hard code locations, you must reload the application

  Places returned by nearby places services or search-box are used to display the Place list and to make google maps markers.

* BUTTON ( Hamburger) to show/hide the list of locations. User can check/uncheck or click on the label to select/unselect a location

* LOCATION LIST
  You can check/uncheck a location. To add a new location, use the SEARCH BOX.
  Right now, the new location replace the existing list of locations.
  in the final version, I will add the new location on top the current location

* PLACEs LIST:

   On the right you can find the places corresponding to the markers. Clicking on one place will focus the map on the place and will open an infowindow. Every place contain its marker. Thsi should be fast.

   When a info window is opened, the center of the map will slide, and depending on the size if the screen, the Places List can be hidden. The Places list can be shown as described below

   You can use the hamburger button located at top-right of your application window to  hide or show the Places list at any time. It can be useful for devices with small screen.

* HAMBURGER BUTTON:

  This button is at the top-rigth of the Place list.
  You can use this button to hide or show the Placse list and the Button toolbar.

* BUTTON TOOLBAR:

   This toolbar dynamically changes with the neighborhood. It will show the set of the markers returned be the near by search or searchbox.

   If you press one of the icon, it will re-request the search in the area with different category setting and save your categories both in memory and in your local storage. These filters will be reused when you move into a new location. When your re-load your application, these filters will be reused to filter the categories of your new location.

   For example if you have a coffee icon it will return the 10-20 most popular coffee-shop of all your current locations.

   If you move into a new location, the application will use these categories to filter the nearbysearch.

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

  The application is responsive. It has been tested on Nexus 5x, 6, 6P, Chromebook, Laptop and Desktop.

  On smaller screen size:

  The infowiew of a marker provides less information about a place.
  The listview and tool bars are hidden when user click on a marker. Use the hambuger menu on the top right corner to display them back.


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

###I was Inspired by
*The toolbar of the Project 5 below and the todo-ko that I have modified below.

* [Project5] (http://devrob.github.io/Udacity-WebDev-project5)
* [todo-ko] (https://github.com/PaulMatencio/todomvc-ko)


## TOOLS

* [Gulp plugins](http://gulpjs.com/plugins/)
    * [compress images with gulp-imagemin](https://www.npmjs.com/package/gulp-imagemin)
    * [minify javascript with gulp-uglify](https://www.npmjs.com/package/gulp-uglify/)
    * [minify inline javascript] (https://www.npmjs.com/package/gulp-minify-inline)
    * [minify CSS with gulp-minify-css](https://www.npmjs.com/package/gulp-minify-css)
    * [minify HTML with gulp-minify-html](https://www.npmjs.com/package/gulp-minify-html)

* pixlr to manipulate images


