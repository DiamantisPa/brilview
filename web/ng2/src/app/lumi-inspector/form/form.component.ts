import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { DataService } from '../data.service';

@Component({
    selector: 'bv-lumi-inspector-form',
    templateUrl: './form.component.html',
    styleUrls: [
        '../lumi-inspector.component.css',
        './form.component.css'
    ]
})
export class FormComponent implements OnInit {

    @Output() onQuerySuccess = new EventEmitter();
    message = '';
    loadingStatus = '';
    loadingProgress = 100;
    params = {
        begin: null,
        end: null,
        timeunit: 'RUN',
        beamstatus: null,
        normtag: null,
        datatag: null,
        hltpath: null,
        unit: 'hz/ub',
        type: null,
        byls: true,
        measurement: 'Recorded'
    };
    lastQueryParams = {};

    constructor(private dataService: DataService) { }

    ngOnInit() {
        this.params.begin = '275309';
        this.params.end = '275309';
        this.params.measurement = 'Recorded';
    }

    query() {
        this.loadingStatus = 'WAITING';
        this.message = null;
        this.loadingProgress = 0;
        this.lastQueryParams = Object.assign({}, this.params);
        this.dataService.query(this.lastQueryParams)
            .finally(() => this.loadingProgress = 100)
            .subscribe(
                this.handleQuerySuccess.bind(this),
                this.handleQueryFailure.bind(this)
            );
    }

    handleQuerySuccess(data) {
        this.loadingStatus = 'OK';
        this.message = null;
        // try {
        this.onQuerySuccess.emit({data: data, params: this.lastQueryParams});
        // } catch (e) {
        //     console.log(e);
        //     this.loadingStatus = 'CHART FAILED';
        //     this.message = e;
        // }
    }

    handleQueryFailure(error) {
        this.loadingStatus = 'REQUEST FAILED';
        this.message = error;
    }

}
