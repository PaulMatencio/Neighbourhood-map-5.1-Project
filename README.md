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

For the working page check this link: (http://paulmatencio.github.io/Neighbourhood-map-5.1-Project)

###Project Overview:

Develop a single page application featuring a map of a neighborhood you would like to visit. Add additional functionality to this map including highlighted locations, third-party data about those locations and various ways to browse the content.

#### Asynchonous

Google Maps, knockout.js and jQuery are loaded asynchnously.
For Google maps, a callback function is executed when the API is loaded. If map API is not available or map nearby services is not available , an alert will be raised.
For jQuery and Knockout.js, the application will wait 5ms and retry 20 times until they are loaded. If they can't be loaded, an alert will be raised.
The application can opearte without jQuery, however without jquery third parties services will not be available

###How to deploy the app

go to the folder of the application
run both line ommands  gulp and gulp mini-html-1

###Google page speed

  Mobil : 59//100 for speed and 99/100 for user experience
  Desktop: 79/100 for speed

###How to use the app


* Examples

  * Example 1 ( Locations list and filter bar)

    * Select existing locations ( if they are not yet selected) in the Locations list with the  Locations List button).The location which is just selected is placed on the top of the Locations list, nearbysearch  is launched for this location  and the results (Viewlist) on the right should be updated accordingly.
    * Add  a new location to the Locations list ( if you like). Use the Location list button located on the rigth of the filter bar to manipulate the locations list. If you add a new location, nearbysearch is launched for this location. The newly added location or the location which is just selected is placed on the top of the Locations list and the view list on the right should be updated accordingly.
    * Use the FILTER bar to filter places on the map. You can enter multiple keywords separated by a comma ",". You can add/select a new location with the filter active (the filter bar is not cleared), the application will launch nearby search for this location, and filter the results with this filter
    * A null line resets the filter > clear the filter bar and hit enter.

  * Example 2 ( categories list and filter bar)

    * Select category places with the Categories list, nearby search is lauched for these categories.
    * Use the FILTER bar to filter places on the map. You can enter multiple keywords separated by a comma ",". You can add/select a new location with the filter active (the filter bar is not cleared), the application will launch nearby search for this location with the categories , then filter with the filters.

  * Example 3 ( Locations list & filter bar)

    * Remove all the locations in the location list ( Locations list button)
    * Add your own location ( as for instance: New York central park, San Francisco bay, London Picadily circus, etc ...)
    * Use the filter bar to filter existing places on the map
    * Use the categories list to fire new nearby search for all the current active ( selected locations)

  **When the filter bar is active (input text not cleared), the application will used it when you navigate  between locations in the Locations list**


* FILTER BAR to filter places for all the selected locations.

  * keywords must be separated by a semi colon [,] . As for instance Best western:Centre commercial:Tuilierie:Jardin:Parc

  ** The filter will not be cleared by the appliaction. The application will use this filter keyword to filter places returned by nearbysearch services for this new Location.
  The filter must be cleared by the user (clear the input-text, use the reset button, etc). when the filter is cleared, an enter will reset the filter, the application will restore the original places without any filter.


* BUTTONS

  There are 3  buttons  on the right of  the Filter bar/search box

  * LOCATIONS LIST: The first button ( Plus Sign ⊕) is to display the list of Locations, and to select, deselect or remove a Location. Adding a location is done with the Search-Box. The updated list of locations is saved on Local storage when a location is removed. Select or deselect operations are not saved to local storage for the moment. When the ko.toJS() issues is solved, it will be implemented

  * CATEGORIES LIST: The second button ( 3 bares  ☰) can be used to select/deselect multiple categories ( place types). Every time, place types are updated (select or inselect), a new nearby search is performed for every selected location.

  * REFRESH BUTTON: The third button can be used to reset the category options and fire nearbysearch for all the currently selected locations in the locations list. It is the same button on top of the ToolBox.

* LOCATIONS LIST o add/select/select/remoce and  navigate between locations on the map.

  There are 6 hard coded locations in Paris, 4 of them are selected by default. Location entries can be selected/deselected or removed at any time. As stated above, you can add new locations using the SearchBox input-text ( multiple keywords)

  You can use this Location list to navigate between existing locations. When a location is selected, it is put on top of the locations list, corresponding places are marked on the map and  places are prepended in theview list, and the center of the map will changed accordingly.

  To select/deselect a location you must ** click on the label of that location. Checking/unchecking is not enough. **

  To add a new location, use the input-text

  To delete a location, click on the remove button on the right of the location label. This button is shown when user pass the mouse over the label.

  When user deselect a location, all cooresponding markers (map) and places (list view) of that location will be removed.

  When there is no more marker on the map, the LISTVIEW and TOOLBOX are hidden.


* CATEGORIES LIST ( User can filter and select multiple place categories)

  This list which contains most of the google maps places types, you can select/deselect ** multiple place types ** . When a category ( type) is selected, the application will immediately fire nearby places for this type for all the current locations that were selected.

* LISTVIEW ( places)

   The place listview is on the right of the application window, you can find the places corresponding to the markers. Clicking on one place will focus the map on the place and will open an infowindow. Every place contain a refence to its marker.

   When a infowindow is opened, the center of the map will slide, and depending on the size if the screen, the Listview can be hidden. Use to HAMBURGER BUTTON on top of the listview to toggle the visibiliy/invisibility of the Listview

   Places corresponding to the location of the LISTVIEW ( and markers) are removed when this location is deselected. When all locations are unchecked or deleted, the list of places ( and the tool bars) is hidden.

* HAMBURGER BUTTON:

  This button is at the top-rigth of the Place list.  User can use this button to hide or show the LISTVIEW and the TOOLBAR. Clicking on this button while the number of visible places is empty has no effect.


* TOOLBAR ( User can filter and select a single place category). It is experimental and is hidden by default.

   * Use the CATEGORIES LIST to select multiple place types)

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
  Selected category place types are saved in Local storage.

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


