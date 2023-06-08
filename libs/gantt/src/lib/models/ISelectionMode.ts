import {CheckColumnConfig } from '@bryntum/gantt';

export interface ISelectionMode {
    row? : boolean,
    cell? : boolean,
    rowCheckboxSelection? : boolean,
    multiSelect? : boolean,
    checkbox? : boolean | CheckColumnConfig,
    showCheckAll? : boolean,
    deselectFilteredOutRecords? : boolean,
    includeChildren? : boolean,
    preserveSelectionOnPageChange? : boolean,
    preserveSelectionOnDatasetChange? : boolean,
    deselectOnClick? : boolean
}