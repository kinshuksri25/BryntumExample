/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { IEventModels } from "./models/IEventModels";
import { IFeatureModels } from "./models/IFeatureModels";
import { ISchedule } from "./models/ISchedule";
import { BryntumGantt } from '@bryntum/gantt-react';
//@ts-ignore
import { Importer } from './DataImporter';
import { GridExcelExporterConfig, Mask, Toast } from "@bryntum/gantt";
import { AxiosProgressEvent } from "axios";
import {dataSet} from "./models/data"

export class GanttInstance implements ISchedule {

    projectId;
    authToken;
    features;
    events;
    columnDef;
    private ganttRef!: BryntumGantt;
    private importerInstance : any;
    private static instance: GanttInstance;

    private constructor(props: ISchedule) {
        this.projectId = props.projectId;
        this.authToken = props.authToken;
        this.features = props.features;
        this.events = props.events;
        this.columnDef = props.columnDef;
        this.importerInstance = new Importer();
    }

    static getInstance (props?: ISchedule) {
        if(!GanttInstance.instance && props){
            GanttInstance.instance = new GanttInstance(props);
        }
        return GanttInstance.instance;
    }


    setGanttInstance(ganttRef : BryntumGantt){
        this.ganttRef = ganttRef;
        this.initalizeData();
    }

    async initalizeData(){
        //@ts-ignore
        if(this.ganttRef && this.ganttRef.ganttInstance){
            try{
                const data = await this.getMockData();
                //@ts-ignore
                this.importerInstance.setGanttInstance(this.ganttRef.ganttInstance);
                this.importerInstance.setDefaultColumns(this.columnDef);
                await this.importerInstance.importData(data);
                this.addToolbarButtons();
                this.activitySearchFilterOption();
                //uncomment this to see the enddate discrepancy
                // this.ganttRef.instance.project.resourceStore.add(new this.ganttRef.instance.project.resourceStore.modelClass({
                //     'id' : 1234,
                //     'name' : 'test',
                //     'resourceid' : 1234
                // }));
                
                // or uncomment this to see the enddate discrepancy
                // await this.ganttRef?.instance?.project?.commitAsync();

            }catch(error){
                //TODO --> need to show error to the user
                console.error(error);
                Toast.show({
                    html: "Oops! Something went wrong !",
                    color: "red",
                    centered: true,
                    floating: true,
                })
            }
        }
    }

    getMockData (){
        return new Promise((resolve)=>{
            setTimeout(()=>{
                resolve(dataSet);
            },4000);
        });    
    }

    getGanttInstance(){
        return this.ganttRef;
    }

    addToolbarButtons(){
        //@ts-ignore
        const toolbarOptions = {
            type : "buttongroup",
            id: "toolbar",
            floating: true,
            align: 'right',
            items : []
        };

        //@ts-ignore
        this.ganttRef?.instance?.tbar?.add({...toolbarOptions});
    }

    private activitySearchFilterOption(){
        const activitySearch = {
            type                 : 'textfield',
            // Label used for material, hidden in other themes
            label                : 'Find tasks',
            // Placeholder for others
            placeholder          : 'Find tasks',
            id                   : 'quick-filter',
            style                : {marginRight: '5px'},
            clearable            : true,
            keyStrokeChangeDelay : 100,
            triggers             : {
                filter : {
                    align : 'end',
                    cls   : 'b-fa b-fa-filter'
                }
            },
            onChange: (data: {value: string}) => {
                this.onActivitySearchFilter(data.value)
            }
        }

        this.ganttRef?.instance?.tbar?.add(activitySearch);
    }

    private onActivitySearchFilter(value: string){
        if (value === '') {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            //@ts-ignore
            this.ganttRef?.instance?.store?.removeFilter('activitySearch');
        }
        else {
            value = value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            //@ts-ignore
            this.ganttRef?.instance?.store?.filter([{
                id : 'activitySearch',
                filterBy: (task: { name: string; }) => task.name && task.name.match(new RegExp(value, 'i'))
               
            }]);
        }
    }
}
