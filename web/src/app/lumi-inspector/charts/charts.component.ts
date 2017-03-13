import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';


@Component({
    selector: 'li-charts',
    templateUrl: './charts.component.html',
    styleUrls: ['./charts.component.css']
})
export class ChartsComponent implements OnInit, AfterViewInit {

    _twoCharts = false;
    set twoCharts(newVal: boolean) {
        this._twoCharts = newVal;
    }
    get twoCharts(): boolean {
        return this._twoCharts;
    }

    constructor() {}

    ngOnInit() {
    }

    ngAfterViewInit() {
    }


}
