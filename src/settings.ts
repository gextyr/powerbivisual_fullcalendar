"use strict";

import { dataViewObjectsParser } from "powerbi-visuals-utils-dataviewutils";
import DataViewObjectsParser = dataViewObjectsParser.DataViewObjectsParser;

export class CalendarSettings {
    //public calendarType: string = "dayGridWeek"; //or dayGridMonth
    public calendarType: string = "dayGrid30"; 
    //public calendarType: string = "resourceDayGrid";
}

export class VisualSettings extends DataViewObjectsParser {
    public calendar: CalendarSettings = new CalendarSettings();
}

