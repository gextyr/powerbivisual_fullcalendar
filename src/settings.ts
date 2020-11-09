"use strict";

import { dataViewObjectsParser } from "powerbi-visuals-utils-dataviewutils";
import DataViewObjectsParser = dataViewObjectsParser.DataViewObjectsParser;

export class CalendarSettings {
    //public calendarType: string = "dayGridWeek"; //or dayGridMonth
    //public calendarType: string = "dayGrid30"; 
    //public calendarType: string = "resourceTimeline";
    public header: string = "Orgs";
    public headerWidth: number = 10;
    public calendarTitle: string = "Calendar";
    public numberOfMonths: number = 1;
}

export class VisualSettings extends DataViewObjectsParser {
    public calendar: CalendarSettings = new CalendarSettings();
}

