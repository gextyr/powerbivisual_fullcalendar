"use strict";

import { dataViewObjectsParser } from "powerbi-visuals-utils-dataviewutils";
import DataViewObjectsParser = dataViewObjectsParser.DataViewObjectsParser;

export class CalendarSettings {
    //public calendarType: string = "dayGridWeek"; //or dayGridMonth
    //public calendarType: string = "dayGrid30"; 
    //public calendarType: string = "resourceTimeline";
    public headerTitle: string = "Orgs";
    public headerWidth: number = 10;
    public headerFont: "Arial";
    public headerFontSize: number = 12;
    public headerFontColor: "#000000";
    public headerBackgroundColor: "#000000";
    public calendarTitle: string = "Calendar";
    public numberOfMonths: number = 1;
    public weekendColor: string = "#f0f0f0";
    public todayColor: string = "#fcf8e3";
    public gridlineColor: string = "#f9f9f9";
    public calendarTitleFont: "Times New Roman";
    public calendarTitleFontColor: "#000000";
    public calendarTitleBackgroundColor: "#ffffff";
    public calendarTitleSize: number = 24;
    public calendarDaysFont: "Arial";
    public calendarDaysFontColor: "#000000";
    public calendarDaysBackgroundColor: "#000000";
    public calendarDaysSize: number = 12;
}

export class VisualSettings extends DataViewObjectsParser {
    public calendar: CalendarSettings = new CalendarSettings();
}

