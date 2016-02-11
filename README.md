##Neighborhood map project


This is my  fifth project of the Udacity Front-end developer nanodegree. To complete this project, I have been using following.

* Javasctipt
* Javscript OO
* HTML 5 (Element Errors due to KO)
* CSS 3 (validated)
* CSS Media query
* Bootstrap CSS ( grid and Button)
* knockout.js ( async)
* Google Maps API ( async)
* Newyork times API
* Wikipedia API ( )
* Street view API
* AJAX ( jQuery)
* jQuery ( async ). jQuery is only used for searching  third party services 
* Local Storage ( store categories and locations)
* Gulp

### new version
The difference with the previous version are

* Google maps API is asynchronously loaded
* Knockoout.js is asynchronously loaded
* jQuery is asynchronously loaded
* There 5 different hard coded locations but only one is originally selected. You can select/unselect a location or add any new location to the list via the searchbox
* button to show/hide the list of locations ** Plus Sign ⊕ ** .  
* button to display the list of categories that user can use to select category palces. Multiple options is permitted ** 3 bares ☰ **
* a list of locations ( hidden by default). User can select/unselect/remove a location 
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

###How to use the app

* SEARCH BOX ( used to filter  google Maps categories or to add a new Location to the active locations list)

  Use the search box to find nearby places ( cafe, restaurant, movie , atm , shopping) of the locations which are currently selected. You can enter only one place at a time( multiple keywords will be treated as for a new location). Use the category button instead to select multiple places at once. 

  There are 5 hard coded locations in Paris. When you type a place type in the Search box, the application will look for such place type for  all the currently selected locations. The more locations are selected, the longer it will take.  The application will call Google maps nearby search services, therefore typed in keyword must matched Google Maps place types. Some filter to map keyword to Google Place types are attempted. 

  You must also use the category button ( 3 barres ☰) on the right of the Search box to select multiple categories( place type) at a time( See categories list)

  To add a new  location, type  multiple keywords as for instance London picadelly square or Newyork central park or any full address. When a new location is entered, the application will use the Google maps searchBox services to look ONLY for the coordinates ( textsearch services could be used instead), it will not use the nearby places returned by Google Search box. The coordinated returned by search-box are used to mark the location, then the nearby search services will be used to look for nearby places of the new location

  Places returned by nearby places services  are used to display the Place list and to make google maps markers.

* BUTTONS (for controlling locations and place types)

  There are 2  buttons after the SEARCH BOX

  The first button ( Plus Sign ⊕) is to display the list of Locations, and to select, unselect or remove a Location. Adding a location is done with the Search-Box. The updated list of locations is saved on Local storage when a location is removed. Select or unselect operations are not saved to local storage for the moment. When the ko.toJS() issues is solved, it will be implemented

  The second button ( 3 bares  ☰) can be used to select/unselect multiple categories ( place types). Every time, place types are updated (select or inselect), a new nearby search is performed for every selected location.

* LOCATION LIST ( Location filter)

  There are 5 hard coded locations in Paris, only 1 is selected by default. User can select them one by one afterwards using the search box. Moreover, as stated above, user can add/remove new locations using the Search Box as mentioned above.

  To select/unselect a location you must ** click on the label of that location. Checking/unchecking is not enough. **
  To add a new location, use the SEARCH BOX ( type in the new location prefixed by a double colon :. ** The new location will be placed on top of the existing list of locations. **
  To delete a new location, click on the remove button on the right of the location label. This button is shown when user pass the mouse over the label.

  When user unselect a location, all markers (map) and places (list view) of that location will be hidden. When a location is selected, markers and places will be displayed again.

* CATEGORIES LIST ( categories filter)

  Using this list ( The google maps places types), a user select/unselect multiple place types ( same as the search box). However when a category ( type) is selected, immediately the application will look the nearby places for this type for the currenz selected locations.

* PLACES LIST VIEW:

   The place list view is on the right of the application window, you can find the places corresponding to the markers. Clicking on one place will focus the map on the place and will open an info window. Every place contain a refence to its marker.

   When a info window is opened, the center of the map will slide, and depending on the size if the screen, the Places List can be hidden. The Places list can be shown as described below

   You can use the hamburger button located at top-right of your application window to  hide or show the Places list when the screen is small. It can be useful for devices with small screen.

   Places ( and markers) are moved whena location is unchecked. When all locations are unchecked or deleted, the list of places ( and the tool bars) will be hidden.

* HAMBURGER BUTTON:

  This button is at the top-rigth of the Place list. This button is hidden on large screen.

  You can use this button to hide or show the Placse list and the Button toolbar if the number of places are > 0. Clicking on this button while the list of places is empty has no effect.


* TOOLBAR ( filter place categories)

   This toolbar dynamically changes with the neighborhood. It will show the set of the markers returned be the near by search or searchbox. The number of icons is limited to 9, use the search-box to filter other google Maps categories

   If you press one of the icon, it will re-request the search in the area with different category setting. These filters will be reused when you move into a new location. When your re-load your application, these filters will be reused to filter the categories of your new location.

   For example if you have a coffee icon it will return the 10-20 most popular coffee-shop of all your current locations.

   If you move into a new location, the application will use these categories to filter the nearbysearch.

   Important: You can reset the search with the refresh button. This will clear the category filters ( both memory and local storage copies) and return the 10-20 most popular places in the area without specific categories.


* INFO WINDOW:

   You can find useful information here like the name of the place, address, opening hours, newyork times headline/link(if existing), wikipedia link for the city, newyork times articles and street views

* PHOTO VIEWER for dispaying photos for a place  [click on Photos link of the info window]

* REVIEWS LIST for a place [click on Reviews link of the info window]

  **Nothing happen** if there is no reviews

* NEW YORK times headline  and latest news for a city and country ( based of the address of the place)  [Click on NYT articles of the info window]

  **Nothing happen** if there is no article

* WIKIPEDIA [ click on W link of the info window]

  **Nothing happen** if there is no wiki

* STREET VIEW [ click on view icon of the info window]


* LOCAL STORAGE

  Added and removed locations are saved in Local storage.
  Selected place types are saved in Local storage.

  ** I have a problem with ko.toJS to save observable array, therefore ko observable array are converted into javascript array and saved **

  To reset your local storage, go to the console of your browser and type localStorage.clear() . This will clear the localStorage.myLocations and localStorage.myCategories arrays.

* RESPONSIVE APPLICATION

  The application is responsive. It has been tested on Nexus 5x, 6, 6P, Chromebook, Laptop and Desktop.

  On smaller screen size:

  The infowiew of a marker provides less information about a place.
  The listview and tool bars are hidden when user click on a marker. Use the hambuger menu on the top right corner to display them back.

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


