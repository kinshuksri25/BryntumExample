/* eslint-disable @typescript-eslint/no-empty-interface */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/jsx-no-useless-fragment */
import React, { Component, createRef} from 'react';

import { BryntumGantt } from '@bryntum/gantt-react';

import { ISchedule } from './models/ISchedule';
import './gantt.module.scss';
import { GanttInstance } from './ganttInstance';
import { GanttView } from './ganttView';
//TODO -> webpack config needs to be changed and require statement needs to be deleted
require("../../../../node_modules/@bryntum/gantt/gantt.stockholm.css");


export class Gantt extends Component<ISchedule>{

  scheduleInstanceRef: any;
  ganttRef: React.Ref<BryntumGantt> | undefined;

  constructor(props : ISchedule){
    super(props);
    this.ganttRef = createRef();
    this.scheduleInstanceRef = createRef<GanttInstance | null>();
    this.scheduleInstanceRef.current = GanttInstance.getInstance(props);
  }

  render (){
    return (
      <div style={{maxHeight: '100vh', height: '100vh'}} id="schedule-instance-component">
        <GanttView ref = {this.ganttRef} scheduleInstance = {this.scheduleInstanceRef?.current}/>
      </div>
    );
  }

};

