# Introduction 
* Basic [Full Calendar](https://fullcalendar.io/) Implementation in a Power BI Visual using React
* Written by [Gregory Morris](mailto:gmorris@microsoft.com) on a rainy afternoon
* Note - unlike other calendar/gantt visuals, this is intended to show eaches, instead of aggregates

# Getting Started
* I recommend using Visual Studio Code, but you can use whatever editor you prefer
* Download and install Node.js:
    * https://nodejs.org/en/download/
* Get the code: 
    * ```git clone https://github.com/gextyr/powerbivisual_fullcalendar.git```
* Install PBI tooling:
    * ```npm i powerbi-visuals-tools```

* Set up cert: 
    * ```pbiviz --install-cert```
        * copy password
        * open newly created cert file
        * "Current Machine"->"Next"
        * "Next"
        * paste password->"Next"
        * "Place all certificates in the following store"->Browse->"Trusted Root Certificate Authorities"->"OK"->Next
        * "Finish"

* Install dependencies:
    * ```npm i```

# Build and Test
* Start debugging:
    * ```pbiviz start```
    * visit https://localhost:8080/assets/status in your browser and allow access (self-signed cert)

* Go to [powerbi service](https://www.powerbi.com)
* Enable dev visual (in settings)
* Add dev visual to a new report

* To package:
    * ```pbiviz package```
    * .pbviz file written to the dist folder

# Columns
* Identity - currently not used (may be removed)
* Grouping - (in development) used to group tasks into swimlanes
* Title - controls text displayed in event
* Color - controls the color of the event (currently requires HEX color)
* Start - controls start date of event
* End - controls end data of event
* Tool Tips - currently not used (will be used for tooltips)

# Tips
* Open f12 tools to see console
* Use console.info()|error()|debug() etc. to write to the console
* Use "debugger" keyword to break in the f12 debugger
* Saving a file will auto-rebuild

# Known bugs
* BUG: For some reason, the hex background color is being converted to a named color in some cases, which causes the drillthrough to fail when all filters are kept, e.g. Color = "Red" filter fails, and the data set uses #ff0000 (can't currently reproduce)
* BUG: Synchronizing highlighting after you filter this viz then another (can't currently reproduce)

# Sync Visual Requirements 
* (done) 30-day view (*with scroll to show additional days)  
* (done) Ability to show text in/next to each activity’s bar 
* (done) Ability to color-code bars based on some category 
* (done) Ability to display/highlight groupings of activities 
	* (done) need to add swim lane view
* (not started) *Ability to display a symbol next to each activity’s text 
	* need to add url column for image or similar
	* alternatively, we can hard-code images and allow a text field to select
* The only required fields to render should be Title, Start and End
* Provide a default color palette and allow you to select a custom color for each color group
* Possible - “skip ahead/back N days” buttons
* Possible - add "hightlight" interaction in addition to "filter" interaction
* Possible - configurable resource column width (resourceAreaWidth) and header text (resourceLabelText)
* Change column header format

# Other Backlog/TODO
* Easy
    * improve CSS (e.g. handle long titles better)
* Moderate
    * improve color column (allow named colors as well as hex)
        * add default color palette
        * add configurable default background color
    * add error checking (e.g. for dates and colors)
        * check table data types, handle gracefully
    * toggle allDay to allow for time-based views (currently always set to true)
    * figure out best way to sort tooltips
* Hard
    * possible: replace react code - there are too many disconnects and "hacky" things that have to be done to make it work right
    * improve PBI interactions for events (add highlight in addition to filter)

# Sample Screen Capture
![30 day gridview screen capture](/assets/screenshot.png)
