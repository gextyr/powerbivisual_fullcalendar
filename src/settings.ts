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
    public weekendColor: string = "#f0f0f0";
    public todayColor: string = "#fcf8e3";
    public gridlineColor: string = "#f9f9f9";
}

export class VisualSettings extends DataViewObjectsParser {
    public calendar: CalendarSettings = new CalendarSettings();
}

