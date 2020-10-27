import * as React from "react";
import FullCalendar from '@fullcalendar/react'
import powerbi from "powerbi-visuals-api";
import { Visual } from "./visual";
import { Calendar, DayHeader } from "@fullcalendar/core";
import dayGridPlugin, { DayGridView } from '@fullcalendar/daygrid'
import ISelectionManager = powerbi.extensibility.ISelectionManager
//import resourceTimelinePlugin, { ResourceTimelineView } from '@fullcalendar/resource-timeline'
//import resourceDayGridPlugin from '@fullcalendar/resource-daygrid';
import { createPopper, placements } from '@popperjs/core';
import tippy from "tippy.js";
import 'tippy.js/themes/light.css';

export class calendarEvent {
  public id: string;
  public grouping: string;
  public title: string;
  public backgroundColor: string;
  public textColor: string;
  public start: Date;
  public end: Date;
  public tooltip = new Array();
  public allDay?: boolean = true;
  public selectionId: powerbi.visuals.ISelectionId;
}

export interface State {
  events: calendarEvent[],
  type?: string,
  selectionManager: ISelectionManager;
}

//Defaults
export const initialState: State = {
  events: [], // [{id:"0",grouping:"org1",title:"Blank",backgroundColor:"#f0f0f0",start:new Date(),end:new Date(),allDay:true}]
  //type: "dayGridWeek"
  type: "dayGrid30",
  selectionManager: null
}

export class ReactCalendar extends React.Component<{}, State> {
  constructor(props: any){
    super(props);
    this.state = initialState;
  }

  public state: State = initialState;
  
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
  onChange = (events,type,selectionManager) => function(){
    //console.info("onchange");
    this.setState({ events: events, type:type, selectionManager:selectionManager });
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
    //debugger;
    
    //this is just some dummy color-changing code - it doesn't actually interact with Power BI
    // var c: HTMLElement = arg.el.children[0];
    // console.info("Clicked: " + arg.event.title);
    // if(c.style.backgroundColor=="green"){
    //   c.style.backgroundColor="blue";
    // } else {
    //   c.style.backgroundColor="green";
    // } 
  }

  //I had to set the div's ID manually here for some reason
  //FullCalendar doesn't do it for you, or at least it doesn't show up in the rendered HTML
  handleEventRender = (arg) => {
    var c: HTMLElement = arg.el.children[0];
    //console.info("rendering : " + arg.event.id);
    c.id=arg.event.id;
    //todo - replace with identity column

    //console.info(arg);
    let sid = this.state.events.find(o=>o.id===arg.event.id);
    
    //make the formatting nicer
    var ctnt: string = '<div data-tippy-root style="padding-top:20px;padding-bottom:20px;">'; //<div class="tippy-backdrop"></div><div class="tippy-arrow"></div>';
    sid.tooltip.forEach((value:string)=>{
        ctnt+= '<div class="tippy-content" style="padding-left:20px;padding-right:20px;">'+value+'</div>';
      });
    ctnt += '</div>'; //</div></div>';

    tippy(arg.el,{
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

  render() {
    //console.info("rendering type: " + this.state.type + " events: " + this.state.events.length);
    return (
      <div id="reactCalendar">
      <FullCalendar
        //schedulerLicenseKey='CC-Attribution-NonCommercial-NoDerivatives'
        header={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,dayGridWeek,dayGrid30'
        }}
        views={{
          dayGrid30:{
            type:'dayGrid',
            duration: {days: 30},
            buttonText: '30 Days',
            columnHeaderFormat:{day:'numeric'}
          }}
        }
        eventClick={this.handleEventClick}
        defaultView={this.state.type}
        plugins={[ dayGridPlugin ]}  //resourceDayGridPlugin, resourceTimelinePlugin
        events={this.state.events}
        eventRender={this.handleEventRender}
      />
      </div>
    )
  }
}