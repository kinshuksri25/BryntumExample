/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/jsx-no-useless-fragment */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import styles from './app.module.scss';
import { Gantt } from '@svtestcode/gantt';
import React, { useEffect, useRef } from 'react';
import { ColumnStoreConfig } from '@bryntum/gantt';

export function App() {

  const scheduleRef = useRef(null);
  const columnDef: Partial<ColumnStoreConfig>[] | object[] = [
    {
      type: 'name',
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      renderer({ record }) {
        const emptyString = " ";
        if (record._data.activityid) {
          return record._data.activityid
        }
        else {
          return emptyString
        }
      },
      text: 'Activity Id',
    },
    {
      type: 'name',
      renderer: (record: any) => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore
        if (record.record._data.isCritical) {
          return "Yes"
        } else {
          return "No"
        }
      },
      text: 'Critical',
    },
    { type : 'name', field : 'name', width: 350, editor : false },
    { type : 'date', field : 'startDate', text : 'Start Date', editor : false,},
    { type : 'date', field : 'endDate',text : 'End Date', editor : false, },
    { type : 'duration', field : 'duration', editor : false },
    { type : 'percentdone', text : 'Progress' },
  ]

  return (
    <>
      <Gantt columnDef = {columnDef} projectId = {12344} authToken = {"1234"} events={{
        onCheckboxChanged: () => alert("hello")
      }} ref = {scheduleRef}/>
    </>
  );
}

export default App;





