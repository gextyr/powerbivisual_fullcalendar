# Introduction 
* Basic [Full Calendar](https://fullcalendar.io/) Implementation in a Power BI Visual using React
* Written by [Gregory Morris](mailto:gmorris@microsoft.com) on a rainy afternoon

# Getting Started
* Install PBI tooling:
    * npm i powerbi-visuals-tools

* Set up cert: 
    * pbiviz --install-cert
        * copy password
        * open newly created cert file
        * "Current Machine"->"Next"
        * "Next"
        * paste password->"Next"
        * "Place all certificates in the following store"->Browse->"Trusted Root Certificate Authorities"->"OK"->Next
        * "Finish"

* Install dependencies:
    * npm i

# Build and Test
* Start debugging:
    * pbiviz start
    * visit https://localhost:8080/assets/status in your browser and allow access (self-signed cert)

* Go to [powerbi service](https://www.powerbi.com)
* Enable dev visual (in settings)
* Add dev visual to a new report

* To package:
    * pbiviz package
    * .pbviz file written to the dist folder

# Columns
* Identity - currently not used (may be removed)
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
* BUG: Synchronizing after if you filter this viz then another repro: filter this viz then another, then come back to this (calendar.tsx)

# Todo
* Hard
    * Priority 1 : grouping / swimlane view
* Easy
    * better CSS
    * handle long titles better (wrapping causes spacing issues)
* Moderate
    * tooltips (multi-column)
    * improve color column (allow named colors as well as hex)
    * add configurable default background color
    * improve PBI interactions for events (filter/highlight/slice)
    * views other than dayGridWeek, dayGridMonth, dayGrid30
    * add error checking (e.g. for dates and colors)
        * check table data types, handle gracefully
    * toggle allDay to allow for time-based views (currently always set to true)
* Unknown
    * get settings working for defaultView
    * add other settings as needed?
    * account for other features in FullCalendar
