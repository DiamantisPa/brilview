import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';

@Component({
    selector: 'li-totlumi-charts',
    templateUrl: './charts.component.html',
    styleUrls: ['./charts.component.css']
})
export class ChartsComponent implements OnInit, AfterViewInit {

    lumiChartVisible = true;
    cumulativeChartVisible = false;
    ratioChartVisible = false;
    pileupChartVisible = false;
    correlationChartVisible = false;

    constructor() {}

    ngOnInit() {
    }

    ngAfterViewInit() {
    }

    dispatchResize() {
        window.dispatchEvent(new Event('resize'));
    }

}
