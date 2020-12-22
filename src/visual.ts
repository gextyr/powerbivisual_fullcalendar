"use strict";
 import powerbi from "powerbi-visuals-api";
 
 import EnumerateVisualObjectInstancesOptions = powerbi.EnumerateVisualObjectInstancesOptions;
 import VisualObjectInstanceEnumeration = powerbi.VisualObjectInstanceEnumeration;

 import { VisualSettings } from "./settings";


 import DataView = powerbi.DataView;
 import DataViewTable = powerbi.DataViewTable;
 import DataViewMetadataColumn = powerbi.DataViewMetadataColumn;
 import DataViewTableRow = powerbi.DataViewTableRow;
 import ISelectionManager = powerbi.extensibility.ISelectionManager
 import ISelectionId = powerbi.extensibility.ISelectionId

 import VisualConstructorOptions = powerbi.extensibility.visual.VisualConstructorOptions;
 import VisualUpdateOptions = powerbi.extensibility.visual.VisualUpdateOptions;
 import IVisual = powerbi.extensibility.visual.IVisual;
 import IVisualHost = powerbi.extensibility.visual.IVisualHost;

import VisualTooltipDataItem = powerbi.extensibility.VisualTooltipDataItem;
 
 import "./../style/visual.less";
 import * as React from "react";
 import * as ReactDOM from "react-dom";
 
 import { ReactCalendar, initialState, State, calendarEvent, calendarResource } from "./calendar";
 
 //not using this yet
 import IViewport = powerbi.IViewport;

 //these are not used, but we may want them later
 import * as jQuery from 'jquery';
 import * as d3 from "d3";
 import { text, xml } from "d3";

 //used by ReactCalendar in calendar.tsx, but we shouldn't need it here
 //import FullCalendar from "@fullcalendar/react";
 
 export class Visual implements IVisual {
    private viewport: IViewport;
    private target: HTMLElement;
    private reactRoot: React.ComponentElement<any, any>;
    private settings: VisualSettings; 
    private dataView: DataView;
    private host: IVisualHost;
    private selectionManager: ISelectionManager;

    constructor(options: VisualConstructorOptions) {
        //console.info("starting");
        //this.host.tooltipService.enabled;
        this.reactRoot = React.createElement(ReactCalendar,{});
        this.target = options.element;
        ReactDOM.render(this.reactRoot, this.target);


        //this.viewport = 

        //this is a horrible hack to get around FC's auto-choice of column headers.
        //never mind - FC overrides this when something changes.
        // var headers = $("th.fc-widget-header span");
        // headers.each(function(key,value){
        //   if(value.textContent != 'Orgs')
        //   {
        //     value.textContent = value.textContent.substring(0,2);
        //   }
        // });

        //add contextmenu drillthrough
        this.target.addEventListener("contextmenu",(arg)=>{
            //debugger;
            const selection: ISelectionId = this.host.createSelectionIdBuilder()
                 .withTable(this.dataView.table,parseInt((arg.target as HTMLElement).getAttribute('fc_id')))
                 .createSelectionId();

            this.selectionManager.showContextMenu(selection?selection:{},{
                x: arg.clientX,
                y: arg.clientY
            });
            arg.preventDefault();
            //console.info("exiting context menu handler.");
            //var selectionId: ISelectionId;
        });

        //work on tool tips
        // this.target.addEventListener("mouseover",(arg)=>{
        //     const selection: ISelectionId = this.host.createSelectionIdBuilder()
        //     .withTable(this.dataView.table,parseInt((arg.target as HTMLElement).id))
        //     .createSelectionId();            
        //     this.visualHostTooltipService.show({
        //         coordinates: tooltipEventArgs.coordinates,
        //         isTouchEvent: false,
        //         dataItems: tooltipInfo,
        //         identities: selectionId ? [selectionId] : [],
        //     });
        //     console.info("exiting mouseover handler.");
        // });
        
        this.host = options.host;
        this.selectionManager = this.host.createSelectionManager();
    }

    public getContrast(hexcolor){
        hexcolor = hexcolor.replace("#", "");
        var r = parseInt(hexcolor.substr(0,2),16);
        var g = parseInt(hexcolor.substr(2,2),16);
        var b = parseInt(hexcolor.substr(4,2),16);
        var yiq = ((r*299)+(g*587)+(b*114))/1000;
        return (yiq >= 128) ? 'black' : 'white';
    }

    @logExceptions()
    public update(options: VisualUpdateOptions) {
        this.dataView=options.dataViews[0];

        this.settings = VisualSettings.parse<VisualSettings>(this.dataView); //call the default parse
        
        if (options.dataViews && options.dataViews[0]) {
            const dataView: DataView = options.dataViews[0];

            this.viewport = options.viewport;
            const { width, height } = this.viewport;
            //console.info("viewport height: " + this.viewport.height);
            
            this.settings = VisualSettings.parse(dataView) as VisualSettings;
            const object = this.settings.calendar;
            
            if (dataView != null && dataView.table != null) {
                var table: DataViewTable = dataView.table;
                var columns: DataViewMetadataColumn[] = table.columns;
                var rows: DataViewTableRow[] = table.rows;

                //var categories = this.dataView.categorical.categories[0];

                var events: calendarEvent[] = [];
                //var valueFormatterFactory = vf;
                var resources: calendarResource[] = [];

                //Get column indexes
                var tIndex: number, cIndex: number, sIndex: number, eIndex: number, gIndex: number, iIndex: number;
                var ttIndex = new Array();
                columns.forEach((column:DataViewMetadataColumn)=>{
                    tIndex=column.roles.title?column.index:tIndex;
                    cIndex=column.roles.color?column.index:cIndex;
                    sIndex=column.roles.start?column.index:sIndex;
                    eIndex=column.roles.end?column.index:eIndex;
                    gIndex=column.roles.grouping?column.index:gIndex;
                    iIndex=column.roles.image?column.index:iIndex;
                    
                    if(!column.roles.color && !column.roles.identity){ // && !column.roles.image){
                        ttIndex.push({
                            index:column.index,
                            display:column.displayName,
                            isStart:column.roles.start,
                            isEnd:column.roles.end,
                            isTitle:column.roles.title,
                            isGrouping:column.roles.grouping,
                            isImage: column.roles.image
                        })
                    }
                });

                //Build new event array
                rows.forEach((row: DataViewTableRow, rowIndex: number) => {
                    var start: Date = new Date(row[sIndex].toString());
                    //var end:Date = new Date(row[eIndex]==null?row[sIndex].toString():row[eIndex].toString());
                    //replace end date with "end of day"
                    var end:Date = new Date(row[eIndex]==null?new Date(row[sIndex].toString().substring(0,10)+"T23:59:59.000"):new Date(row[eIndex].toString().substring(0,10)+"T23:59:59.000"));
                    
                    //this is an ugly hack, and there is probably a better way to handle this in full calendar  - nextDayThreshold?
                    if(start!=end){
                        end.setDate(end.getDate()+1);
                    }

                    //console.info(new Date(row[eIndex].toString().substring(0,10)+"T23:59:59.000"));
                    // console.info(rowIndex.toString());
                    // console.info(start);
                    // console.info(end);
                    var bgcolor:string = row[cIndex].toString();
                    var grouping:string = row[gIndex].toString();

                    //Add icon to tooltip as first object
                    var imageStr:string = iIndex==null||row[iIndex]==null?"":row[iIndex].toString();
                    var s = document.createElement('span');
                    var i = document.createElement('img');
                    i.className="fc-titleimage";
                    i.src=imageStr;
                    s.appendChild(i);

                   //TODO: figure out best way to sort tooltips
                    var ttip: Array<string> = [];

                    if(imageStr){
                        ttip.push(s.outerHTML);
                    }
                    
                    var idx:number=0;
                    ttIndex.forEach((ttobj)=>{
                        idx++;
                        //add these in the order we want them displayed
                        //move this formatting logic to calendar.tsx?
                        if(ttobj.isImage) {
                            ttip[0] = '<img src="' + row[ttobj.index].toString() + '">'
                        } else if(ttobj.isTitle)
                        {
                            ttip[1] = ttobj.display + " : " + row[ttobj.index].toString();
                        }
                        else if(ttobj.isStart)
                        {
                            //figure out how to use the format string provided by PBI
                            ttip[2] = ttobj.display + " : " + row[ttobj.index].toString().substring(0,10);
                        } else if(ttobj.isEnd)
                        {
                            //figure out how to use the format string provided by PBI
                            ttip[3] = ttobj.display + " : " + row[ttobj.index].toString().substring(0,10);
                        } else if (ttobj.isGrouping) {
                            ttip[4] = ttobj.display + " : " + row[ttobj.index].toString();
                        } else {
                            ttip[5+idx] = ttobj.display + " : " + row[ttobj.index].toString();
                        }
                        //ttip.push(row[ttIndexNum].toString());
                    });

                    //auto-set text color based on brightness of background - REQUIRES HEX COLOR
                    //Note: a better way to do this would be to start with getComputedStyle of the background, 
                    //      then we can let the engine handle named colors vs hex vs rgb.
                    var txtcolor:string = this.getContrast(bgcolor);

                    const event: calendarEvent = {
                        id:rowIndex.toString(),
                        resourceId:row[gIndex].toString(),
                        title:row[tIndex].toString(),
                        backgroundColor:bgcolor,
                        textColor:txtcolor,
                        start:start,
                        end:end,
                        tooltip:ttip,
                        allDay:true,
                        image:imageStr,
                        selectionId:this.host.createSelectionIdBuilder()
                            .withTable(table,rowIndex)
                            .createSelectionId()
                    };
                    
                    events.push(event);

                    //add resources if they haven't been added already
                    if(!resources.find(x=>{x.id==row[gIndex].toString()})){
                        resources.push({id:row[gIndex].toString(),title:row[gIndex].toString()});
                    }
                });
                    
                console.info("viewport.height: "+this.viewport.height);
                //update calendar
                //console.info("updating calendar: " + this.settings.calendar.calendarType);
                ReactCalendar.update({
                    events:events, 
                    header:this.settings.calendar.header, 
                    headerWidth:this.settings.calendar.headerWidth,
                    calendarTitle: this.settings.calendar.calendarTitle,
                    numberOfMonths:this.settings.calendar.numberOfMonths,
                    selectionManager:this.selectionManager, 
                    height:this.viewport.height,
                    weekendColor: this.settings.calendar.weekendColor,
                    todayColor: this.settings.calendar.todayColor,
                    gridlineColor: this.settings.calendar.gridlineColor,
                    resources});
            }
        } else {
            this.clear();
        }
    }

    private clear() {
        ReactCalendar.update(initialState);
    }
    
    //override this if necessary
    // private static parseSettings(dataView: DataView): VisualSettings {
    //     return <VisualSettings>VisualSettings.parse(dataView);
    // }

    public enumerateObjectInstances(options: EnumerateVisualObjectInstancesOptions): VisualObjectInstanceEnumeration {
        //console.info("enumerateObjectInstances");
        const settings: VisualSettings = this.settings || <VisualSettings>VisualSettings.getDefault();
        return VisualSettings.enumerateObjectInstances(settings, options);
    }
}

//cheap and easy way to log exceptions to the console - just decorate your functions with @logExceptions()
export function logExceptions(): MethodDecorator {
    return function (target: Object, propertyKey: string, descriptor: TypedPropertyDescriptor<any>)
    : TypedPropertyDescriptor<any> {
        return {
            value: function () {
                try {
                    return descriptor.value.apply(this, arguments);
                } catch (e) {
                    console.error(e);
                    throw e;
                }
            }
        }
    }
}

//remove these from capabilities.json since we're just doing the timeline view
//need to add new capabilities for other config options
// "objects": {
//   "calendar": {
//       "displayName": "Calendar",
//       "properties": {
//           "calendarType": {
//               "displayName": "Type",
//               "description": "Type of Calendar",
//               "type": {
//                   "enumeration": [
//                       {"displayName": "Week", "displayNameKey": "week", "value": ",dayGridWeek"},
//                       {"displayName": "Month", "displayNameKey": "month", "value": "dayGridMonth"},
//                       {"displayName": "30Day", "displayNameKey": "30day", "value": "dayGrid30"}
//                   ]
//               }
//           }
//       }
//   }
// },      