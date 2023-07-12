import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';

@Component({
    selector: 'li-atlas-charts',
    templateUrl: './charts.component.html',
    styleUrls: ['./charts.component.css']
})
export class ChartsComponent implements OnInit, AfterViewInit {

    lumiChartVisible = true;
    ratioChartVisible = false;

    constructor() {}

    ngOnInit() {
    }

    ngAfterViewInit() {
    }

    dispatchResize() {
        window.dispatchEvent(new Event('resize'));
    }

}
