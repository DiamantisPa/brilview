import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs/Rx';

import * as defaults from './chart-defaults';

declare var Plotly: any;

@Component({
    selector: 'bv-lumi-inspector-charts',
    templateUrl: './charts.component.html',
    styleUrls: ['./charts.component.css']
})
export class ChartsComponent implements OnInit, AfterViewInit {

    @ViewChild('mainChart') mainChart;
    @ViewChild('secondaryChart') secondChart;
    chartData: any = [];


    _twoCharts = false;
    set twoCharts(newVal: boolean) {
        this._twoCharts = newVal;
        setTimeout(this.onResize.bind(this), 100);
    }
    get twoCharts(): boolean {
        return this._twoCharts;
    }

    constructor() { }

    ngOnInit() {
    }

    ngAfterViewInit() {
        Plotly.plot(this.mainChart.nativeElement,
                    this.chartData,
                    defaults.getChartLayout(),
                    defaults.getChartConfig());
        Observable.fromEvent(window, 'resize')
            .debounceTime(900)
            .subscribe(this.onResize.bind(this));

        Plotly.plot(this.secondChart.nativeElement,
                    [{
                        x: [1, 2, 3, 4, 5],
                        y: [1, 2, 4, 8, 16],
                    }, {
                        x: [0, 1, 4, 9],
                        y: [1, 3, 5, 7],
                    }],
                    defaults.getChartLayout(),
                    defaults.getChartConfig());
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

    onNewData(event) {
        const newData = event.data;
        const params = event.params;
        console.log('newdata', newData);

        let name = params['type'] + ' ' + params['normtag'] + ' ';
        name += params['beamstatus'] + ' ' + params['hltpath'] + ' ';
        name += params['datatag'] + ' (' + params['unit'] + ')';
        const newSeries = [];
        if (params['measurement'] === 'Delivered & Recorded' ||
            params['measurement'] === 'Delivered') {
            newSeries.push({
                yfield: 'delivered',
                name: 'Delivered ' + name
            });
        }
        if (params['measurement'] === 'Delivered & Recorded' ||
            params['measurement'] === 'Recorded') {
            newSeries.push({
                yfield: 'recorded',
                name: 'Recorded ' + name
            });
        }

        const x = [];
        for (const xval of newData['tssec']) {
            x.push(xval * 1000);
        }
        for (const series of newSeries) {
            this.chartData.push({
                x: x,
                y: newData[series.yfield],
                name: series.name
            });
        }
        console.log(this.chartData);
        Plotly.redraw(this.mainChart.nativeElement);
    }

}
