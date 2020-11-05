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
* Identity - ideally unique - used as drillthrough filter
* Grouping - used to group tasks into swimlanes
* Title - controls text displayed in event
* Color - controls the color of the event (currently requires HEX color)
* Start - controls start date of event
* End - controls end data of event
* Image - url (or base64 encoded image) to display in-line with the title
* Tool Tips - currently not used (will be used for tooltips)

# Tips
* Open f12 tools to see console
* Use console.info()|error()|debug() etc. to write to the console
* Use "debugger" keyword to break in the f12 debugger
* Saving a file will auto-rebuild

# Possible Issues
* BUG: For some reason, the hex background color is being converted to a named color in some cases, which causes the drillthrough to fail when all filters are kept, e.g. Color = "Red" filter fails, and the data set uses #ff0000 (can't currently reproduce)
* BUG: Synchronizing highlighting after you filter this viz then another (can't currently reproduce)
* BUG: repro: add all fields, then remove "grouping" and the visual doesn't reload... 

# Other Backlog/TODO
* The only required fields to render should be Title and Start
* “Skip ahead/back N days” buttons (instead of 1 month at a time)
* Change column header format (currently day number and first letter of week day)
* Improve "Color" column functionality
    * Allow named colors as well as hex
    * Add default color palette + auto-select
    * Add configurable default background color
* Add error checking (e.g. for dates and colors)
    * Check table data types, handle gracefully
* Figure out best way to sort tooltips
* Better handling for "default" single group
* Configure image height

# Possible Future Backlog
* Replace react code - there are too many disconnects and "hacky" things that have to be done to make it work right
* Add "hightlight" interaction, in addition to "filter" interaction

# Sample Screen Capture
![30 day gridview screen capture](/assets/screenshot.png)
