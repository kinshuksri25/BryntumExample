/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/jsx-no-useless-fragment */

import { BryntumGantt } from '@bryntum/gantt-react';
import { forwardRef } from 'react';
import zipcelx from 'zipcelx';


export const GanttView = forwardRef((props: any, ref: React.LegacyRef<BryntumGantt>) =>{

    return (
        <>
        <div
          className="container"
          style={{ maxHeight: '90vh', height: '100vh' }}
        >
          <BryntumGantt
            tbar={{}}
            cellEditFeature={false}
            dependencyEditFeature={false}
            taskEditFeature={true}
            ref={(ganttRef) => {
              props.scheduleInstance.setGanttInstance(ganttRef);
              //@ts-ignore
              ref.current = ganttRef;
            }}
            features={{
            excelExporter: {
              dateFormat: 'YYYY-MM-DD HH:mm',
              zipcelx,
            },
            filter: true,
            timeRanges: true,
            projectLines: false,
            taskMenu: false,
          }}
            displaySchedulingIssueResolutionPopup={false}
          />
        </div>
      </>
      );
});