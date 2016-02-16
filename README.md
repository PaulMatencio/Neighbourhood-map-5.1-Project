##Neighborhood map project


This is my  fifth project of the Udacity Front-end developer nanodegree. To complete this project, I have been using following.

* Javasctipt ( validated with jshint)
* Javscript OO
* HTML 5 (Element Errors due to KO)
* CSS 3 ("http://jigsaw.w3.org/css-validator/images/vcss")
* CSS Media query
* Bootstrap CSS (Grid and Button)
* knockout.js (async)
* Google Maps API (async)
* Newyork times API(search)
* Wikipedia API(openSearch)
* Street view API
* AJAX ( with jQuery)
* jQuery (async). jQuery is only used for searching  third party services  ( new york times and wikipedia)
* Local Storage ( store categories and locations)
* Gulp

### new version
The difference with the previous version are

* Google maps API is asynchronously loaded
* Knockoout.js is asynchronously loaded
* jQuery is asynchronously loaded
* There 5 different hard coded locations but only one is originally selected. You can select/deselect a location or add any new location to the list via the searchbox
* button to show/hide the list of locations ** Plus Sign ⊕ ** .
* button to display the list of categories that user can use to select category palces. Multiple options is permitted ** 3 bares ☰ **
* a list of locations ( hidden by default). User can select/deselect/remove a location
* a list of place types (hidden by default). user can select multiple places types
* The search box is used to add a new location via to Google Maps searchbox or to look for a place type



###Setting up Project:

The Readable and commented HTML/CSS/JavaScript files are in the '<project folder>/src' folder. Gulp is used to minify html, javasript and css files , to cmpress images, and to deploy the resulting files into the <project folder>. Check ['src'](https://github.com/PaulMatencio/Neighbourhood-map-5.1-Project/tree/master/src) folder for commented readable codes.

For the working page check this link: ( http://paulmatencio.github.io/Neighbourhood-map-5.1-Project )

###Project Overview:

Develop a single page application featuring a map of a neighborhood you would like to visit. Add additional functionality to this map including highlighted locations, third-party data about those locations and various ways to browse the content.

#### Asynchonous

Google Maps, knockout.js and jQuery are loaded asynchnously
For Google maps, a callback function is executed when the API is loaded
For jQuery and Knockout.js, the application will wait 5ms and retry 20 times until they are loaded

The application can opearte without jQuery ( third parties services will not be available)

###How to deploy the app

go to the folder of the application
run both line ommands  gulp and gulp mini-html-1

###Google page speed

  Mobil : 59//100 for speed and 99/100 for user experience
  Desktop: 79/100 for speed

###How to use the app

* There are  3 filters for place categories and 1 filter for locations.

    SEARCHBOX & input-text : It can be  used to filter existing categories place OR search for a specific category place OR to ADD a new location (multiple keywords).

    - SEARCH BAR > Single keyword: the application use this single keyword as a place type to fire Google nearbySearch services for all currently selected locations ( see Locations list). A space will reset the category list filter. Use the CATEGORIES LIST to  search for multiple place types.

    - FILTER BAR >  Single keyword starting with a double colon [:]. This keyword is used to filter a place type from the existing nearby places for thecurrently selected locations ( Location list). The FILTER keyword is not removed from the input-text of the searchbox, it is reused when user select a new location from the LOCATIONS list.

    When a new location is selected (previouly unselected), first the application fires nearby search  for this new location and results places are filtered against this keyword as long as the FILTER keyword is not removed by the user or the reset by button of the TOOLBOX.

    For the moment, when a new location is added (via Google searchbox ), places of this new location is not filtered ( since the filter keyword has been reset), however user use the filter bar to filter against this new Location.

    When user change the filter, places are filtered from the previously nearbySearch.


    - SEARCH BAR > Multiple keywords separated by a BLANK (not a comma): the application will use them to add a new location to the location list via Google map Searchbox.


    TOOL-BOX: it is equivalent to search box single keyword, however users use icon instead of text. Choices are limited by the number of icons. It is experiemental and still inconsistent. Use the Input-text or the CATEGORIES LIST  instead.

    CATEGORIES LIST:  User can filter and select multiple category places. Google map nearby searches is fired of for all the currently selected location. To reset the category list, use the reset button of the tool-box or enter a space in the input-text Searchbox.

    LOCATION LIST:  User can use this list to select/deselect a location or to remove a location. Removing a location will reset all the places for this location. The list of Location is saved in local storage. Clear the local storage to use the default locations.


* SEARCH BOX ( used to filter  google Maps categories or to ADD a new Location to the active locations list)

  Use the search box to find nearby places ( cafe, restaurant, movie , atm , shopping) of all the currently selected locations. You can enter only one place at a time( multiple keywords will be used to ADD a new location). Use the category list button to select multiple place types.

  To filter places on the map without firing Google nearbySearch services, prefix your request with a double collon [:]

  There are 5 hard coded locations in Paris, one is delected by default. When you type a place in the input text Searchbox, the application will fire Google maps nearby services for all the currently selected locations. As google map nearbySearch services is used, keyword must match Google Maps place types(a check is performed agaisnt the list) and nothing happen there is no match. Some filter to map other keywords to Google place types are attempted.

  Use the category button ( 3 barres ☰) on the right of the Search box to select multiple categories( place type) at a time( See categories list)

  To add a new  location, type  multiple keywords as for instance London picadelly square or Newyork central park or any full address. When a new location is entered, the application will use the Google maps searchBox services to look ONLY for the coordinates ( textsearch services could be used instead), it will not use the nearby places returned by Google Search box. The coordinated returned by search-box are used to mark the location, then the nearbySearch services is used to search for nearby places of the new location.

  Places returned by nearbySeach places services  are used to display the Place list and to make google maps markers.

* BUTTONS (for controlling locations and place types)

  There are 2  buttons after the SEARCH BOX

  The first button ( Plus Sign ⊕) is to display the list of Locations, and to select, deselect or remove a Location. Adding a location is done with the Search-Box. The updated list of locations is saved on Local storage when a location is removed. Select or deselect operations are not saved to local storage for the moment. When the ko.toJS() issues is solved, it will be implemented

  The second button ( 3 bares  ☰) can be used to select/deselect multiple categories ( place types). Every time, place types are updated (select or inselect), a new nearby search is performed for every selected location.

* LOCATION LIST ( Location filter)

  There are 5 hard coded locations in Paris, 5 of them are selected by default. Location entries can be selected/deselected or removed later. As stated above, user can add new locations using the SearchBox input-text ( multiple keywords)

  User can use this Location list to navigate between existing locations. When a location is selected, it will be put on top of the list,  markers, places view list and the center of the map will changed accordingly.

  To select/deselect a location you must ** click on the label of that location. Checking/unchecking is not enough. **

  To add a new location, use the SEARCH BOX (** type in at lew two keywords separated **. The new location will be placed on top of the LOCATIONs LIST. **

  To delete a location, click on the remove button on the right of the location label. This button is shown when user pass the mouse over the label.

  When user deselect a location, all markers (map) and places (list view) of that location will be removed.

  When there is no more marker on the map, the LISTVIEW and TOOLBOX are hidden.


* CATEGORIES LIST ( User can filter and select multiple place categories)

  Using this list ( The google maps places types), a user select/deselect ** multiple place types ** . However when a category ( type) is selected, immediately the application will look the nearby places for this type for the current locations that were selected.

  The diference with are  the TOOLBAR : Multiple selected options and a complete list of place types are offered to the user

* LISTVIEW ( places)

   The place listview is on the right of the application window, you can find the places corresponding to the markers. Clicking on one place will focus the map on the place and will open an infowindow. Every place contain a refence to its marker.

   When a infowindow is opened, the center of the map will slide, and depending on the size if the screen, the Listview can be hidden. Use to HAMBURGER BUTTON on top of the listview to toggle the visibiliy/invisibility of the Listview

   Places corresponding to the location of the LISTVIEW ( and markers) are removed when this location is deselected. When all locations are unchecked or deleted, the list of places ( and the tool bars) is hidden.

* HAMBURGER BUTTON:

  This button is at the top-rigth of the Place list.  User can use this button to hide or show the LISTVIEW and the TOOLBAR. Clicking on this button while the number of visible places is empty has no effect.


* TOOLBAR ( User can filter and select a single place category)

   ( Use the CATEGORIES LIST to select multiple place types)

   This toolbar dynamically changes with the neighborhood. It will show the set of the markers returned be the near by search or searchbox. The number of icons is limited to 9, use the search-box to filter other google Maps categories

   If you press one of the icon, it will re-request the search in the area with different category setting. These filters will be reused when you move into a new location. When your re-load your application, these filters will be reused to filter the categories of your new location.

   For example if you have a coffee icon it will return the 10-20 most popular coffee-shop of all your current locations.

   If you move into a new location, the application will use these categories to filter the nearbysearch.

   Important: You can reset the search with the refresh button. This will clear the category filters ( both memory and local storage copies) and return the 10-20 most popular places in the area without specific categories.


* INFO WINDOW:

   You can find useful information here like the name of the place, address, opening hours, newyork times headline/link(if existing), wikipedia link for the city, newyork times articles and street views. If jquery is not available, clicking of third parties services has no effect.
   The Infowindow is responsive, the information change with the size of the window ( CSS)

* PHOTO VIEWER to dipslay a photo slider for a place  [click on Photos link of the infowindow].

* REVIEWS LIST for a place [click on Reviews link of the info window]

  **Nothing happen** if there is no reviews

* NEW YORK times headline  and latest news for a city and country ( based of the address of the place)  [Click on NYT articles of the info window]

  **Nothing happen** if there is no article or jQuery is not loaded

* WIKIPEDIA [ click on W link of the info window]

  **Nothing happen** if there is no wiki or jQuery is not loaded

* STREET VIEW [ click on view icon of the info window]


* LOCAL STORAGE

  Added and removed locations are saved in Local storage.
  Selected place types are saved in Local storage.

  ** I have a problem with ko.toJS to save observable array, therefore ko observable array are converted into javascript array and saved **

  To reset your local storage, go to the console of your browser and type localStorage.clear() . This will clear the localStorage.myLocations and localStorage.myCategories arrays.

* RESPONSIVE APPLICATION

  The application is responsive. It has been tested on Nexus 5x, 6, 6P, Chromebook, Laptop and Desktop.

  On smaller screen size:

  The infowindow  of a marker is progessive and some information are hiiden on smaller screen

  The LISTVIEW and TOOLBAR are hidden. Use the hambuger menu on the top right corner to display them back.

*  Google Maps is asynchronously loaded and the script app.js is appened ât the end of the document script's array with the defer option by the initMap() function. However, for any reason, knockout.js may not be loaded when app.js will start, an alert box will be displayed if this happen.

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
*The toolbar is isnspired by the Project 5 below and the location lists is inspired by todo-ko that I have modified below.

* [Project5] (http://devrob.github.io/Udacity-WebDev-project5)
* [todo-ko] (https://github.com/PaulMatencio/todomvc-ko)


## TOOLS

* [Gulp plugins](http://gulpjs.com/plugins/)
    * [compress images with gulp-imagemin](https://www.npmjs.com/package/gulp-imagemin)
    * [minify javascript with gulp-uglify](https://www.npmjs.com/package/gulp-uglify/)
    * [minify inline javascript] (https://www.npmjs.com/package/gulp-minify-inline)
    * [minify CSS with gulp-minify-css](https://www.npmjs.com/package/gulp-minify-css)
    * [minify HTML with gulp-minify-html](https://www.npmjs.com/package/gulp-minify-html)
    * [citical inline CSS] (https://www.npmjs.com/package/critical)

* pixlr to manipulate images


