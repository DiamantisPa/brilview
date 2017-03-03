import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs/Rx';

declare var Plotly: any;

@Component({
    selector: 'bv-lumi-inspector-chart',
    templateUrl: './chart.component.html',
    styleUrls: ['./chart.component.css']
})
export class ChartComponent implements OnInit, AfterViewInit {

    @ViewChild('mainChart') mainChart;
    @ViewChild('secondaryChart') secondChart;
    chartData: any = [];

    constructor() { }

    ngOnInit() {
    }

    ngAfterViewInit() {
        Plotly.plot(this.mainChart.nativeElement, this.chartData);
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

    onNewData(event) {
        const newData = event.data;
        const params = event.params;
        console.log('newdata', newData);

        let name = params['type'] + ' ' + params['normtag'] + ' ';
        name += params['beamstatus'] + ' ' + params['htlpath'] + ' ';
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
                name: series.name,
                mode: 'lines'
            });
        }
        console.log(this.chartData);
        Plotly.redraw(this.mainChart.nativeElement);
    }

}
