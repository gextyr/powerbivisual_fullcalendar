import * as React from "react";
import FullCalendar from '@fullcalendar/react'
//import { Calendar, DayHeader, View } from "@fullcalendar/core";
//import resourceTimelinePlugin, { ResourceTimelineView } from '@fullcalendar/resource-timeline'
import resourceTimelinePlugin from '@fullcalendar/resource-timeline'
//import SpreadsheetHeader from '@fullcalendar/resource-timeline'
import interactionPlugin from '@fullcalendar/interaction' // needed for dayClick
import powerbi from "powerbi-visuals-api";
import { Visual } from "./visual";
import dayGridPlugin, { DayGridView } from '@fullcalendar/daygrid'
import ISelectionManager = powerbi.extensibility.ISelectionManager
import { createPopper, placements, viewport } from '@popperjs/core';
import tippy from "tippy.js";
import 'tippy.js/themes/light.css';
import CalendarComponent from "@fullcalendar/core/CalendarComponent";
import { xml } from "d3";
import { Calendar } from "@fullcalendar/core";
import bootstrapPlugin from "@fullcalendar/bootstrap"
import '@fullcalendar/bootstrap/main.css'
import '@fortawesome/fontawesome-free/css/all.css'
import "core-js/stable";
import "regenerator-runtime/runtime";
//import { ResourceTimelineView } from "@fullcalendar/resource-timeline";


//this should be an interface, and it should probably live in visual.ts
export class calendarEvent {
  public id: string;
  public resourceId: string;
  public title: string;
  public backgroundColor: string;
  public textColor: string;
  public start: Date;
  public end: Date;
  public tooltip = new Array();
  public allDay?: boolean = true;
  public image?: string;
  public selectionId: powerbi.visuals.ISelectionId;
}

export class calendarResource {
  public id: string;
  public title: string;  
}

export interface State {
  events: calendarEvent[],
  type?: string,
  selectionManager: ISelectionManager;
  resources?: calendarResource[];
  headerTitle: string,
  headerWidth: number,
  headerFont?: string,
  headerFontSize?: number,
  headerFontColor?: string,
  headerBackgroundColor?: string,
  height?: number | 'auto',
  calendarTitle?: string,
  numberOfMonths?: number,
  weekendColor?: string;
  todayColor?: string;
  gridlineColor?: string;
  calendarTitleFont?:  string,
  calendarTitleFontColor?:  string,
  calendarTitleBackgroundColor?:  string,
  calendarTitleSize?: number;
  calendarDaysFont?:  string,
  calendarDaysFontColor?:  string,
  calendarDaysBackgroundColor?:  string,
  calendarDaysSize?: number;
}

//Defaults
export const initialState: State = {
  events: [], // [{id:"0",grouping:"org1",title:"Blank",backgroundColor:"#f0f0f0",start:new Date(),end:new Date(),allDay:true}]
  //type: "dayGridWeek"
  //type: "dayGrid30",
  type: "resourceTimeline",
  selectionManager: null,
  resources: [{id:null,title:"NA"}], //[{id:"J1",title:"J1"},{id:"J2",title:"J2"},{id:"J3",title:"J3"},{id:"J4",title:"J4"}]
  headerTitle: "Orgs",
  headerWidth: 10,
  headerFont: "Arial",
  headerFontSize: 12,
  headerFontColor: "#000000",
  headerBackgroundColor: "#000000",
  height:'auto',
  calendarTitle: 'Calendar',
  numberOfMonths: 1,
  weekendColor: "#f0f0f0",
  todayColor: "#fcf8e3",
  gridlineColor: "#f9f9f9",
  calendarTitleFont: "Times New Roman",
  calendarTitleFontColor: "#000000",
  calendarTitleBackgroundColor: "#ffffff",
  calendarTitleSize: 24,
  calendarDaysFont: "Arial",
  calendarDaysFontColor: "#000000",
  calendarDaysBackgroundColor: "#000000",
  calendarDaysSize: 12
}

export class ReactCalendar extends React.Component{ //<{}, State> 
  constructor(props: any){
    super(props);
    this.state = initialState;
  }

  public state: State = initialState;

  //private calendarRef = React.createRef();
  calendarComponentRef = React.createRef<FullCalendar>();

  private static updateCallback: (data: object) => void = null;
  
  public static update(newState: State) {
      if(typeof ReactCalendar.updateCallback === 'function'){
        ReactCalendar.updateCallback(newState);
      }
  }

  public componentWillMount() {
    ReactCalendar.updateCallback = (newState: State): void => { this.setState(newState); };
  }

  public componentWillUnmount() {
    ReactCalendar.updateCallback = null;
  }

  //for some reason, the damned defaultView doesn't update when the State is updated
  //you'd think it would... but for now, we'll just have to deal with it.
  onChange = (events,type,selectionManager,resources,header,headerWidth,height,calendarTitle,numberOfMonths,weekendColor,todayColor,gridlineColor) => function(){
    console.info("onchange");
    this.setState({ 
      events: events, 
      type:type, 
      selectionManager:selectionManager,
      resources:resources,
      header:header,
      headerWidth:headerWidth,
      height:height,
      calendarTitle:calendarTitle,
      numberOfMonths:numberOfMonths,
      weekendColor:weekendColor,
      todayColor:todayColor,
      gridlineColor:gridlineColor
     });
  };
  
  handleEventClick = (arg) => {

    //console.info(arg.event.id);

    //this is a huge pain in the ass, because react separates the html "magic" from the actual pbiviz code
    //find the selectionId in the array?
    let sid = this.state.events.find(o=>o.id===arg.event.id);
    //console.info(sid.selectionId);
    this.state.selectionManager
      .select(sid.selectionId,true);
      //.then(ids=>{});
    
    //this is an ugly way to do it, and it think it is buggy 
    //BUG: synchronizing after if you filter this viz, then another, then come back to this
    var c: HTMLElement = arg.el; //.children[0];
    if(c.style.opacity == "0.5")
    {
      c.style.opacity = "1";
    }
    else
    {
      c.style.opacity = "0.5";
    }
  }

  //I had to set the div's ID manually here for some reason
  //FullCalendar doesn't do it for you, or at least it doesn't show up in the rendered HTML
  handleEventRender = (arg) => {
    var c: HTMLElement = arg.el;//.children[0];
    //console.info("rendering : " + arg.event.id);
    //c.id=arg.event.id;
    c.setAttribute('fc_id',arg.event.id);
    //console.info(arg);
    //console.info(c);
    
    //find the event
    let sid = this.state.events.find(o=>o.id===arg.event.id);

    //Add tooltip
    //TODO:make the formatting nicer
    var ctnt: string = '<div data-tippy-root style="padding-top:20px;padding-bottom:20px;">'; //<div class="tippy-backdrop"></div><div class="tippy-arrow"></div>';
    sid.tooltip.forEach((value:string)=>{
        ctnt+= '<div class="tippy-content" style="padding-left:20px;padding-right:20px;">'+value+'</div>';
      });
    ctnt += '</div>'; //</div></div>';

    //Add image
    if(sid.image != null && sid.image!=""){
      let calendarApi = this.calendarComponentRef.current!.getApi(); 
      var s = document.createElement('span');
      var i = document.createElement('img');
      var br = document.createElement('br');
      i.className="fc-titleimage";
      i.src=sid.image;
      s.appendChild(i);
      //s.appendChild(br);
      //c.childNodes[0].appendChild(s);
      c.childNodes[0].insertBefore(s, c.childNodes[0].firstChild);
    }
//debugger;

    tippy(c,{
      allowHTML: true,
      theme:'light',
      content:ctnt,
      placement:'auto'
    });
    // createPopper(arg.el,tooltip, {
    //   placement:'right'
    // });
    //debugger;
  }
  // addDays(date: Date, days: number): Date {
  //   date.setDate(date.getDate() + days);
  //   return date;
  // }
  // addMonths(date: Date, months: number): Date {
  //   date.setDate(date.getMonth() + months);
  //   return date;
  // }
  // handleNextClick = (arg) =>{
  //   let calendarApi = this.calendarComponentRef.current!.getApi()
  //   //calendarApi.gotoDate(this.addMonths(calendarApi.getDate(),1));
  //   calendarApi.incrementDate({months:1});
  // }
  // handlePrevClick = (arg) =>{
  //   let calendarApi = this.calendarComponentRef.current!.getApi()
  //   //calendarApi.gotoDate(this.addMonths(calendarApi.getDate(),-1));
  //   calendarApi.incrementDate({months:-1});
  // }
  // handleWindowResize = (arg)=>{
  //   //console.info("handleWindowResize");
  //   //let calendarApi = this.calendarComponentRef.current!.getApi()
  //   //console.info(arg);
  // }

  // handleViewSkeletonRender = (arg)=>{
  //   //console.info("handleViewSkeletonRender");
  //   //console.info(arg);
  // }

  handleDatesRender = (arg)=>{
    //Clear colors
    $("td.fc-widget-header .fc-sat, td.fc-widget-content.fc-sat").css("background-color", "");
    $("td.fc-widget-header .fc-sun, td.fc-widget-content.fc-sun").css("background-color", "");
    $("td.fc-widget-header .fc-today, td.fc-widget-content.fc-today").css("background-color", "");
    $(".fc-unthemed th,.fc-unthemed td,.fc-unthemed thead,.fc-unthemed tbody,.fc-unthemed .fc-divider,.fc-unthemed .fc-row,.fc-unthemed .fc-content,.fc-unthemed .fc-popover,.fc-unthemed .fc-list-view,.fc-unthemed .fc-list-heading td").css("border-color", "");

    //Update calendar colors
    $("td.fc-widget-header .fc-sat, td.fc-widget-content.fc-sat").css("background-color", this.state.weekendColor);
    $("td.fc-widget-header .fc-sun, td.fc-widget-content.fc-sun").css("background-color", this.state.weekendColor);
    $("td.fc-widget-header .fc-today, td.fc-widget-content.fc-today").css("background-color", this.state.todayColor);
    $(".fc-unthemed th,.fc-unthemed td,.fc-unthemed thead,.fc-unthemed tbody,.fc-unthemed .fc-divider,.fc-unthemed .fc-row,.fc-unthemed .fc-content,.fc-unthemed .fc-popover,.fc-unthemed .fc-list-view,.fc-unthemed .fc-list-heading td").css("border-color", this.state.gridlineColor);
  }

  getNow = ()=>{
    let calendarApi = this.calendarComponentRef.current!.getApi()
    return calendarApi.getDate().setDate(1);
  }

  componentDidMount(){
    //console.info("componentDidMount");
    let calendarApi = this.calendarComponentRef.current!.getApi();
    calendarApi.gotoDate(this.getNow());
    //console.info(calendarApi);
    // console.info(calendarApi.view);
    // console.info(calendarApi.pluginSystem.hooks.views.resourceTimeline);
    // var x = calendarApi.formatDate(calendarApi.getDate(),{day:'numeric',weekday:'narrow'});
    // console.info(x);
    
    //this works, but it gets overridden
    //$("#reactCalendar").find('.fc-toolbar > div > h2').text(this.state.calendarTitle);
  }
  

  render() {
    //console.info("height:" + this.state.height);
    //console.info("render");
    //console.info("rendering type: " + this.state.type + " events: " + this.state.events.length);

    var x = (
      <div id="reactCalendar">
      <FullCalendar
        header={{
            left: 'prev,next today', //myprev,mynext 
            //center: 'title',
            right: '' // 'resourceDayGrid' //dayGrid30 resourceDayGrid dayGridWeek
        }}
        ////viewRender  was deprecated in v4
        // viewRender={function(info){
        //   info.el.querySelector('.fc-toolbar > div > h2').innerHTML=this.state.calendarTitle;
        // }}
        // customButtons={{
        //   mynext: {
        //     text:"Next",
        //     click:this.handleNextClick,
        //     icon:'right-single-arrow'
        //   },
        //   myprev: {
        //     text:"Prev",
        //     click:this.handlePrevClick,
        //     icon:'left-single-arrow'
        //   }
        // }}
        // views={{
        //   // dayGrid30:{
        //   //   type:'dayGrid',
        //   //   duration: {days: 31},
        //   //   buttonText: 'Month',
        //   //   columnHeaderFormat:{day:'numeric'},
        //   // },
        //   resourceDayGrid:{
        //     type:'resourceTimeline',
        //     duration: {months: 1},
        //     buttonText: 'Resource',
        //     nowIndicator:true,
        //   }
        // }}
        duration={{months:this.state.numberOfMonths}}
        nowIndicator={true}
        slotLabelFormat={[
          { month: 'long', year: 'numeric' }, // top level of text
          { day: 'numeric' } // lower level of text
        ]}
        schedulerLicenseKey='CC-Attribution-NonCommercial-NoDerivatives'
        //schedulerLicenseKey='GPL-My-Project-Is-Open-Source'
        resources={this.state.resources}
        resourceAreaWidth={this.state.headerWidth.toString()+'%'}
        resourceLabelText={this.state.headerTitle}
        height={this.state.height!=undefined?this.state.height:50}
        ref={ this.calendarComponentRef }
        eventClick={this.handleEventClick}
        defaultView={this.state.type}
        events={this.state.events}
        eventRender={this.handleEventRender}    
        plugins={[ resourceTimelinePlugin, interactionPlugin, bootstrapPlugin  ]} //dayGridPlugin, interactionPlugin
        // windowResize={this.handleWindowResize}
        // viewSkeletonRender={this.handleViewSkeletonRender}
        datesRender={this.handleDatesRender}        
        //themeSystem = 'bootstrap'
        //buttonIcons={ {prev: 'fa-chevron-left', next:'fa-chevron-right'}}
      />
      </div>
    );

    // console.info("end render");
    // console.info(x.props.children.props);
    return x;
  }
}