/* eslint-disable no-useless-catch */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-this-alias */
import axios from 'axios';
export class Importer {
    gantt;
    defaultColumns;

    setGanttInstance(ganttInstance){
        this.gantt = ganttInstance;
    }

    setDefaultColumns(defaultColumns){
        this.defaultColumns = defaultColumns;
    }

    async importData(data) {
        const me = this;
            // TODO: clone fields/configs from original project
        const project = new me.gantt.projectModelClass({
                silenceInitialCommit : false
                // To save imported data provide `sync` url and set `autoSync` true, or call `gantt.project.sync()` manually after data is imported.
                // autoSync             : true,
                // transport            : {
                //     sync : {
                //         url : 'syncUrl'
                //     }
                // }
            });

        me.project         = project;
        me.calendarManager = project.calendarManagerStore;
        me.taskStore       = project.taskStore;
        me.assignmentStore = project.assignmentStore;
        me.resourceStore   = project.resourceStore;
        me.dependencyStore = project.dependencyStore;

        Object.assign(me, {
            calendarMap : {},
            resourceMap : {},
            taskMap     : {}
        });

        project.on('schedulingConflict', ({ schedulingIssue, continueWithResolutionResult }) => {
            schedulingIssue.getResolutions()[0].resolve(schedulingIssue.getDependencies()[schedulingIssue.getDependencies().length-1]);
            continueWithResolutionResult("Resume");
        })

        project.on('cycle', ({schedulingIssue,continueWithResolutionResult }) => {
            schedulingIssue.getResolutions()[0].resolve(schedulingIssue.getDependencies()[schedulingIssue.getDependencies().length-1]);
            continueWithResolutionResult("Resume");
        })

        me.importCalendars(data);

        const tasks = me.getTaskTree(Array.isArray(data.tasks) ? data.tasks : [data.tasks]);

        // me.importResources(data);
        // me.importAssignments(data);
        

        me.taskStore.rootNode.appendChild(tasks[0].children);

        me.importDependencies(data);

        me.importProject(data);

        // Assign the new project to the gantt before launching commitAsync()
        // to let Gantt resolve possible scheduling conflicts
        me.gantt.project = project;

        await me.project.commitAsync();

        //change this
        me.importColumns(data);

        return project;
    }

    // region RESOURCES
    importResources(data) {
        this.resourceStore.add(data.resources.map(this.processResource, this));
    }

    processResource(data) {
        const { id } = data;

        delete data.id;

        data.calendar = this.calendarMap[data.calendar];

        const resource = new this.resourceStore.modelClass(data);

        this.resourceMap[id] = resource;

        return resource;
    }
    // endregion

    // region DEPENDENCIES
    importDependencies(data) {
        this.dependencyStore.add(data.dependencies.map(this.processDependency, this));
    }

    processDependency(data) {
        const
            me = this,
            { fromEvent, toEvent } = data;

        delete data.id;

        const dep = new me.dependencyStore.modelClass(data);

        dep.fromEvent = me.taskMap[fromEvent].id;
        dep.toEvent = me.taskMap[toEvent].id;

        return dep;
    }
    // endregion

    // region ASSIGNMENTS
    importAssignments(data) {
        this.assignmentStore.add(data.assignments.map(this.processAssignment, this));
    }

    processAssignment(data) {
        const me = this;

        delete data.id;

        return new me.assignmentStore.modelClass({
            units    : data.units,
            event    : me.taskMap[data.event],
            resource : me.resourceMap[data.resource]
        });
    }
    // endregion

    // region TASKS
    getTaskTree(tasks) {
        return tasks.map(this.processTask, this);
    }

    processTask(data) {
        const
            me = this,
            { id, children } = data;

        delete data.children;
        delete data.id;
        delete data.milestone;

        data.calendar = me.calendarMap[data.calendar];

        const t = new me.taskStore.modelClass(data);

        if (children) {
            t.appendChild(me.getTaskTree(children));
        }

        t._id = id;
        me.taskMap[t._id] = t;

        return t;
    }
    // endregion

    // region CALENDARS
    processCalendarChildren(children) {
        return children.map(this.processCalendar, this);
    }

    processCalendar(data) {
        const
            me = this,
            { id, children } = data,
            intervals = data.intervals;

        delete data.children;
        delete data.id;

        const t = new me.calendarManager.modelClass(Object.assign(data, { intervals }));

        if (children) {
            t.appendChild(me.processCalendarChildren(children));
        }

        t._id = id;
        me.calendarMap[t._id] = t;

        return t;
    }

    // Entry point of calendars loading
    importCalendars(data) {
        this.calendarManager.add(this.processCalendarChildren(data.calendars.children));
    }
    // endregion

    // region Columns

    importColumns(data) {
        let columns = data.columns.map(this.processColumn, this).filter(column => column);

        const columnStore = this.gantt.subGrids.locked.columns;

        // if no columns extracted apply default set (if configured)
        if (!columns.length && this.defaultColumns) {
            columns = this.defaultColumns;
        }

        if (columns.length) {
            columnStore.removeAll(true);
            columnStore.add(columns);
        }
    }

    processColumn(data) {
        const columnClass = this.gantt.columns.constructor.getColumnClass(data.type);

        // ignore unknown columns (or columns that classes are not loaded)
        if (columnClass) {
            return Object.assign({ region : 'locked' }, data);
        }
    }

    // endregion

    importProject(data) {
        if ('calendar' in data.project) {
            data.project.calendar = this.calendarMap[data.project.calendar];
        }
        Object.assign(this.project, data.project);
    }
}