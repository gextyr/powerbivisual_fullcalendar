# Introduction 
* Basic [Full Calendar](https://fullcalendar.io/) Implementation in a Power BI Visual using React
* Written by [Gregory Morris](mailto:gmorris@microsoft.com) on a rainy afternoon, with some improvements and fixes by @jlara005
* Note - unlike other calendar/gantt visuals, this is intended to show eaches, instead of aggregates

# Getting Started
* I recommend using Visual Studio Code, but you can use whatever editor you prefer

* PBI Docs [here](https://docs.microsoft.com/en-us/power-bi/developer/visuals/develop-circle-card)
* Download and install Node.js:
    * https://nodejs.org/en/download/
* Get the code: 
    * ```git clone https://github.com/gextyr/powerbivisual_fullcalendar.git```
* Install PBI tooling:
    * ```npm i powerbi-visuals-tools```
    * This installs the tooling to create, debug, and package new Power BI visuals
    * Note: To create a new project from scratch, use ```pbiviz new ProjectName```

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

# Settings
* Grouping Title - The title for the "grouping rows" column
* Grouping Area Width % - The percent of the overall width of the visual to use for the grouping title
* Calendar Title - the title text for the calendar
* Number of Months - the number of months to render at once (will scroll, and prev/next buttons will advance by that many)

# Tips
* Open f12 tools to see console
* Use console.info()|error()|debug() etc. to write to the console
* Use "debugger" keyword to break in the f12 debugger
* Saving a file will auto-rebuild

# Possible Issues
* (possibly resolved, needs tested) BUG: For some reason, the hex background color is being converted to a named color in some cases, which causes the drillthrough to fail when all filters are kept, e.g. Color = "Red" filter fails, and the data set uses #ff0000 (can't currently reproduce)
* (possibly resolved, needs tested) BUG: Synchronizing highlighting after you filter this viz then another (can't currently reproduce)
* BUG: repro: add all fields, then remove "grouping" and the visual doesn't reload... 
* (resolved - needs tested) BUG: the scrollbars do not show up by default in Power BI Desktop until the visual is modified - they do in Powerbi.com using dev visual
    * It seems the viewport height is not yet set during the initial update/render cycle

# Other Backlog/TODO
* ! The only required fields to render should be Title and Start
    * Currently, grouping and color are also required 
    * Improvements need to be made to handle unset color and grouping fields first
* ! “Skip ahead/back N days” buttons (instead of only 1 month at a time)
    * May need to add logic to base ahead/back function on # of days/months shown - e.g. scroll vs refresh
    * Or... make it configurable
* ! Optional: Alternating row color
    * FullCalendar doesn't seem to inject odd/even row class names into the fc-widget-content TDs
* ! Optional: Configurable fonts/colors/style
    * Title (font/color/size)
    * Group/Resource title (font/color/size)
    * Group/Resource text (font/color/size)
    * Month/Year column header (font/color/size)
    * Day column header (font/color/size)
    * Event Text  (font/size) (note - text color is set automatically, based on background color)
    * Column width?
    * Event container style?
    * Prev/Next/Today buttons
    * Weekend column bgcolor
    * Today column bgcolor
* Improve "Color" column functionality
    * Allow named colors as well as hex
    * Add default color palette + auto-select
    * Add configurable default background color
* Add error checking (e.g. for dates and colors)
    * Check table data types, handle gracefully
* Better handling for "default" single group
* Auto-scroll to earliest date (e.g. when PBI filters to some future month, so you don't get "lost")
* Add "hightlight" interaction, in addition to "filter" interaction
* Add color legend

# Refactoring TODO
* Move tooltip formatting from visual.ts to calendar.tsx
* Possible: Move State interface and initialState const from calendar.tsx to settings.ts?
* Possible: Remove react completely?

# Sample Screen Capture
![30 day gridview screen capture](/assets/screenshot.png)
