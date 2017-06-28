import { Component, OnInit, ViewChild } from '@angular/core';
import { DatePipe } from '@angular/common';
import { LumiDataService } from '../data.service';
import { NormtagService } from '../normtag.service';
import { CompleterService } from 'ng2-completer';
import { Observable } from 'rxjs';
import 'rxjs/add/observable/from';
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
    datePipe: DatePipe;
    beginFieldIsDate = false;
    endFieldIsDate = false;
    params = {
        begin: null,
        end: null,
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
        type: ['Online', 'PLTZERO', 'HFOC', 'HFET', 'BCM1F', 'PXL', 'DT', '-normtag-'],
        unit: [['hz/mb', 'Instantaneous'], ['/mb', 'Integrated']],
        beamstatus: ['-anybeams-', 'STABLE BEAMS', 'ADJUST', 'SQUEEZE', 'FLAT TOP'],
        normtag: null
    };
    paramOptionsLoading = {
        normtag: false
    };
    protected paramOptionsShouldLoad = {
        normtag: true
    };

    validators = {
        unit: () =>  true
    };
    errors = {
        unit: null
    };

    constructor(protected lumiDataService: LumiDataService,
                protected normtagService: NormtagService,
                protected completerService: CompleterService) {
        this.paramOptions.normtag = completerService.local([]);
    }

    ngOnInit() {
        this.datePipe = new DatePipe('en-US');
    }

    query() {
        this.parseDates();
        if (!this.formIsValid()) {
            this.loadingStatus = 'WILL NOT QUERY';
            this.message = 'Form is invalid';
            return;
        }
        this.loadingStatus = 'WAITING';
        this.message = null;
        this.loadingProgress = 0;
        let requests = null;
        if (this.params.normtag && this.params.type === '-normtag-') {
            requests = Observable.from(this.params.normtag.split(','))
                .concatMap((val: string) => {
                    const params = Object.assign({}, this.params);
                    params['normtag'] = val.trim();
                    return this.lumiDataService.query(params);
                });
        } else {
            const params = Object.assign({}, this.params);
            requests = this.lumiDataService.query(params);
        }
        requests.finally(() => this.loadingProgress = 100)
            .subscribe(
                this.handleQuerySuccess.bind(this),
                this.handleQueryFailure.bind(this)
            );
    }

    parseDates() {
        if (this.params.begin instanceof Date) {
            this.params.begin = this.datePipe.transform(this.params.begin, 'MM/dd/yy HH:mm:ss');
        }
        if (this.params.end instanceof Date) {
            this.params.end = this.datePipe.transform(this.params.end, 'MM/dd/yy HH:mm:ss');
        }
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

    timeoutFocus(element, interval: Number) {
        setTimeout(() => {
            element.focus();
        }, interval);
    }

    autoFillParamsEnd() {
        if (!this.params.end) {
            this.endFieldIsDate = this.beginFieldIsDate;
            this.params.end = this.params.begin;
        }
    }

    checkNormtags() {
        if (!this.paramOptionsShouldLoad.normtag) {
            return;
        }
        this.paramOptionsLoading.normtag = true;
        this.normtagService.getIOVTags()
            .finally(() => {
                this.paramOptionsLoading.normtag = false;
                this.paramOptionsShouldLoad.normtag = false;
            })
                .subscribe((result) => this.paramOptions.normtag.data(result));
    }

}
