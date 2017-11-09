import { Component, OnInit } from '@angular/core';
import { BXLumiDataService } from '../data.service';

@Component({
    selector: 'bxli-form',
    templateUrl: './form.component.html',
    styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit {

    public resultStatusText: string;
    public resultMessage: string;
    public progress = 0;
    public progressStatus: string;

    public params = {
        runnum: 100000,
        lsnum: 1,
        type: 'Online',
        unit: 'hz/mb',
        normtag: null,
        without_correction: false
    }

    paramOptions = {
        type: ['Online', 'PLTZERO', 'HFOC', 'HFET', 'BCM1F', 'PXL', 'DT', '-normtag-'],
        unit: [['hz/mb', 'Instantaneous'], ['/mb', 'Integrated']],
        normtag: null
    };

    constructor(protected dataService: BXLumiDataService) {
    }

    ngOnInit() {
    }

    query() {
        this.resultStatusText = 'WAITING';
        this.resultMessage = null;
        this.progress = 1;
        this.progressStatus = 'info';
        this.dataService.query(this.params).subscribe(result => {
            console.log(result);
            this.resultStatusText = 'OK';
            this.resultMessage = null;
            this.progress = 100;
            this.progressStatus = 'success';

        }, error => {
            console.log(error);
            this.resultStatusText = 'ERROR';
            this.resultMessage = 'crap happened';
            this.progress = 100;
            this.progressStatus = 'danger';
        })
    }

}
