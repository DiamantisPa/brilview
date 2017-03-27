import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { DataService } from '../data.service';
import 'rxjs/add/operator/finally';

@Component({
    selector: 'li-form',
    templateUrl: './form.component.html',
    styleUrls: [
        '../lumi-inspector.component.css',
        './form.component.css'
    ]
})
export class FormComponent implements OnInit {

    message = '';
    loadingStatus = '';
    loadingProgress = 100;
    lastQueryParams = {};

    beginDate: Date;
    endDate: Date;
    datePipe: DatePipe;
    params = {
        begin: null,
        end: null,
        // timeunit is currntly useless: nothing done in backend
        timeunit: null,
        beamstatus: '-anybeams-',
        normtag: null,
        datatag: null,
        hltpath: null,
        unit: 'hz/mb',
        type: 'Online',
        byls: true,
        without_correction: false,
    };
    paramOptions = {
        timeunit: ['RUN/FILL', 'DATE'],
        type: ['Online', 'PLTZERO', 'HFOC', 'BCM1F', 'PXL', 'DT', '-normtag-'],
        unit: [['hz/mb', 'Instantaneous'], ['/mb', 'Integrated']],
        beamstatus: ['-anybeams-', 'STABLE BEAMS', 'ADJUST', 'SQUEEZE', 'FLAT TOP'],
    };
    validators = {
        unit: () =>  true
    };
    errors = {
        unit: null
    };

    constructor(private dataService: DataService) { }

    ngOnInit() {
        this.datePipe = new DatePipe('en-US');
        this.beginDate = new Date();
        this.beginDate.setHours(0, 0, 0, 0);
        this.endDate = new Date();
        this.endDate.setHours(0, 0, 0, 0);
    }

    setTimeRangeDate(event, which) {
        console.log(event);
        const datestr = this.datePipe.transform(event, 'MM/dd/yy HH:mm:ss');
        if (which.toLowerCase() === 'begin') {
            this.beginDate = event;
            this.params.begin = datestr;
            this.autoFillParamsEnd();
        } else {
            this.endDate = event;
            this.params.end = datestr;
        }
    }

    autoFillParamsEnd() {
        if (!this.params.end) {
            this.params.end = this.params.begin;
            this.endDate = this.beginDate;
        }
    }

    query() {
        if (!this.formIsValid()) {
            this.loadingStatus = 'WILL NOT QUERY';
            this.message = 'Form is invalid';
            return;
        }
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
        this.message = null;
        this.loadingStatus = data.status;
    }

    handleQueryFailure(error) {
        this.loadingStatus = 'REQUEST FAILED';
        this.message = JSON.stringify(error);
    }

    formIsValid() {
        for (const validator of Object.keys(this.validators)) {
            if (!this.validators[validator]()) {
                return false;
            }
        }
        return true;
    }

}
