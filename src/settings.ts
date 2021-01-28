"use strict";

import { dataViewObjectsParser } from "powerbi-visuals-utils-dataviewutils";
import DataViewObjectsParser = dataViewObjectsParser.DataViewObjectsParser;

export class CalendarSettings {
    //public calendarType: string = "dayGridWeek"; //or dayGridMonth
    //public calendarType: string = "dayGrid30"; 
    //public calendarType: string = "resourceTimeline";
    public headerTitle: string = "Orgs";
    public headerWidth: number = 10;
    public headerFont: string = "Arial";
    public headerFontSize: number = 12;
    public headerFontColor: string ="#000000";
    public headerBackgroundColor: string ="#FFFFFF";
    public numberOfMonths: number = 1;
    public weekendColor: string = "#f0f0f0";
    public todayColor: string = "#fcf8e3";
    public gridlineColor: string = "#f9f9f9";
    public calendarTitleFont: string ="Times New Roman";
    public calendarTitleFontColor: string ="#000000";
    public calendarTitleBackgroundColor: string ="#FFFFFF";
    public calendarTitleFontSize: number = 24;
    public calendarDaysFont: string ="Arial";
    public calendarDaysFontColor: string ="#000000";
    public calendarDaysBackgroundColor: string ="#FFFFFF";
    public calendarDaysFontSize: number = 12;
}

export class VisualSettings extends DataViewObjectsParser {
    public calendar: CalendarSettings = new CalendarSettings();
}

