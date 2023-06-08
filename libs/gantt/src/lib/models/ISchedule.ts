/* eslint-disable @typescript-eslint/no-unused-vars */
import { ColumnStore, ColumnStoreConfig } from "@bryntum/gantt";
import { IEventModels } from "./IEventModels";
import { IFeatureModels } from "./IFeatureModels";
import {ISelectionMode} from "./ISelectionMode";
export interface ISchedule {
    projectId: number,
    authToken: string,
    features?: IFeatureModels,
    events?: IEventModels,
    columnDef : object | ColumnStore | object[] | Partial<ColumnStoreConfig> | Partial<ColumnStoreConfig>[] | undefined,
    selectionMode? : ISelectionMode
}