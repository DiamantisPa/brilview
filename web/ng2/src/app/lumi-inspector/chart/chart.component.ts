import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs/Rx';

declare var Plotly: any;
// const plotly = require('plotly.js/dist/plotly.min.js');

@Component({
    selector: 'bv-lumi-inspector-chart',
    templateUrl: './chart.component.html',
    styleUrls: ['./chart.component.css']
})
export class ChartComponent implements OnInit, AfterViewInit {

    @ViewChild('mainChart') mainChart;
    @ViewChild('secondaryChart') secondChart;
    constructor() { }

    ngOnInit() {
    }

    ngAfterViewInit() {
        Plotly.plot(this.mainChart.nativeElement, [{
            x: [1, 2, 3, 4, 5],
            y: [1, 2, 4, 8, 16],
        }]);
        Observable.fromEvent(window, 'resize')
            .debounceTime(900)
            .subscribe(this.onResize.bind(this));
        Plotly.plot(this.secondChart.nativeElement, [{
            x: [1, 2, 3, 4, 5],
            y: [1, 2, 4, 8, 16],
        }]);
        Observable.fromEvent(window, 'resize')
            .debounceTime(900)
            .subscribe(this.onResize.bind(this));
    }

    onResize(event) {
        const update = {
            autosize: true,
            width: null,
            margin: {
                t: 10,
                r: 10,
                b: 40,
                l: 40
            }
        };
        Plotly.relayout(this.mainChart.nativeElement, update);
        Plotly.relayout(this.secondChart.nativeElement, update);
    }

}
