import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'bv-lumi-inspector-form',
    templateUrl: './form.component.html',
    styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit {

    message = '';
    loadingStatus = 'WAITING';
    loadingProgress = 0;

    constructor() { }

    ngOnInit() {
        setTimeout(() => {
            this.loadingStatus = 'ERROR';
            this.message = 'some kind of problem';
            this.loadingProgress = 100;
        }, 2000);
        setTimeout(() => {
            this.loadingStatus = 'WAITING';
            this.loadingProgress = 0;
        }, 4000);
        setTimeout(() => {
            this.loadingStatus = 'OK';
            this.message = 'all good';
            this.loadingProgress = 100;
        }, 6000);
    }

}
