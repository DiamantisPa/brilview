import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { DataService } from '../data.service';

@Component({
    selector: 'li-form',
    templateUrl: './form.component.html',
    styleUrls: [
        '../lumi-inspector.component.css',
        './form.component.css'
    ]
})
export class FormComponent implements OnInit {

    @Input('constraints') constraints;
    @Output('onQuerySuccess') onQuerySuccess = new EventEmitter();
    message = '';
    loadingStatus = '';
    loadingProgress = 100;
    lastQueryParams = {};
    params = {
        begin: null,
        end: null,
        timeunit: 'RUN',
        beamstatus: 'any beams',
        normtag: null,
        datatag: null,
        hltpath: null,
        unit: 'hz/ub',
        type: 'Online',
        byls: true,
        measurement: 'Recorded'
    };
    paramOptions = {
        timeunit: ['RUN', 'FILL', 'DATE'],
        type: ['Online', 'PLTZERO', 'HFOC', 'BCM1F', 'PCC', 'DT', 'mixed'],
        unit: ['hz/ub', '/ub', '/mb'],
        beamstatus: ['any beams', 'STABLE BEAMS', 'ADJUST', 'SQUEEZE', 'FLAT TOP'],
        measurement: ['Delivered & Recorded', 'Delivered', 'Recorded']
    };
    validators = {
        unit: () => {
            if (this.constraints && this.constraints.unit) {
                if (this.constraints.unit !== this.params.unit) {
                    this.errors.unit =
                        'Existing data in chart has different unit. Please ' +
                        'either match the unit or clear the chart';
                    return false;
                }
            }
            this.errors.unit = null;
            return true;
        }
    };
    errors = {
        unit: null
    };

    constructor(private dataService: DataService) { }

    ngOnInit() {
        this.params.begin = '275309';
        this.params.end = '275309';
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
        this.onQuerySuccess.emit({data: data.data, params: this.lastQueryParams});
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
